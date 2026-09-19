export class RateLimiter {
  private readonly buckets = new Map<string, { startedAt: number; count: number }>();

  constructor(limit = Number(process.env.RATE_LIMIT_PER_MINUTE ?? 10), private readonly windowMs = 60_000) {
    this.limit = Number.isFinite(limit) && limit >= 1 ? Math.floor(limit) : 10;
  }

  private readonly limit: number;

  consume(key: string): void {
    const now = Date.now();
    const bucket = this.buckets.get(key);
    if (!bucket || now - bucket.startedAt >= this.windowMs) {
      this.buckets.set(key, { startedAt: now, count: 1 });
      return;
    }
    if (bucket.count >= this.limit) throw new Error("Anonymous rate limit exceeded; retry after the current minute");
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
