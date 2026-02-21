import { useState, useEffect } from "react";
import { Box, Typography, Button, Stepper, Step, StepLabel } from "@mui/material";
import { SetupCard } from "../SetupCard";
import { SetupDialog } from "../SetupDialog";
import { EnvVariablesDisplay } from "../EnvVariablesDisplay";
import { AirtableFormFields } from "../AirtableFormFields";
import { AirtableDescription } from "../AirtableDescription";
import { AirtablePatInstructions } from "../AirtablePatInstructions";
import { TableStructureDisplay } from "../TableStructureDisplay";
import { ConfigurationViewDialog } from "../ConfigurationViewDialog";
import { AirtableConfigView } from "../views/AirtableConfigView";
import { useAirtableSetup } from "../../hooks/useAirtableSetup";
import { useConfigurationData } from "../../hooks/useConfigurationData";
import { useConfigurationReset } from "../../hooks/useConfigurationReset";
import { useAirtableWizard } from "../../hooks/useAirtableWizard";
import { getSetupSectionsState } from "@utils/setupUtils";
import type { SetupStatus } from "@utils/setupUtils";
import type { AirtableTableStructure } from "@shared/services/airtableService";
import type { AirtableConfiguration } from "../../types/config.types";

interface AirtableSectionProps {
  onStatusChange?: () => void;
}

export const AirtableCard = ({ onStatusChange }: AirtableSectionProps) => {
  const { isConfigured } = useAirtableSetup();
  const state = getSetupSectionsState();
  const status: SetupStatus = isConfigured ? "completed" : state.airtable;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const handleCardClick = () => {
    if (status === "completed") {
      setViewDialogOpen(true);
    } else {
      setDialogOpen(true);
    }
  };

  return (
    <>
      <SetupCard
        title="Configure Airtable"
        description="Set up Airtable as an alternative data backend. Data-only; authentication still requires Supabase."
        status={status}
        onClick={handleCardClick}
      />
      <AirtableDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onStatusChange={onStatusChange}
      />
      <AirtableViewDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        onStatusChange={onStatusChange}
      />
    </>
  );
};

interface AirtableDialogProps {
  open: boolean;
  onClose: () => void;
  onStatusChange?: () => void;
}

function AirtableStep2Validate({
  tableStructure,
  loadingStructure,
  structureError,
  onBack,
  onRetry,
}: {
  tableStructure: AirtableTableStructure | null;
  loadingStructure: boolean;
  structureError: string | null;
  onBack: () => void;
  onRetry: () => void;
}) {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Validating Connection
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Fetching table structure from Airtable...
      </Typography>

      <TableStructureDisplay
        structure={tableStructure}
        loading={loadingStructure}
        error={structureError}
      />

      {structureError && (
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={onBack} sx={{ mr: 1 }}>
            Back
          </Button>
          <Button variant="contained" onClick={onRetry} disabled={loadingStructure}>
            Retry
          </Button>
        </Box>
      )}
    </>
  );
}

function AirtableStep3Complete({
  tableStructure,
  airtableApiKey,
  airtableBaseId,
  airtableTableId,
  envWritten,
}: {
  tableStructure: AirtableTableStructure | null;
  airtableApiKey: string;
  airtableBaseId: string;
  airtableTableId: string;
  envWritten: boolean;
}) {
  const variables = [
    { name: "VITE_AIRTABLE_API_KEY", value: airtableApiKey },
    { name: "VITE_AIRTABLE_BASE_ID", value: airtableBaseId },
    { name: "VITE_AIRTABLE_TABLE_ID", value: airtableTableId },
  ];

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Setup Complete
      </Typography>

      <TableStructureDisplay structure={tableStructure} />

      {!envWritten ? (
        <EnvVariablesDisplay
          variables={variables}
          title="Environment Variables"
          description="Click 'Save to .env' to write these values to your .env file:"
        />
      ) : (
        <EnvVariablesDisplay
          variables={variables}
          title="Environment Variables Saved"
          description="These values have been written to your .env file:"
          showRestartWarning={true}
        />
      )}
    </>
  );
}

const AirtableDialog = ({ open, onClose, onStatusChange }: AirtableDialogProps) => {
  const wizard = useAirtableWizard({ open, onClose, onStatusChange });

  const {
    steps,
    activeStep,
    isFirstStep,
    isLastStep,
    showSkipButton,
    stepValidation,
    airtableApiKey,
    setAirtableApiKey,
    airtableBaseId,
    setAirtableBaseId,
    airtableTableId,
    setAirtableTableId,
    tableStructure,
    loadingStructure,
    structureError,
    envWriter,
    handleBack,
    handleSave,
    handleSkip,
    fetchTableStructure,
  } = wizard;

  const handleRetry = () => {
    void fetchTableStructure(airtableApiKey, airtableBaseId, airtableTableId);
  };

  return (
    <SetupDialog
      open={open}
      onClose={onClose}
      onSave={handleSave}
      title="Configure Airtable"
      saveButtonText={stepValidation.buttonText}
      saveButtonDisabled={!stepValidation.canProceed || !!stepValidation.disabled}
      showCancel={showSkipButton}
      closeOnSave={isLastStep}
      additionalActions={
        showSkipButton && (
          <Button variant="outlined" onClick={handleSkip}>
            Skip Airtable Setup
          </Button>
        )
      }
    >
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <AirtablePatInstructions apiKey={airtableApiKey} onApiKeyChange={setAirtableApiKey} />
      )}

      {activeStep === 1 && (
        <>
          <AirtableDescription />
          <AirtableFormFields
            baseId={airtableBaseId}
            tableId={airtableTableId}
            onBaseIdChange={setAirtableBaseId}
            onTableIdChange={setAirtableTableId}
          />
        </>
      )}

      {activeStep === 2 && (
        <AirtableStep2Validate
          tableStructure={tableStructure}
          loadingStructure={loadingStructure}
          structureError={structureError}
          onBack={handleBack}
          onRetry={handleRetry}
        />
      )}

      {activeStep === 3 && (
        <AirtableStep3Complete
          tableStructure={tableStructure}
          airtableApiKey={airtableApiKey}
          airtableBaseId={airtableBaseId}
          airtableTableId={airtableTableId}
          envWritten={envWriter.envWritten}
        />
      )}

      {!isFirstStep && !isLastStep && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button onClick={handleBack}>Back</Button>
          <Box />
        </Box>
      )}
    </SetupDialog>
  );
};

interface AirtableViewDialogProps {
  open: boolean;
  onClose: () => void;
  onStatusChange?: () => void;
}

const AirtableViewDialog = ({ open, onClose, onStatusChange }: AirtableViewDialogProps) => {
  const { data, loading, error, refetch } = useConfigurationData<AirtableConfiguration>("airtable");
  const { reset, resetting } = useConfigurationReset("airtable", () => {
    onStatusChange?.();
  });

  useEffect(() => {
    if (open) {
      const syncConfig = async () => {
        try {
          const { syncConfiguration } = await import("../../services/configService");
          const result = await syncConfiguration();
          if (result.success) {
            void refetch();
          }
        } catch {
          // Silently handle sync errors - configuration will still be displayed
        }
      };
      void syncConfig();
    }
  }, [open, refetch]);

  return (
    <ConfigurationViewDialog
      open={open}
      onClose={onClose}
      title="Airtable Configuration"
      sectionName="Airtable"
      onReset={reset}
      resetInProgress={resetting}
    >
      <AirtableConfigView config={data} loading={loading} error={error} />
    </ConfigurationViewDialog>
  );
};
