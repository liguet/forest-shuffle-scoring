import * as _ from "lodash-es";
import { useMemo } from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";

import WarningIcon from "@mui/icons-material/Warning";
import { Alert, Box, List, ListItem, Typography } from "@mui/joy";

import {
  DwellerCardDto,
  ErrorPlayerImportResult,
  WoodyPlantCardDto,
} from "@/game/sharing";
import { getLocalizedCardName } from "@/translations/messages/CardNames";
import { getLocalizedCaveName } from "@/translations/messages/CaveNames";
import DwellerPositionMessages from "@/translations/messages/DwellerPositions";
import TreeSymbolMessages from "@/translations/messages/TreeSymbols";

const MAX_LIST_ITEMS = 5;

const getCardSpecifier = (
  intl: IntlShape,
  card: DwellerCardDto | WoodyPlantCardDto,
  extra?: string[],
): string | null => {
  const localizedName = getLocalizedCardName(intl, card.name);
  if (!localizedName) {
    return null;
  }

  let fullExtra: string[] = [];
  if (card.treeSymbol) {
    const localizedTreeSymbol = intl.formatMessage(
      TreeSymbolMessages[card.treeSymbol],
    );
    if (localizedTreeSymbol !== localizedName) {
      fullExtra = [...fullExtra, localizedTreeSymbol];
    }
  }
  if (extra) {
    fullExtra = [...fullExtra, ...extra];
  }

  return fullExtra.length === 0
    ? localizedName
    : `${localizedName} (${fullExtra.join(", ")})`;
};

const getDwellerSpecifier = (intl: IntlShape, dweller: DwellerCardDto) => {
  const localizedPosition = intl.formatMessage(
    DwellerPositionMessages[dweller.position],
  );
  return getCardSpecifier(intl, dweller, [localizedPosition]);
};

const getWoodyPlantSpecifier = (
  intl: IntlShape,
  woodyPlant: WoodyPlantCardDto,
) => getCardSpecifier(intl, woodyPlant);

interface UnavailableCardsAlertProps {
  result: ErrorPlayerImportResult;
}

const UnavailableCardsAlert = ({ result }: UnavailableCardsAlertProps) => {
  const intl = useIntl();

  const {
    cave,
    dwellers = [],
    woodyPlants = [],
  } = result.unavailableCards ?? {};

  const cardSpecifiers = useMemo(
    () =>
      [
        cave && getLocalizedCaveName(intl, cave.name),
        ...woodyPlants.map((w) => getWoodyPlantSpecifier(intl, w)),
        ...dwellers.map((d) => getDwellerSpecifier(intl, d)),
      ].filter(Boolean) as string[],
    [intl, cave, dwellers, woodyPlants],
  );

  const uniqueCardSpecifiers = useMemo(
    () =>
      Object.entries(_.groupBy(cardSpecifiers)).map(([specifier, arr]) => ({
        specifier,
        count: arr.length,
      })),
    [cardSpecifiers],
  );

  return (
    <Alert
      color="warning"
      variant="soft"
      startDecorator={<WarningIcon />}
      sx={{ alignItems: "flex-start" }}
    >
      <div>
        <Box sx={{ mb: 0.5 }}>
          <FormattedMessage
            id="AddPlayerDrawer.UnavailableCardsAlert.title"
            defaultMessage="Import failed"
          />
        </Box>
        <Typography level="body-sm" color="warning">
          <FormattedMessage
            id="AddPlayerDrawer.UnavailableCardsAlert.text"
            defaultMessage="Some cards in the scanned data have already been played by other player(s):"
          />
        </Typography>
        <List size="sm" marker="disc">
          {uniqueCardSpecifiers
            .slice(0, MAX_LIST_ITEMS)
            .map(({ specifier, count }, index) => (
              <ListItem key={index} color="warning">
                {specifier}
                {count > 1 && (
                  <Typography
                    color="neutral"
                    level="inherit"
                    sx={{
                      display: "inline",
                      fontStyle: "italic",
                      ml: "0.25rem",
                    }}
                  >
                    ({count}x)
                  </Typography>
                )}
              </ListItem>
            ))}
          {cardSpecifiers.length > MAX_LIST_ITEMS && (
            <ListItem
              key="more"
              color="warning"
              sx={{ listStyleType: "none", fontStyle: "italic" }}
            >
              <FormattedMessage
                id="AddPlayerDrawer.UnavailableCardsAlert.moreCards"
                defaultMessage="and {count} more..."
                values={{ count: cardSpecifiers.length - MAX_LIST_ITEMS }}
              />
            </ListItem>
          )}
        </List>
      </div>
    </Alert>
  );
};

export default UnavailableCardsAlert;
