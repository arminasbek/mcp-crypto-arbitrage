import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export interface Config {
  apiKey?: string;
  baseUrl: string;
  timeoutMs: number;
  name: string;
  version: string;
}

const BASE_URL = "https://api.coingecko.com/api/v3";
const DEFAULT_TIMEOUT_MS = 10_000;

function loadPackageInfo(): { name: string; version: string } {
  const pkgPath = join(
    dirname(fileURLToPath(import.meta.url)),
    "..",
    "package.json",
  );
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  return { name: pkg.name, version: pkg.version };
}

// CoinGecko's public API works with no key (low rate limit). Setting
// COINGECKO_API_KEY (free Demo key from coingecko.com/en/api/pricing)
// raises the limit to 100 calls/min/10k calls/month — optional, not required.
export function loadConfig(): Config {
  const apiKey = process.env.COINGECKO_API_KEY || undefined;
  const { name, version } = loadPackageInfo();

  return {
    apiKey,
    baseUrl: BASE_URL,
    timeoutMs: DEFAULT_TIMEOUT_MS,
    name,
    version,
  };
}
