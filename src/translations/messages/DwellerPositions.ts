import { MessageDescriptor, defineMessages } from "react-intl";

import { DwellerPosition } from "@/game";

const messages = defineMessages<DwellerPosition, MessageDescriptor>({
  TOP: {
    id: "DwellerPositions.Top",
    defaultMessage: "Top",
  },
  RIGHT: {
    id: "DwellerPositions.Right",
    defaultMessage: "Right",
  },
  BOTTOM: {
    id: "DwellerPositions.Bottom",
    defaultMessage: "Bottom",
  },
  LEFT: {
    id: "DwellerPositions.Left",
    defaultMessage: "Left",
  },
});

export default messages;
