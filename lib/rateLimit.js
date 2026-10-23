// Small in-memory sliding-window limiter, per client IP. Good enough for one
// server process; it resets on restart and isn't shared across instances.
const windows = new Map();

export function clientKey(request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || "local";
}

/** True if this call is allowed; records it. */
export function allow(bucket, key, limit, windowMs) {
  const id = `${bucket}:${key}`;
  const now = Date.now();
  const recent = (windows.get(id) || []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    windows.set(id, recent);
    return false;
  }
  recent.push(now);
  windows.set(id, recent);
  if (windows.size > 5000) windows.clear();
  return true;
}
