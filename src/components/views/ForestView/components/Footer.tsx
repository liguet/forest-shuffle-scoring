import { useContext } from "react";
import { FormattedMessage } from "react-intl";
import { useBoolean } from "usehooks-ts";
import { Link } from "wouter";

import CheckCircle from "@mui/icons-material/CheckCircle";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Box, Button, Divider, Stack } from "@mui/joy";

import { addPlayer, setCave } from "@/actions/game";
import AddPlayerDrawer from "@/components/common/AddPlayerDrawer";
import GameContext from "@/components/contexts/GameContext";
import { Cave } from "@/game";
import { ScoringMode } from "@/types";
import { MAX_PLAYERS } from "@/utils/constants";

import ForestSummary from "./ForestSummary";

const Footer = () => {
  const { scoringMode, game, playerId, dispatch } = useContext(GameContext);

  const {
    value: isAddPlayerDrawerOpen,
    setTrue: openAddPlayerDrawer,
    setFalse: closeAddPlayerDrawer,
  } = useBoolean(false);

  const hasMaxPlayers = game?.players?.length === MAX_PLAYERS;

  const handleCaveChange = (cave: Cave) => {
    if (!playerId) return;
    dispatch(setCave({ playerId, cave }));
  };

  return (
    <Box>
      {game && playerId && (
        <ForestSummary
          game={game}
          playerId={playerId}
          onCaveChange={handleCaveChange}
        />
      )}

      <Divider
        sx={{
          my: 2,
          boxShadow: "0 0 0 100vmax var(--Divider-lineColor)",
          clipPath: "inset(0px -100vmax)",
        }}
      />

      {scoringMode === ScoringMode.Host ? (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-around"
          gap={2}
        >
          <Button
            fullWidth
            variant="soft"
            color="neutral"
            startDecorator={<PersonAddIcon />}
            disabled={hasMaxPlayers}
            onClick={openAddPlayerDrawer}
          >
            <FormattedMessage
              id="ForestView.Footer.nextPlayer"
              defaultMessage="Next player"
            />
          </Button>
          <Button
            fullWidth
            startDecorator={<EmojiEventsIcon />}
            color="primary"
            component={Link}
            to="/scoring"
          >
            <FormattedMessage
              id="ForestView.Footer.scoreGame"
              defaultMessage="Score game"
            />
          </Button>
        </Stack>
      ) : (
        <Button
          fullWidth
          startDecorator={<CheckCircle />}
          component={Link}
          to="/export"
        >
          <FormattedMessage
            id="ForestView.Footer.completeScoring"
            defaultMessage="Complete scoring"
          />
        </Button>
      )}

      {game && (
        <AddPlayerDrawer
          open={isAddPlayerDrawerOpen}
          game={game}
          onConfirm={(player) => dispatch(addPlayer({ player }))}
          onClose={closeAddPlayerDrawer}
        />
      )}
    </Box>
  );
};

export default Footer;
