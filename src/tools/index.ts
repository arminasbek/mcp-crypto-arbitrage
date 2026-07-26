import { findArbitrageTool } from "@/tools/findArbitrage.js";
import { getCoinPricesTool } from "@/tools/getCoinPrices.js";
import { scanTopCoinsTool } from "@/tools/scanTopCoins.js";
import type { Tool } from "@/tools/types.js";

export const tools: Tool[] = [
  getCoinPricesTool,
  findArbitrageTool,
  scanTopCoinsTool,
];
