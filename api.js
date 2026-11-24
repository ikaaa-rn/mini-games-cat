import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://yhbqorthelehdueakwki.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_C049aTJHruFO8kYCE30f3g_kpZ_hL5c";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TK = "momo_token";
export const token = {
  get: () => localStorage.getItem(TK) || "",
  set: (v) => (v ? localStorage.setItem(TK, v) : localStorage.removeItem(TK)),
};

// Katalog toko dipindah ke sini agar tidak makan request database
const CATALOG = {
  slots: [
    { id: "fur", name: "Bulu", icon: "🐱" },
    { id: "hat", name: "Topi", icon: "🎩" },
    { id: "face", name: "Wajah", icon: "👓" },
    { id: "neck", name: "Leher", icon: "🎀" },
    { id: "body", name: "Baju", icon: "👕" },
    { id: "back", name: "Punggung", icon: "🎒" },
  ],
  items: [
    // Bulu
    { id: "fur_orange", slot: "fur", name: "Oren", color: "#ff9f43", dark: "#e67e22", price: 0 },
    { id: "fur_gold", slot: "fur", name: "Emas", color: "#ffd43b", dark: "#e0a800", price: 15 },
    { id: "fur_pink", slot: "fur", name: "Pink", color: "#ff9ecf", dark: "#e874ad", price: 20 },
    { id: "fur_gray", slot: "fur", name: "Abu-abu", color: "#95a5a6", dark: "#7f8c8d", price: 10 },
    // Topi
    { id: "hat_bunga", slot: "hat", name: "Bunga", icon: "🌼", price: 5 },
    { id: "hat_cap", slot: "hat", name: "Topi Merah", icon: "🧢", price: 10 },
    { id: "hat_beanie", slot: "hat", name: "Kupluk", icon: "🧶", price: 12 },
    { id: "hat_party", slot: "hat", name: "Pesta", icon: "🥳", price: 15 },
    { id: "hat_headphone", slot: "hat", name: "Headphone", icon: "🎧", price: 20 },
    { id: "hat_cowboy", slot: "hat", name: "Koboi", icon: "🤠", price: 25 },
    { id: "hat_wizard", slot: "hat", name: "Penyihir", icon: "🧙", price: 30 },
    { id: "hat_crown", slot: "hat", name: "Mahkota", icon: "👑", price: 50 },
    // Wajah
    { id: "face_kumis", slot: "face", name: "Kumis", icon: "🥸", price: 8 },
    { id: "face_glasses", slot: "face", name: "Kacamata", icon: "👓", price: 12 },
    { id: "face_sun", slot: "face", name: "Kacamata Hitam", icon: "🕶️", price: 18 },
    { id: "face_heart", slot: "face", name: "Kacamata Hati", icon: "😍", price: 22 },
    { id: "face_mask", slot: "face", name: "Topeng Hero", icon: "🦸", price: 25 },
    // Leher
    { id: "neck_bow", slot: "neck", name: "Dasi Kupu", icon: "🎀", price: 10 },
    { id: "neck_bell", slot: "neck", name: "Lonceng", icon: "🔔", price: 12 },
    { id: "neck_tie", slot: "neck", name: "Dasi Kantor", icon: "👔", price: 15 },
    { id: "neck_scarf", slot: "neck", name: "Syal Merah", icon: "🧣", price: 20 },
    { id: "neck_gold", slot: "neck", name: "Kalung Emas", icon: "📿", price: 35 },
    // Baju
    { id: "body_tee", slot: "body", name: "Kaos Biru", icon: "👕", price: 15 },
    { id: "body_stripe", slot: "body", name: "Kaos Garis", icon: "🦓", price: 18 },
    { id: "body_dress", slot: "body", name: "Gaun Pink", icon: "👗", price: 25 },
    { id: "body_hoodie", slot: "body", name: "Hoodie Hijau", icon: "🧥", price: 28 },
    { id: "body_jacket", slot: "body", name: "Jaket Kulit", icon: "🤎", price: 35 },
    { id: "body_hero", slot: "body", name: "Kostum Hero", icon: "⚡", price: 45 },
    // Punggung
    { id: "back_bag", slot: "back", name: "Tas Ransel", icon: "🎒", price: 20 },
    { id: "back_cape", slot: "back", name: "Jubah Merah", icon: "🧣", price: 30 },
    { id: "back_butterfly", slot: "back", name: "Sayap Kupu", icon: "🦋", price: 40 },
    { id: "back_angel", slot: "back", name: "Sayap Malaikat", icon: "👼", price: 50 },
    { id: "back_jet", slot: "back", name: "Jetpack", icon: "🚀", price: 65 },
  ],
};

async function getCurrentPlayer() {
  const id = token.get();
  if (!id) throw Object.assign(new Error("Belum masuk"), { status: 401 });
  const { data, error } = await supabase.from("players").select("*").eq("id", id).single();
  if (error || !data) throw Object.assign(new Error("Sesi habis"), { status: 401 });
  return data;
}

export const api = {
  catalog: async () => CATALOG,

  me: async () => ({ player: await getCurrentPlayer() }),

  register: async (name, pin) => {
    const cleanName = name.trim();
    const { data: exist } = await supabase.from("players").select("id").ilike("name", cleanName).maybeSingle();
    if (exist) throw new Error("Nama sudah dipakai, pilih nama lain ya!");

    const { data, error } = await supabase
      .from("players")
      .insert({ name: cleanName, pin, fish: 10, owned: ["fur_orange"], equipped: { fur: "fur_orange" } })
      .select()
      .single();

    if (error) throw new Error("Gagal mendaftar: " + error.message);
    return { token: data.id, player: data };
  },

  login: async (name, pin) => {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .ilike("name", name.trim())
      .eq("pin", pin)
      .maybeSingle();

    if (error || !data) throw new Error("Nama atau PIN salah!");
    return { token: data.id, player: data };
  },

  logout: async () => ({ ok: true }),

  earn: async (amount) => {
    const p = await getCurrentPlayer();
    const { data, error } = await supabase
      .from("players")
      .update({ fish: p.fish + amount })
      .eq("id", p.id)
      .select()
      .single();
    if (error) throw new Error("Gagal menyimpan ikan");
    return { player: data };
  },

  buy: async (itemId) => {
    const p = await getCurrentPlayer();
    const item = CATALOG.items.find((i) => i.id === itemId);
    if (!item) throw new Error("Barang tidak ditemukan");
    if (p.owned.includes(itemId)) throw new Error("Sudah punya barang ini");
    if (p.fish < item.price) throw new Error("Ikan belum cukup!");

    const nextOwned = [...p.owned, itemId];
    const nextEquipped = { ...p.equipped, [item.slot]: itemId };

    const { data, error } = await supabase
      .from("players")
      .update({ fish: p.fish - item.price, owned: nextOwned, equipped: nextEquipped })
      .eq("id", p.id)
      .select()
      .single();

    if (error) throw new Error("Gagal membeli barang");
    return { player: data };
  },

  equip: async (equipped) => {
    const p = await getCurrentPlayer();
    const { data, error } = await supabase
      .from("players")
      .update({ equipped })
      .eq("id", p.id)
      .select()
      .single();
    if (error) throw new Error("Gagal mengganti gaya");
    return { player: data };
  },
};
