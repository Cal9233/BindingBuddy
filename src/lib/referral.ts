const KEY = "bb_ref";
const EXPIRY_KEY = "bb_ref_exp";
const TTL = 30 * 24 * 60 * 60 * 1000; // 30 days in ms

export function setReferral(storeId: string): void {
  try {
    localStorage.setItem(KEY, storeId);
    localStorage.setItem(EXPIRY_KEY, String(Date.now() + TTL));
    document.cookie = `bb_ref=${encodeURIComponent(storeId)}; max-age=${TTL / 1000}; path=/; SameSite=Lax`;
  } catch {
    // localStorage unavailable (private browsing, etc.) — ignore
  }
}

export function getReferral(): string | null {
  try {
    const expiry = localStorage.getItem(EXPIRY_KEY);
    if (!expiry || Date.now() > Number(expiry)) {
      clearReferral();
      return null;
    }
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function clearReferral(): void {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(EXPIRY_KEY);
    document.cookie = "bb_ref=; max-age=0; path=/";
  } catch {
    // ignore
  }
}
