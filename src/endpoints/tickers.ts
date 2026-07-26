import { request } from "@/apiClient.js";
import type { Config } from "@/config.js";

export interface Ticker {
  target: string;
  last: number;
  coin_id: string;
  market: { name: string; identifier: string };
}

export interface TickersResult {
  name: string;
  tickers: Ticker[];
}

export async function getTickers(
  config: Config,
  coinId: string,
): Promise<TickersResult> {
  const params = new URLSearchParams({ include_exchange_logo: "false" });
  const result = await request<TickersResult>(
    config,
    `coins/${coinId}/tickers`,
    params,
  );

  // CoinGecko includes tickers where coinId is the quote currency, not just
  // the base (e.g. BTC/USDT shows up under tether's tickers). coin_id is only
  // coinId when it's actually the base — filter out the rest, or a coin that's
  // widely used as a quote currency (like a stablecoin) picks up other coins'
  // prices as if they were its own.
  return {
    ...result,
    tickers: result.tickers.filter((t) => t.coin_id === coinId),
  };
}

export interface Spread {
  lowest: Ticker;
  highest: Ticker;
  spreadPct: number;
}

// Widest buy-low/sell-high spread across USD/USDT markets, or null if
// there aren't at least two such markets to compare.
export function widestSpread(tickers: Ticker[]): Spread | null {
  const usdTickers = tickers.filter(
    (t) => t.target === "USD" || t.target === "USDT",
  );
  if (usdTickers.length < 2) {
    return null;
  }

  const lowest = usdTickers.reduce((a, b) => (b.last < a.last ? b : a));
  const highest = usdTickers.reduce((a, b) => (b.last > a.last ? b : a));
  const spreadPct = ((highest.last - lowest.last) / lowest.last) * 100;

  return { lowest, highest, spreadPct };
}
