import { useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useLocalStorage } from "usehooks-ts";
import { Link, useLocation } from "wouter";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Button, Stack } from "@mui/joy";

import { createGame } from "@/actions/game";
import { AddPlayerFormFields } from "@/components/common/AddPlayerForm";
import AppUpdateModal from "@/components/common/AppUpdateModal";
import View from "@/components/common/View";
import AppUpdateContext from "@/components/contexts/AppUpdateContext";
import GameContext from "@/components/contexts/GameContext";
import { GameBox } from "@/game";
import { ScoringMode } from "@/types";

import GameBoxesSection from "./components/GameBoxesSection";
import Header from "./components/Header";
import PlayerSection from "./components/PlayerSection";
import ScoringModeSection from "./components/ScoringModeSection";

const CreateGameView = () => {
  const [, navigate] = useLocation();
  const { dispatch } = useContext(GameContext);
  const { checkForUpdate } = useContext(AppUpdateContext);

  const [scoringMode, setScoringMode] = useState<ScoringMode>(ScoringMode.Host);
  const [gameBoxes, setGameBoxes] = useLocalStorage<GameBox[]>("gameBoxes", [
    GameBox.Base,
  ]);

  useEffect(() => {
    const handle = setTimeout(() => checkForUpdate(), 1000);
    return () => clearTimeout(handle);
  }, [checkForUpdate]);

  const handleSubmit = (values: AddPlayerFormFields) => {
    dispatch(createGame({ scoringMode, gameBoxes, ...values }));
    navigate("/forest");
  };

  return (
    <View header={<Header />}>
      <Stack
        direction="column"
        justifyContent="space-between"
        gap={5}
        sx={{ minHeight: "100%" }}
      >
        <Stack gap={3}>
          <ScoringModeSection
            scoringMode={scoringMode}
            onChange={setScoringMode}
          />
          <GameBoxesSection gameBoxes={gameBoxes} onChange={setGameBoxes} />
          <PlayerSection
            scoringMode={scoringMode}
            gameBoxes={gameBoxes}
            onSubmit={handleSubmit}
          />
        </Stack>

        <Button
          variant="plain"
          color="primary"
          startDecorator={<InfoOutlinedIcon />}
          component={Link}
          to="/about"
        >
          <FormattedMessage
            id="CreateGameView.about"
            defaultMessage="About this app"
          />
        </Button>
      </Stack>

      <AppUpdateModal />
    </View>
  );
};

export default CreateGameView;
