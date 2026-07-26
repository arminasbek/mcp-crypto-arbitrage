export interface RequestOptions {
  baseUrl: string;
  headers: Record<string, string>;
  timeoutMs: number;
}

export class HttpError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body: unknown,
  ) {
    super(`HTTP ${status} ${statusText}`);
    this.name = "HttpError";
  }
}

export async function get<T>(
  options: RequestOptions,
  path: string,
  params: URLSearchParams,
): Promise<T> {
  const { timeoutMs } = options;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  return fetch(`${options.baseUrl}/${path}?${params}`, {
    headers: options.headers,
    signal: controller.signal,
  })
    .catch((error) => rethrowAsTimeout(error, timeoutMs))
    .then(async (response) => {
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new HttpError(response.status, response.statusText, body);
      }
      return response.json() as Promise<T>;
    })
    .finally(() => clearTimeout(timeout));
}

function rethrowAsTimeout(error: unknown, timeoutMs: number): never {
  if (error instanceof Error && error.name === "AbortError") {
    throw new Error(`Request timed out after ${timeoutMs}ms`);
  }
  throw error;
}
