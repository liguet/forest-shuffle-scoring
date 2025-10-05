import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import EditIcon from "@mui/icons-material/Edit";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { DialogContent, DialogTitle, ModalClose } from "@mui/joy";

import OptionsBar from "@/components/common/OptionsBar";
import ResponsiveDrawer from "@/components/common/ResponsiveDrawer";
import { Game, Player } from "@/game";
import { useHasCamera, usePrevious } from "@/utils/hooks";

import ImportPane from "./ImportPane";
import ManualPane from "./ManualPane";

const transitionDuration = 300;

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

  const [isClosing, setIsClosing] = useState(false);
  const [mode, setMode] = useState<AddPlayerMode>(AddPlayerMode.MANUAL);

  const prevOpen = usePrevious(open);
  useEffect(() => {
    if (prevOpen && !open) {
      setIsClosing(true);
      const timeout = setTimeout(() => setIsClosing(false), transitionDuration);
      return () => clearTimeout(timeout);
    }
  }, [open, prevOpen]);

  useEffect(() => {
    if (!open && !isClosing) {
      setMode(AddPlayerMode.MANUAL);
    }
  }, [open, isClosing]);

  const handleSubmit = (player: Player) => {
    onConfirm?.(player);
    onClose?.();
  };

  return (
    <ResponsiveDrawer
      anchorSmall="bottom"
      anchorBig="right"
      breakpoint="sm"
      size="md"
      open={open}
      onClose={onClose}
      sx={{
        "--Drawer-horizontalSize": "400px",
        "--Drawer-transitionDuration": `${transitionDuration}ms`,
        "--Drawer-verticalSize": "auto",
      }}
    >
      <ModalClose />

      <DialogTitle>
        <FormattedMessage
          id="AddPlayerDrawer.title"
          defaultMessage="Add player"
        />
      </DialogTitle>

      {(open || isClosing) && (
        <DialogContent sx={{ m: 1.5 }}>
          {hasCamera && (
            <OptionsBar value={mode} onChange={setMode} sx={{ mb: 2 }}>
              <OptionsBar.Option
                icon={<EditIcon />}
                value={AddPlayerMode.MANUAL}
              >
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
      )}
    </ResponsiveDrawer>
  );
};

export default AddPlayerDrawer;
