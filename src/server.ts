import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Config } from "@/config.js";
import { tools } from "@/tools/index.js";

export function createServer(config: Config): McpServer {
  const server = new McpServer({ name: config.name, version: config.version });

  for (const tool of tools) {
    server.registerTool(
      tool.name,
      { description: tool.description, inputSchema: tool.inputSchema },
      (args) => tool.handler(config, args),
    );
  }

  return server;
}
