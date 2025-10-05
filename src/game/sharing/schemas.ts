import { z } from "zod";

import { DwellerPosition, GameBox, TreeSymbol } from "@/game/types";

export const DwellerCardDtoSchema = z.object({
  name: z.string(),
  gameBox: z.enum(GameBox),
  treeSymbol: z.enum(TreeSymbol).optional(),
  position: z.enum(DwellerPosition),
});

export const WoodyPlantCardDtoSchema = z.object({
  name: z.string(),
  gameBox: z.enum(GameBox),
  treeSymbol: z.enum(TreeSymbol).optional(),
  dwellers: z.array(DwellerCardDtoSchema),
});

export const CaveDtoSchema = z.object({
  name: z.string(),
  cardCount: z.number(),
});

export const ForestDtoSchema = z.object({
  woodyPlants: z.array(WoodyPlantCardDtoSchema),
  cave: CaveDtoSchema,
});

export const PlayerDtoSchema = z.object({
  name: z.string(),
  forest: ForestDtoSchema,
});

export const PlayerExportDtoSchema = z.object({
  appVersion: z.string(),
  gameBoxes: z.array(z.enum(GameBox)),
  player: PlayerDtoSchema,
});
