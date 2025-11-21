import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import EditIcon from "@mui/icons-material/Edit";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { DialogContent, DialogTitle, ModalClose } from "@mui/joy";

import OptionsBar from "@/components/common/OptionsBar";
import ResponsiveDrawer from "@/components/common/ResponsiveDrawer";
import { Game, Player } from "@/game";
import { useHasCamera } from "@/utils/hooks";

import ImportPane from "./ImportPane";
import ManualPane from "./ManualPane";

enum AddPlayerMode {
  MANUAL = "manual",
  IMPORT = "import",
}

interface AddPlayerDrawerProps {
  open: boolean;
  game: Game;
  onConfirm: (player: Player) => void;
  onClose: () => void;
}

const AddPlayerDrawer = ({
  open = false,
  game,
  onConfirm,
  onClose,
}: AddPlayerDrawerProps) => {
  const hasCamera = useHasCamera();

  const [mode, setMode] = useState<AddPlayerMode>(AddPlayerMode.MANUAL);

  useEffect(() => {
    if (open) {
      setMode(AddPlayerMode.MANUAL);
    }
  }, [open]);

  const handleSubmit = (player: Player) => {
    onConfirm?.(player);
    onClose?.();
  };

  const handleClose = () => {
    setMode(AddPlayerMode.MANUAL);
    onClose?.();
  };

  return (
    <ResponsiveDrawer open={open} onClose={handleClose}>
      <ModalClose />

      <DialogTitle>
        <FormattedMessage
          id="AddPlayerDrawer.title"
          defaultMessage="Add player"
        />
      </DialogTitle>

      <DialogContent sx={{ m: 1.5 }}>
        {hasCamera && (
          <OptionsBar value={mode} onChange={setMode} sx={{ mb: 2 }}>
            <OptionsBar.Option icon={<EditIcon />} value={AddPlayerMode.MANUAL}>
              <FormattedMessage
                id="AddPlayerDrawer.mode.manual"
                defaultMessage="Enter details"
              />
            </OptionsBar.Option>
            <OptionsBar.Option
              icon={<QrCodeScannerIcon />}
              value={AddPlayerMode.IMPORT}
            >
              <FormattedMessage
                id="AddPlayerDrawer.mode.import"
                defaultMessage="Scan QR code"
              />
            </OptionsBar.Option>
          </OptionsBar>
        )}

        {mode === AddPlayerMode.MANUAL && (
          <ManualPane game={game} onSubmit={handleSubmit} />
        )}
        {mode === AddPlayerMode.IMPORT && (
          <ImportPane game={game} onSubmit={handleSubmit} />
        )}
      </DialogContent>
    </ResponsiveDrawer>
  );
};

export default AddPlayerDrawer;
