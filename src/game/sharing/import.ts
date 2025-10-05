import { produce } from "immer";

import { createPlayer, createWoodyPlant } from "@/game/factory";
import { decode } from "@/game/sharing/encoding";
import { PlayerExportDtoSchema } from "@/game/sharing/schemas";
import {
  CaveDto,
  DwellerCardDto,
  WoodyPlantCardDto,
} from "@/game/sharing/types";
import {
  Cave,
  Deck,
  DwellerCard,
  Game,
  Player,
  WoodyPlantCard,
} from "@/game/types";
import * as WoodyPlants from "@/game/woody-plants";

export enum ImportErrorType {
  InvalidData = "INVALID_DATA",
  InvalidSchema = "INVALID_SCHEMA",
  UnavailableCards = "UNAVAILABLE_CARDS",
}

export interface SuccessPlayerImportResult {
  success: true;
  player: Player;
}

export interface ErrorPlayerImportResult {
  success: false;
  error: ImportErrorType;
  unavailableCards?: {
    cave: CaveDto | null;
    dwellers: DwellerCardDto[];
    woodyPlants: WoodyPlantCardDto[];
  };
}

export type PlayerImportResult =
  | SuccessPlayerImportResult
  | ErrorPlayerImportResult;

export const importPlayer = (
  game: Game,
  encodedData: string,
): PlayerImportResult => {
  let decodedData;
  try {
    decodedData = decode(encodedData);
  } catch (e) {
    console.error("Failed to decode exported player", e);
    return createErrorResult(ImportErrorType.InvalidData);
  }

  let exportDto;
  try {
    exportDto = PlayerExportDtoSchema.parse(decodedData);
  } catch (e) {
    console.error("Failed to parse exported player", e);
    return createErrorResult(ImportErrorType.InvalidSchema);
  }

  const {
    player: {
      name,
      forest: { cave: caveDto, woodyPlants: woodyPlantDtos },
    },
  } = exportDto;

  const cave = findCaveOfDto(game.deck, caveDto);

  const woodyPlants: WoodyPlantCard[] = [];
  const unavailableDwellers: DwellerCardDto[] = [];
  const unavailableWoodyPlants: WoodyPlantCardDto[] = [];

  for (const woodyPlantDto of woodyPlantDtos) {
    let woodyPlant = findWoodyPlantOfDto(game.deck, woodyPlantDto);
    if (!woodyPlant) {
      unavailableWoodyPlants.push(woodyPlantDto);
      continue;
    }

    for (const dwellerDto of woodyPlantDto.dwellers) {
      const dweller = findDwellerOfDto(game.deck, dwellerDto);
      if (!dweller) {
        unavailableDwellers.push(dwellerDto);
        continue;
      }

      woodyPlant = produce(woodyPlant, (draft) => {
        draft.dwellers[dweller.position].push(dweller);
      });
    }

    woodyPlants.push(woodyPlant);
  }

  if (
    !cave ||
    unavailableDwellers.length > 0 ||
    unavailableWoodyPlants.length > 0
  ) {
    return createErrorResult(ImportErrorType.UnavailableCards, {
      cave: cave ? null : caveDto,
      dwellers: unavailableDwellers,
      woodyPlants: unavailableWoodyPlants,
    });
  }

  const player = createPlayer(findUniqueName(game, name), cave, woodyPlants);
  return createSuccessResult(player);
};

const createErrorResult = (
  error: ImportErrorType,
  unavailableCards?: ErrorPlayerImportResult["unavailableCards"],
): ErrorPlayerImportResult => ({
  success: false,
  error,
  unavailableCards,
});

const createSuccessResult = (player: Player): SuccessPlayerImportResult => ({
  success: true,
  player,
});

const findUniqueName = (game: Game, name: string): string => {
  let uniqueName = name;

  let counter = 1;
  while (game.players.some((player) => player.name === uniqueName)) {
    uniqueName = `${name} (${counter})`;
    counter++;
  }

  return uniqueName;
};

const findWoodyPlantOfDto = (
  deck: Deck,
  dto: WoodyPlantCardDto,
): WoodyPlantCard | undefined => {
  const woodyPlant = deck.woodyPlants.find(
    (woodyPlant) =>
      woodyPlant.name === dto.name &&
      woodyPlant.gameBox === dto.gameBox &&
      woodyPlant.treeSymbol === dto.treeSymbol,
  );
  if (woodyPlant) {
    return woodyPlant;
  }

  const blueprint = Object.values(WoodyPlants).find((b) => b.name === dto.name);
  const variant = blueprint?.variants.find(
    (v) => v.gameBox === dto.gameBox && v.treeSymbol === dto.treeSymbol,
  );
  if (blueprint?.isPartOfDeck === false && variant) {
    return createWoodyPlant(blueprint, variant);
  }
};

const findDwellerOfDto = (
  deck: Deck,
  dto: DwellerCardDto,
): DwellerCard | undefined =>
  deck.dwellers.find(
    (d) =>
      d.name === dto.name &&
      d.gameBox === dto.gameBox &&
      d.treeSymbol === dto.treeSymbol &&
      d.position === dto.position,
  );

const findCaveOfDto = (deck: Deck, dto: CaveDto): Cave | undefined =>
  deck.caves.find((c) => c.name === dto.name);
