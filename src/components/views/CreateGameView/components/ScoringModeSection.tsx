import { FormattedMessage } from "react-intl";

import AddIcon from "@mui/icons-material/AddCircle";
import MobileScreenShareIcon from "@mui/icons-material/MobileScreenShare";
import { Stack, Typography } from "@mui/joy";

import OptionsBar from "@/components/common/OptionsBar";
import { ScoringMode } from "@/types";

interface ScoringModeSectionProps {
  scoringMode: ScoringMode;
  onChange: (value: ScoringMode) => void;
}

const ScoringModeSection = ({
  scoringMode,
  onChange,
}: ScoringModeSectionProps) => (
  <Stack direction="column" gap={1}>
    <OptionsBar value={scoringMode} onChange={onChange}>
      <OptionsBar.Option icon={<AddIcon />} value={ScoringMode.Host}>
        <FormattedMessage
          id="CreateGameView.ScoringModeSection.header.host"
          defaultMessage="Score a new game"
        />
      </OptionsBar.Option>
      <OptionsBar.Option
        icon={<MobileScreenShareIcon />}
        value={ScoringMode.Guest}
      >
        <FormattedMessage
          id="CreateGameView.ScoringModeSection.header.guest"
          defaultMessage="Join scoring"
        />
      </OptionsBar.Option>
    </OptionsBar>

    <Typography level="body-sm">
      {scoringMode === ScoringMode.Host ? (
        <FormattedMessage
          id="CreateGameView.ScoringModeSection.description.host"
          defaultMessage="When scoring a new game, you can either select the cards for all players or let them join later to add their own forest on their own phone."
        />
      ) : (
        <FormattedMessage
          id="CreateGameView.ScoringModeSection.description.guest"
          defaultMessage="When joining the scoring of a game started by another player, you just need to select the cards in your own forest — your selection can then be shared with the game master."
        />
      )}
    </Typography>
  </Stack>
);

export default ScoringModeSection;
