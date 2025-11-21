import { useCallback, useState } from "react";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";

import { Box, Button, Stack, Typography } from "@mui/joy";

import QrCodeScanner from "@/components/common/QrCodeScanner";
import { Game, Player } from "@/game";
import {
  ErrorPlayerImportResult,
  ImportErrorType,
  importPlayer,
} from "@/game/sharing";

import UnavailableCardsAlert from "./UnavailableCardsAlert";

const ERROR_MESSAGES = defineMessages({
  [ImportErrorType.InvalidData]: {
    id: "AddPlayerDrawer.ImportPane.error.invalidData",
    defaultMessage: "The scanned data is invalid.",
  },
  [ImportErrorType.InvalidSchema]: {
    id: "AddPlayerDrawer.ImportPane.error.invalidSchema",
    defaultMessage: "The scanned data is incompatible with this app version.",
  },
  [ImportErrorType.AppVersionMismatch]: {
    id: "AddPlayerDrawer.ImportPane.error.appVersionMismatch",
    defaultMessage: "The player uses an incompatible app version.",
  },
  [ImportErrorType.GameBoxesMismatch]: {
    id: "AddPlayerDrawer.ImportPane.error.gameBoxesMismatch",
    defaultMessage: "The player has selected different expansions than you.",
  },
  [ImportErrorType.UnavailableCards]: {
    id: "AddPlayerDrawer.ImportPane.error.unavailableCards",
    defaultMessage: "Some cards are not available for import.",
  },
});

interface ImportPaneProps {
  game: Game;
  isActive: boolean;
  onSubmit: (player: Player) => void;
}

const ImportPane = ({ game, isActive, onSubmit }: ImportPaneProps) => {
  const intl = useIntl();

  const [errorResult, setErrorResult] =
    useState<ErrorPlayerImportResult | null>(null);

  const handleScanResult = useCallback(
    (data: string) => {
      const importResult = importPlayer(game, data);
      if (importResult.success) {
        onSubmit(importResult.player);
      } else {
        setErrorResult(importResult);
      }
    },
    [game, onSubmit],
  );

  const hasUnavailableCards =
    errorResult?.error === ImportErrorType.UnavailableCards;
  const errorMessage = errorResult
    ? intl.formatMessage(ERROR_MESSAGES[errorResult.error])
    : null;

  return hasUnavailableCards ? (
    <Stack
      gap={3}
      justifyContent={{ xs: "space-between", md: "normal" }}
      sx={{ aspectRatio: "1/1" }}
    >
      <UnavailableCardsAlert result={errorResult} />

      <Button fullWidth color="warning" onClick={() => setErrorResult(null)}>
        <FormattedMessage
          id="AddPlayerDrawer.ImportPane.retry"
          defaultMessage="Retry"
        />
      </Button>
    </Stack>
  ) : (
    <Box>
      <Typography level="body-sm" sx={{ mb: 2 }}>
        <FormattedMessage
          id="AddPlayerDrawer.ImportPane.instructions"
          defaultMessage="Scan the QR code displayed on another player's phone to add their forest to the scoring."
        />
      </Typography>
      <QrCodeScanner
        disabled={!isActive}
        error={errorMessage}
        onResult={handleScanResult}
        onRetry={() => setErrorResult(null)}
      />
    </Box>
  );
};

export default ImportPane;
