import { api, token } from "./api.js";
import { createWorld, PLACES } from "./world.js";
import { startGame } from "./games.js";
import { openShop } from "./shop.js";

const $ = (i) => document.getElementById(i);
const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const RECENT = "momo_recent"; // hanya daftar nama untuk tombol cepat, bukan data permainan

let catalog = null, player = null, world = null, pending = 0, flushT = 0, flushing = null;

function show(i) {
  for (let k = 0; k < 4; k++) $("s" + k).classList.toggle("on", k === i);
  world?.setActive(i === 1);
  world?.setBusy(i !== 1);
}

export function confetti(k) {
  const e = ["🎉", "⭐", "🐟", "✨"];
  for (let i = 0; i < k; i++) {
    const s = document.createElement("span");
    s.className = "cf";
    s.textContent = e[i % 4];
    s.style.left = R(0, 95) + "%";
    s.style.animationDelay = Math.random() * 0.6 + "s";
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 3600);
  }
}

function toast(t) {
  const el = $("toast");
  el.textContent = t;
  el.classList.add("on");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("on"), 1800);
}

function hud() {
  $("fish").textContent = player.fish + pending;
}

// ---------- ikan: kirim ke server berkelompok ----------
function addFish(n) {
  pending += n;
  hud();
  clearTimeout(flushT);
  flushT = setTimeout(flush, 700);
}
async function flush() {
  clearTimeout(flushT);
  if (flushing) await flushing;
  if (!pending) return;
  let amount = pending;
  flushing = (async () => {
    while (amount > 0) {
      const part = Math.min(5, amount);
      try {
        const { player: p } = await api.earn(part);
        player = p;
        pending -= part;
        amount -= part;
      } catch (e) {
        toast("⚠️ " + e.message);
        break;
      }
    }
    hud();
  })();
  await flushing;
  flushing = null;
}
// simpan ikan yang belum terkirim saat aplikasi ditutup / pindah tab
document.addEventListener("visibilitychange", () => { if (document.hidden) flush(); });

// ---------- masuk / daftar ----------
function recent() {
  try { return JSON.parse(localStorage.getItem(RECENT) || "[]"); } catch { return []; }
}
function remember(name) {
  const r = [name, ...recent().filter((n) => n.toLowerCase() !== name.toLowerCase())].slice(0, 6);
  localStorage.setItem(RECENT, JSON.stringify(r));
}
function renderRecent() {
  const b = $("ul");
  b.innerHTML = "";
  recent().forEach((n) => {
    const e = document.createElement("button");
    e.className = "chip";
    e.textContent = "🐱 " + n;
    e.onclick = () => { $("nm").value = n; $("pin").focus(); };
    b.appendChild(e);
  });
}

async function auth(mode) {
  const name = $("nm").value.trim(), pin = $("pin").value.trim();
  $("er").textContent = "";
  if (!name) return ($("er").textContent = "Ketik namamu dulu ya");
  if (!/^\d{4}$/.test(pin)) return ($("er").textContent = "PIN-nya 4 angka ya (contoh: 1234)");
  setBusyBtns(true);
  try {
    const r = mode === "reg" ? await api.register(name, pin) : await api.login(name, pin);
    token.set(r.token);
    remember(r.player.name);
    enter(r.player);
    if (mode === "reg") importOld(r.player.name);
  } catch (e) {
    $("er").textContent = e.message;
  }
  setBusyBtns(false);
}
// Pindahkan ikan dari versi lama (yang dulu tersimpan di HP) ke akun server, sekali saja.
function importOld(name) {
  try {
    const D = JSON.parse(localStorage.getItem("momo2") || "null");
    const u = D?.users?.["u_" + name.toLowerCase()];
    if (!u) return;
    const f = Math.min(60, Math.max(0, u.f | 0));
    delete D.users["u_" + name.toLowerCase()];
    localStorage.setItem("momo2", JSON.stringify(D));
    if (f) { addFish(f); toast(`📦 ${f} ikan lamamu sudah dipindah ke server!`); }
  } catch {}
}

function setBusyBtns(b) {
  ["bLogin", "bReg"].forEach((i) => ($(i).disabled = b));
}

function enter(p) {
  player = p;
  $("pin").value = "";
  $("hiName").textContent = p.name;
  show(1);
  if (!world) {
    world = createWorld($("w"), {
      minimap: $("mm"),
      onFish: () => { addFish(1); toast("+1 🐟"); },
      onEnter: (i) => {
        world.setBusy(true);
        if (i === 3) return goShop();
        show(2);
        startGame(i, {
          name: player.name,
          confetti,
          onDone: (ok) => { if (ok) addFish(ok); },
        });
      },
    });
    world.setActive(true);
  }
  world.setName(p.name);
  world.setLook(p.equipped, catalog, p.name);
  hud();
}

async function goShop() {
  show(3);
  await flush();
  openShop({
    player,
    catalog,
    confetti,
    flush,
    onChange: (p) => { player = p; hud(); },
    onClose: () => { world.setLook(player.equipped, catalog, player.name); show(1); },
  });
}

async function logout() {
  await flush();
  api.logout().catch(() => {});
  token.set("");
  player = null;
  $("cont").style.display = "none";
  renderRecent();
  show(0);
}

// ---------- mulai ----------
async function boot() {
  $("bLogin").onclick = () => auth("login");
  $("bReg").onclick = () => auth("reg");
  $("pin").addEventListener("keydown", (e) => e.key === "Enter" && auth("login"));
  $("bOut").onclick = logout;
  $("bJump").onclick = () => world?.jump();
  $("gBack").onclick = () => show(1);
  $("places").innerHTML = PLACES.map((p) => `<span>${p.emoji} ${p.name}</span>`).join("");
  renderRecent();
  try {
    catalog = await api.catalog();
  } catch (e) {
    $("er").textContent = "Tidak bisa terhubung ke server. Coba muat ulang ya.";
    return;
  }
  $("loading").remove();
  if (token.get()) {
    try {
      const { player: p } = await api.me();
      const b = $("cont");
      b.textContent = `▶ Lanjut main sebagai ${p.name}`;
      b.style.display = "";
      b.onclick = () => enter(p);
    } catch (e) {
      if (e.status === 401) token.set("");
    }
  }
}
boot();
