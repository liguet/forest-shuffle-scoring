import * as _ from "lodash-es";
import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { Box, Button, Stack, Typography } from "@mui/joy";

import AddPlayerForm, {
  AddPlayerFormFields,
} from "@/components/common/AddPlayerForm";
import { Game, Player, createPlayer } from "@/game";

interface ManualPaneProps {
  game: Game;
  onSubmit: (player: Player) => void;
}

const ManualPane = ({ game, onSubmit }: ManualPaneProps) => {
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
    () => _.uniq(game.deck.caves.map((c) => c.name)),
    [game.deck.caves],
  );

  const handleCreate = (values: AddPlayerFormFields) => {
    const cave = game.deck.caves.find((c) => c.name === values.caveName);
    if (!cave) {
      return;
    }

    const player = createPlayer(values.playerName, {
      ...cave,
      cardCount: values.caveCardCount,
    });
    onSubmit(player);
  };

  return (
    <Box>
      <Typography level="body-sm" sx={{ mb: 2 }}>
        <FormattedMessage
          id="AddPlayerDrawer.ManualPane.instructions"
          defaultMessage="Please enter the name of the player you want to add and the number of cards they have in their cave."
        />
      </Typography>

      <Stack
        gap={3}
        justifyContent={{ xs: "space-between", md: "normal" }}
        sx={{ aspectRatio: "1/1" }}
      >
        <FormProvider {...form}>
          <AddPlayerForm
            caveNameOptions={caveNameOptions}
            existingPlayers={game.players}
            onSubmit={handleSubmit(handleCreate)}
          />
        </FormProvider>

        <Button
          fullWidth
          color="primary"
          disabled={!isValid}
          onClick={handleSubmit(handleCreate)}
        >
          <FormattedMessage
            id="AddPlayerDrawer.ManualPane.create"
            defaultMessage="Add player"
          />
        </Button>
      </Stack>
    </Box>
  );
};

export default ManualPane;
