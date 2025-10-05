import * as _ from "lodash-es";
import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { Button, Stack, Typography } from "@mui/joy";

import AddPlayerForm, {
  AddPlayerFormFields,
} from "@/components/common/AddPlayerForm";
import { GameBox } from "@/game";
import * as Caves from "@/game/caves";
import { ScoringMode } from "@/types";

interface PlayerSectionProps {
  scoringMode: ScoringMode;
  gameBoxes: GameBox[];
  onSubmit: (values: AddPlayerFormFields) => void;
}

const PlayerSection = ({
  scoringMode,
  gameBoxes,
  onSubmit,
}: PlayerSectionProps) => {
  const form = useForm<AddPlayerFormFields>({
    mode: "onChange",
    defaultValues: {
      playerName: "",
      caveName: "REGULAR_CAVE",
      caveCardCount: 0,
    },
  });
  const {
    formState: { isValid },
    handleSubmit,
  } = form;

  const caveNameOptions = useMemo(
    () =>
      _.uniq(
        Object.values(Caves)
          .filter((c) => gameBoxes.includes(c.gameBox))
          .map((c) => c.name),
      ),
    [gameBoxes],
  );

  return (
    <Stack direction="column">
      <Typography level="body-md" sx={{ mb: 1 }}>
        <FormattedMessage
          id="CreateGameView.PlayerSection.header"
          defaultMessage="Player"
        />
      </Typography>

      <Typography level="body-sm" sx={{ mb: 2 }}>
        {scoringMode === ScoringMode.Host ? (
          <FormattedMessage
            id="CreateGameView.PlayerSection.instructions.host"
            defaultMessage="Please enter the name of the player you want to start with and the number of cards in their cave below."
          />
        ) : (
          <FormattedMessage
            id="CreateGameView.PlayerSection.instructions.guest"
            defaultMessage="Please enter your name and the number of cards in your cave below."
          />
        )}
      </Typography>

      <FormProvider {...form}>
        <AddPlayerForm
          caveNameOptions={caveNameOptions}
          onSubmit={handleSubmit(onSubmit)}
        />
      </FormProvider>

      <Button
        fullWidth
        sx={{ mt: 3 }}
        disabled={!isValid}
        onClick={handleSubmit(onSubmit)}
      >
        <FormattedMessage
          id="CreateGameView.PlayerSection.startScoring"
          defaultMessage="Start scoring"
        />
      </Button>
    </Stack>
  );
};
export default PlayerSection;
