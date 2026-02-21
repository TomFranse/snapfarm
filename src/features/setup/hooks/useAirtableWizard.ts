/**
 * useAirtableWizard - Wizard state and handlers for Airtable setup dialog.
 *
 * Extracted from AirtableDialog to reduce component complexity.
 */

import { useState, useEffect, useCallback } from "react";
import { useAirtableSetup } from "./useAirtableSetup";
import { useEnvWriter } from "./useEnvWriter";
import { useWizardStep } from "./useWizardStep";
import { updateSetupSectionStatus } from "@utils/setupUtils";

const TOTAL_STEPS = 4;
const STEPS = ["Create PAT", "Choose Base & Table", "Validate Connection", "Complete Setup"];

export interface UseAirtableWizardOptions {
  open: boolean;
  onClose: () => void;
  onStatusChange?: () => void;
}

export interface StepValidation {
  canProceed: boolean;
  buttonText: string;
  disabled?: boolean;
}

interface StepValidationInput {
  activeStep: number;
  form: { apiKey: string; baseId: string; tableId: string };
  structure: { tableStructure: unknown; loading: boolean; error: string | null };
  env: { envWritten: boolean; writingEnv: boolean };
}

function computeStepValidation(input: StepValidationInput): StepValidation {
  const { activeStep, form, structure, env } = input;
  switch (activeStep) {
    case 0:
      return { canProceed: !!form.apiKey, buttonText: "Next" };
    case 1:
      return { canProceed: !!(form.baseId && form.tableId), buttonText: "Next" };
    case 2: {
      const isValid = structure.tableStructure !== null && !structure.loading && !structure.error;
      return {
        canProceed: isValid,
        buttonText: isValid ? "Next" : "Validating...",
        disabled: structure.loading,
      };
    }
    case 3:
      return {
        canProceed: true,
        buttonText: env.envWritten ? "Finish Setup" : "Save to .env",
        disabled: env.writingEnv,
      };
    default:
      return { canProceed: false, buttonText: "Next" };
  }
}

export function useAirtableWizard({ open, onClose, onStatusChange }: UseAirtableWizardOptions) {
  const [airtableApiKey, setAirtableApiKey] = useState("");
  const [airtableBaseId, setAirtableBaseId] = useState("");
  const [airtableTableId, setAirtableTableId] = useState("");

  const { fetchTableStructure, tableStructure, loadingStructure, structureError, resetStructure } =
    useAirtableSetup();
  const envWriter = useEnvWriter();
  const wizard = useWizardStep({ totalSteps: TOTAL_STEPS, onReset: resetStructure });

  useEffect(() => {
    if (!open) {
      wizard.reset();
      setAirtableApiKey("");
      setAirtableBaseId("");
      setAirtableTableId("");
      resetStructure();
    }
  }, [open, resetStructure, wizard]);

  const handleNext = useCallback(async () => {
    const { activeStep, goToNext } = wizard;
    if (activeStep === 0) {
      if (!airtableApiKey) return;
      await goToNext();
      return;
    }
    if (activeStep === 1) {
      if (!airtableBaseId || !airtableTableId) return;
      await goToNext();
      await fetchTableStructure(airtableApiKey, airtableBaseId, airtableTableId);
      return;
    }
    if (activeStep === 2) await goToNext();
  }, [wizard, airtableApiKey, airtableBaseId, airtableTableId, fetchTableStructure]);

  const handleBack = useCallback(() => {
    wizard.goToPrevious();
  }, [wizard]);

  const handleSave = useCallback(async () => {
    const { isLastStep } = wizard;

    if (!isLastStep) {
      await handleNext();
      return;
    }

    if (!envWriter.envWritten) {
      await envWriter.writeEnv({
        VITE_AIRTABLE_API_KEY: airtableApiKey,
        VITE_AIRTABLE_BASE_ID: airtableBaseId,
        VITE_AIRTABLE_TABLE_ID: airtableTableId,
      });
      return;
    }

    updateSetupSectionStatus("airtable", "completed");
    onStatusChange?.();
    onClose();
  }, [
    wizard,
    envWriter,
    airtableApiKey,
    airtableBaseId,
    airtableTableId,
    handleNext,
    onStatusChange,
    onClose,
  ]);

  const handleSkip = useCallback(() => {
    updateSetupSectionStatus("airtable", "skipped");
    onStatusChange?.();
    onClose();
  }, [onStatusChange, onClose]);

  const stepValidation = computeStepValidation({
    activeStep: wizard.activeStep,
    form: { apiKey: airtableApiKey, baseId: airtableBaseId, tableId: airtableTableId },
    structure: { tableStructure, loading: loadingStructure, error: structureError },
    env: { envWritten: envWriter.envWritten, writingEnv: envWriter.writingEnv },
  });
  const { activeStep, isFirstStep, isLastStep } = wizard;
  const showSkipButton = activeStep === 0 || activeStep === 1;

  return {
    steps: STEPS,
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
    handleNext,
    handleBack,
    handleSave,
    handleSkip,
    fetchTableStructure,
  };
}
