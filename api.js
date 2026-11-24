// Semua data pemain (ikan, aksesori, gaya) disimpan di server. Di HP hanya disimpan token login.
const TK = "momo_token";
export const token = {
  get: () => localStorage.getItem(TK) || "",
  set: (v) => (v ? localStorage.setItem(TK, v) : localStorage.removeItem(TK)),
};

async function call(path, body) {
  const res = await fetch(path, {
    method: body === undefined ? "GET" : "POST",
    headers: { "Content-Type": "application/json", ...(token.get() ? { Authorization: "Bearer " + token.get() } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
    keepalive: body !== undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || "Koneksi bermasalah, coba lagi ya");
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  catalog: () => call("/api/catalog"),
  me: () => call("/api/me"),
  register: (name, pin) => call("/api/register", { name, pin }),
  login: (name, pin) => call("/api/login", { name, pin }),
  logout: () => call("/api/logout", {}),
  earn: (amount) => call("/api/earn", { amount }),
  buy: (itemId) => call("/api/buy", { itemId }),
  equip: (equipped) => call("/api/equip", { equipped }),
};
