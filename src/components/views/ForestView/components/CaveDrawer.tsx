import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { Button, DialogContent, DialogTitle, ModalClose } from "@mui/joy";

import CaveFormControls, {
  CaveFormControlsFields,
} from "@/components/common/CaveFormControls";
import ResponsiveDrawer from "@/components/common/ResponsiveDrawer";
import { Cave, Game } from "@/game";
import { getForest } from "@/game/helpers";
import invariant from "@/utils/invariant";

interface CaveDrawerProps {
  open: boolean;
  game: Game;
  playerId: string;
  onConfirm: (cave: Cave) => void;
  onClose: () => void;
}

const getFormValues = (cave?: Cave) => ({
  caveName: cave?.name ?? "REGULAR_CAVE",
  caveCardCount: cave?.cardCount ?? 0,
});

const transitionDuration = 300;

const CaveDrawer = ({
  open,
  game,
  playerId,
  onConfirm,
  onClose,
}: CaveDrawerProps) => {
  const cave = getForest(game, playerId)?.cave;
  const form = useForm<CaveFormControlsFields>({
    mode: "onChange",
    defaultValues: getFormValues(cave),
  });
  const {
    formState: { isValid },
    handleSubmit,
    reset,
  } = form;

  const nameOptions = useMemo(() => {
    const caveCards = cave ? [...game.deck.caves, cave] : game.deck.caves;
    return Array.from(new Set(caveCards.map((c) => c.name)));
  }, [game.deck.caves, cave]);

  useEffect(() => {
    if (!open) {
      reset(getFormValues(cave));
    }
  }, [open, reset, cave]);

  const handleConfirm = (values: CaveFormControlsFields) => {
    const newCave =
      values.caveName === cave?.name
        ? cave
        : game.deck.caves.find((c) => c.name === values.caveName);
    invariant(newCave);

    onConfirm?.({ ...newCave, cardCount: values.caveCardCount });
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
          id="ForestView.CaveDrawer.title"
          defaultMessage="Cave"
        />
      </DialogTitle>

      <DialogContent sx={{ m: 1.5 }}>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(handleConfirm)}>
            <CaveFormControls nameOptions={nameOptions} />
            <Button
              fullWidth
              type="submit"
              color="primary"
              disabled={!isValid}
              sx={{ mt: 3 }}
            >
              <FormattedMessage
                id="ForestView.CaveDrawer.confirm"
                defaultMessage="Confirm"
              />
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </ResponsiveDrawer>
  );
};

export default CaveDrawer;
