import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { z } from "zod";
import type { Config } from "@/config.js";

export interface Tool {
  name: string;
  description: string;
  inputSchema: Record<string, z.ZodTypeAny>;
  handler: (
    config: Config,
    args: Record<string, unknown>,
  ) => Promise<CallToolResult>;
}
