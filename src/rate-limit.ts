export const DEFAULT_RATE_LIMIT_MAX_KEYS = 10_000;

export class RateLimitError extends Error {
  readonly retryAfterSeconds: number;

  constructor(retryAfterMs: number) {
    super("rate limit exceeded; retry later");
    this.name = "RateLimitError";
    this.retryAfterSeconds = Math.max(1, Math.ceil(retryAfterMs / 1_000));
  }
}

export class RateLimiter {
  private readonly buckets = new Map<string, { startedAt: number; count: number }>();
  private readonly maxKeys: number;
  private lastPrunedAt = 0;

  constructor(
    limit = Number(process.env.RATE_LIMIT_PER_MINUTE ?? 10),
    private readonly windowMs = 60_000,
    maxKeys = Number(process.env.RATE_LIMIT_MAX_KEYS ?? DEFAULT_RATE_LIMIT_MAX_KEYS)
  ) {
    this.limit = Number.isFinite(limit) && limit >= 1 ? Math.floor(limit) : 10;
    this.maxKeys = Number.isSafeInteger(maxKeys) && maxKeys >= 1 ? maxKeys : DEFAULT_RATE_LIMIT_MAX_KEYS;
  }

  private readonly limit: number;

  private prune(now: number): void {
    const interval = Math.max(1_000, Math.min(this.windowMs, 10_000));
    if (now - this.lastPrunedAt < interval) return;
    for (const [key, bucket] of this.buckets) {
      if (now - bucket.startedAt >= this.windowMs) this.buckets.delete(key);
    }
    this.lastPrunedAt = now;
  }

  private evictOldest(): void {
    const oldestKey = this.buckets.keys().next().value as string | undefined;
    if (oldestKey !== undefined) this.buckets.delete(oldestKey);
  }

  consume(key: string): void {
    const now = Date.now();
    this.prune(now);
    const bucket = this.buckets.get(key);
    if (!bucket || now - bucket.startedAt >= this.windowMs) {
      if (!bucket && this.buckets.size >= this.maxKeys) this.evictOldest();
      this.buckets.set(key, { startedAt: now, count: 1 });
      return;
    }
    if (bucket.count >= this.limit) throw new RateLimitError(this.windowMs - (now - bucket.startedAt));
    bucket.count += 1;
  }
}

export class InFlightLimiter {
  private active = 0;
  private readonly limit: number;

  constructor(limit = Number(process.env.MAX_IN_FLIGHT_COMPILATIONS ?? 2)) {
    this.limit = Number.isSafeInteger(limit) && limit >= 1 ? limit : 2;
  }

  async run<T>(task: () => Promise<T>): Promise<T> {
    if (this.active >= this.limit) throw new Error("Too many compilations in flight; retry later");
    this.active += 1;
    try {
      return await task();
    } finally {
      this.active -= 1;
    }
  }
}
