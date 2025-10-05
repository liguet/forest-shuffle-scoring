import { FormattedMessage } from "react-intl";

import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { Card, CardContent, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

interface InstructionsCardProps {
  sx?: SxProps;
}

const InstructionsCard = ({ sx }: InstructionsCardProps) => (
  <Card variant="solid" color="primary" sx={sx}>
    <CardContent orientation="horizontal" sx={{ alignItems: "center" }}>
      <QrCodeScannerIcon sx={{ fontSize: "50px" }} />
      <Typography level="body-lg" textColor="inherit">
        <FormattedMessage
          id="ExportView.InstructionsCard.text"
          defaultMessage="Share your scoring results by showing this QR code to your game host."
        />
      </Typography>
    </CardContent>
  </Card>
);

export default InstructionsCard;
