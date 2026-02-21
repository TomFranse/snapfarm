import { Box, Typography, Alert, CircularProgress, Divider } from "@mui/material";
import { ConfigurationItem } from "../ConfigurationItem";
import { SensitiveDataDisplay } from "../SensitiveDataDisplay";
import type { SupabaseConfiguration } from "../../types/config.types";

interface SupabaseConfigViewProps {
  config: SupabaseConfiguration | null;
  loading: boolean;
  error: string | null;
}

const PUBLISHABLE_KEY_NAME = "VITE_SUPABASE_PUBLISHABLE_KEY";

function getApiKeyHelpText(keyName: string | undefined): string {
  return keyName === PUBLISHABLE_KEY_NAME
    ? "Publishable key (recommended)"
    : "Anonymous key (legacy)";
}

interface SupabaseConnectionDetailsProps {
  config: SupabaseConfiguration;
}

function getKeyDisplayProps(
  key: { set?: boolean; name?: string } | undefined,
  defaultName: string
) {
  return {
    isSet: key?.set ?? false,
    keyName: key?.name ?? defaultName,
  };
}

function SupabaseConnectionDetails({ config }: SupabaseConnectionDetailsProps) {
  const apiKeyProps = getKeyDisplayProps(config.keyKey, PUBLISHABLE_KEY_NAME);
  const urlKeyProps = getKeyDisplayProps(config.urlKey, "VITE_SUPABASE_URL");

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Connection Details
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {config.url && (
        <ConfigurationItem
          label="Project URL"
          value={config.url}
          canCopy={true}
          helpText="Your Supabase project URL"
        />
      )}

      <SensitiveDataDisplay
        label="API Key"
        {...apiKeyProps}
        helpText={getApiKeyHelpText(config.keyKey?.name)}
      />

      <SensitiveDataDisplay label="Project URL Key" {...urlKeyProps} />
    </Box>
  );
}

/**
 * View component for Supabase configuration
 */
export const SupabaseConfigView = ({ config, loading, error }: SupabaseConfigViewProps) => {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!config || !config.configured) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        Supabase is not configured. Please complete the setup first.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" paragraph>
        Your Supabase connection is configured with the following settings:
      </Typography>

      <SupabaseConnectionDetails config={config} />

      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong> To modify these settings, you'll need to reset this configuration
          and set it up again.
        </Typography>
      </Alert>
    </Box>
  );
};
