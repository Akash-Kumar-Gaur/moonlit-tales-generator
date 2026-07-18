const DEVICE_ID_KEY = "moonlit_device_id";

/** Device-scoped session id — generated once, persisted in localStorage. */
export function getDeviceId(): string {
  if (typeof window === "undefined") {
    return "ssr-placeholder";
  }
  try {
    const existing = window.localStorage.getItem(DEVICE_ID_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    window.localStorage.setItem(DEVICE_ID_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}
