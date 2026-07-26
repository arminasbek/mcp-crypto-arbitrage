import { get, HttpError } from "@/client.js";
import type { Config } from "@/config.js";

// CoinGecko's public API needs no auth header. If COINGECKO_API_KEY is set
// (free Demo key), it's sent as x-cg-demo-api-key for a higher rate limit.
export async function request<T>(
  config: Config,
  path: string,
  params: URLSearchParams,
): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (config.apiKey) {
    headers["x-cg-demo-api-key"] = config.apiKey;
  }

  return get<T>(
    { baseUrl: config.baseUrl, headers, timeoutMs: config.timeoutMs },
    path,
    params,
  ).catch(rethrowWithApiDetail);
}

function rethrowWithApiDetail(error: unknown): never {
  if (error instanceof HttpError) {
    if (error.status === 429) {
      throw new Error(
        "CoinGecko rate limit hit. The public API is limited without a key — " +
          "set COINGECKO_API_KEY (free Demo key from coingecko.com/en/api/pricing) " +
          "for a higher limit, or wait a minute and retry.",
      );
    }
    const detail = (error.body as { error?: string } | null)?.error;
    throw new Error(detail ?? error.message);
  }
  throw error;
}
