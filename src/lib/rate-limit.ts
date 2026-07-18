/**
 * Simple in-memory rate limiter: max N generations per deviceId per UTC day.
 * Suitable for a single Railway instance. Swap for Redis if you scale to multiple dynos.
 */

const MAX_PER_DAY = 20;

type Bucket = { day: string; count: number };

const buckets = new Map<string, Bucket>();

function utcDayKey(now = new Date()): string {
  return now.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function checkAndIncrementRateLimit(deviceId: string): {
  allowed: boolean;
  remaining: number;
  limit: number;
} {
  const day = utcDayKey();
  const existing = buckets.get(deviceId);

  if (!existing || existing.day !== day) {
    buckets.set(deviceId, { day, count: 1 });
    return { allowed: true, remaining: MAX_PER_DAY - 1, limit: MAX_PER_DAY };
  }

  if (existing.count >= MAX_PER_DAY) {
    return { allowed: false, remaining: 0, limit: MAX_PER_DAY };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: MAX_PER_DAY - existing.count,
    limit: MAX_PER_DAY,
  };
}

/** Decrement if generation failed after we reserved a slot. */
export function refundRateLimit(deviceId: string) {
  const day = utcDayKey();
  const existing = buckets.get(deviceId);
  if (!existing || existing.day !== day || existing.count <= 0) return;
  existing.count -= 1;
}
