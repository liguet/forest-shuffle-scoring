import { ReactNode } from "react";
import { FormattedMessage } from "react-intl";
import { useBoolean } from "usehooks-ts";

import EditIcon from "@mui/icons-material/Edit";
import { Link, Stack, Typography } from "@mui/joy";

import { Cave, Game, getDwellersOfForest } from "@/game";
import { getForest } from "@/game/helpers";
import { useBreakpoint } from "@/utils/hooks";

import CaveDrawer from "./CaveDrawer";

interface CardCountProps {
  label: ReactNode;
  value: number;
  endDecorator?: ReactNode;
}

const CardCount = ({ label, value, endDecorator }: CardCountProps) => {
  const isScreenXs = useBreakpoint((breakpoints) => breakpoints.only("xs"));

  return (
    <Typography level="body-sm">
      <Typography fontWeight="lg">{label}</Typography>{" "}
      <Typography endDecorator={endDecorator}>
        {isScreenXs ? (
          value
        ) : (
          <FormattedMessage
            id="ForestView.ForestSummary.CardCount.count"
            defaultMessage="{value, plural, =1 {#{nbsp}card} other {#{nbsp}cards}}"
            values={{ value, nbsp: <>&nbsp;</> }}
          />
        )}
      </Typography>
    </Typography>
  );
};

interface ForestSummaryProps {
  game: Game;
  playerId: string;
  onCaveChange: (cave: Cave) => void;
}

const ForestSummary = ({
  game,
  playerId,
  onCaveChange,
}: ForestSummaryProps) => {
  const {
    value: isCaveDrawerOpen,
    setTrue: openCaveDrawer,
    setFalse: closeCaveDrawer,
  } = useBoolean(false);

  const forest = getForest(game, playerId);
  if (!forest) {
    return null;
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-evenly"
      gap={4}
    >
      <CardCount
        label={
          <FormattedMessage
            id="ForestView.ForestSummary.labels.woodyPlants"
            defaultMessage="Woody plants:"
          />
        }
        value={forest.woodyPlants.length}
      />
      <CardCount
        label={
          <FormattedMessage
            id="ForestView.ForestSummary.labels.dwellers"
            defaultMessage="Dwellers:"
          />
        }
        value={getDwellersOfForest(forest).length}
      />
      <CardCount
        label={
          <FormattedMessage
            id="ForestView.ForestSummary.labels.cave"
            defaultMessage="Cave:"
          />
        }
        value={forest.cave.cardCount}
        endDecorator={
          <Link color="neutral" onClick={openCaveDrawer}>
            <EditIcon />
          </Link>
        }
      />

      <CaveDrawer
        open={isCaveDrawerOpen}
        game={game}
        playerId={playerId}
        onClose={closeCaveDrawer}
        onConfirm={onCaveChange}
      />
    </Stack>
  );
};

export default ForestSummary;
