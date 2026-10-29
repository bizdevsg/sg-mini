import "server-only";

type Bucket = { count: number; resetsAt: number };

const buckets = new Map<string, Bucket>();

export function consumeTradePilotRateLimit(
  userId: string,
  action: string,
  limit: number,
  windowMs = 60_000,
) {
  const now = Date.now();
  const key = `${userId}:${action}`;
  const current = buckets.get(key);

  if (!current || current.resetsAt <= now) {
    buckets.set(key, { count: 1, resetsAt: now + windowMs });
    return true;
  }

  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}
