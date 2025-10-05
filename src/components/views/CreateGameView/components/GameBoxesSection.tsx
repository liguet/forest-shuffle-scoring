import { FormattedMessage } from "react-intl";

import { Stack, Typography } from "@mui/joy";

import GameBoxSelector from "@/components/common/GameBoxSelector";
import { GameBox } from "@/game";

interface GameBoxesSectionProps {
  gameBoxes: GameBox[];
  onChange: (value: GameBox[]) => void;
}

const GameBoxesSection = ({ gameBoxes, onChange }: GameBoxesSectionProps) => (
  <Stack direction="column">
    <Typography level="body-md" sx={{ mb: 1 }}>
      <FormattedMessage
        id="CreateGameView.GameBoxesSection.header"
        defaultMessage="Expansions"
      />
    </Typography>

    <GameBoxSelector
      value={gameBoxes}
      ignore={[GameBox.Base]}
      onChange={onChange}
    />
  </Stack>
);

export default GameBoxesSection;
