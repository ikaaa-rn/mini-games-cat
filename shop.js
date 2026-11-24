// Layar Toko Aksesori: kategori, kartu barang, coba-pakai di preview, beli & pakai (tersimpan di server).
import { api } from "./api.js";
import { createPreview } from "./preview.js";

const $ = (i) => document.getElementById(i);
let preview = null, ctx = null, slot = "hat", tryLook = {}, selected = null;

export function openShop(c) {
  // c = { player, catalog, onChange(player), onClose(), confetti, flush() }
  ctx = c;
  if (!preview) {
    preview = createPreview($("pv"));
    $("pvWalk").onclick = () => { preview.setWalking(!preview.walking); walkBtn(); };
    $("pvReset").onclick = () => { tryLook = { ...ctx.player.equipped }; selected = null; render(); };
    $("shopBack").onclick = () => close();
  }
  tryLook = { ...c.player.equipped };
  selected = null;
  slot = "hat";
  $("sm").textContent = "";
  preview.resetSpin();
  preview.start();
  walkBtn();
  render();
}

function close() {
  preview.stop();
  ctx.onClose();
}

function walkBtn() {
  $("pvWalk").textContent = preview.walking ? "🧍 Diam" : "🚶 Jalan";
}

const owned = (id) => ctx.player.owned.includes(id);
const worn = (it) => ctx.player.equipped[it.slot] === it.id;

function render() {
  const { catalog, player } = ctx;
  $("sf").textContent = player.fish;
  preview.setLook(tryLook, catalog);

  const tabs = $("tabs");
  tabs.innerHTML = "";
  catalog.slots.forEach((s) => {
    const b = document.createElement("button");
    b.className = "tab" + (s.id === slot ? " on" : "");
    b.innerHTML = `<span>${s.icon}</span>${s.name}`;
    b.onclick = () => { slot = s.id; render(); };
    tabs.appendChild(b);
  });

  const grid = $("grid");
  grid.innerHTML = "";
  catalog.items.filter((i) => i.slot === slot).forEach((it) => {
    const card = document.createElement("button");
    const isTry = tryLook[it.slot] === it.id;
    card.className = "card" + (isTry ? " try" : "") + (selected === it.id ? " sel" : "");
    const tag = worn(it) ? '<em class="tag on">Dipakai</em>' : owned(it.id) ? '<em class="tag own">Punya ✓</em>' : `<em class="tag">${it.price ? it.price + " 🐟" : "Gratis"}</em>`;
    const sw = it.color ? `<i class="sw" style="background:${it.color}"></i>` : `<span class="ic">${it.icon}</span>`;
    card.innerHTML = `${sw}<b>${it.name}</b>${tag}`;
    card.onclick = () => {
      if (isTry && it.slot !== "fur") { delete tryLook[it.slot]; selected = null; }
      else { tryLook[it.slot] = it.id; selected = it.id; }
      $("sm").textContent = "";
      render();
    };
    grid.appendChild(card);
  });

  // bar aksi
  const bar = $("act");
  const it = catalog.items.find((i) => i.id === selected);
  if (!it) {
    bar.innerHTML = `<span class="hint">Ketuk barang untuk mencoba di kucingmu 👆</span>`;
    return;
  }
  if (!owned(it.id)) {
    const short = it.price - player.fish;
    bar.innerHTML = `<span><b>${it.name}</b><br><small>${short > 0 ? "Kurang " + short + " ikan lagi" : "Harga " + it.price + " 🐟"}</small></span>`;
    const b = document.createElement("button");
    b.className = "buy";
    b.textContent = `Beli · ${it.price} 🐟`;
    b.disabled = short > 0;
    b.onclick = () => buy(it, b);
    bar.appendChild(b);
  } else if (worn(it)) {
    bar.innerHTML = `<span><b>${it.name}</b><br><small>Sedang dipakai</small></span>`;
    if (it.slot !== "fur") {
      const b = document.createElement("button");
      b.textContent = "Lepas";
      b.onclick = () => { const e = { ...player.equipped }; delete e[it.slot]; delete tryLook[it.slot]; equip(e); };
      bar.appendChild(b);
    }
  } else {
    bar.innerHTML = `<span><b>${it.name}</b><br><small>Sudah punya</small></span>`;
    const b = document.createElement("button");
    b.className = "buy";
    b.textContent = "Pakai";
    b.onclick = () => equip({ ...player.equipped, [it.slot]: it.id });
    bar.appendChild(b);
  }
}

async function buy(it, btn) {
  btn.disabled = true;
  btn.textContent = "Menyimpan…";
  try {
    await ctx.flush();
    const { player } = await api.buy(it.id);
    ctx.player = player;
    ctx.onChange(player);
    tryLook[it.slot] = it.id;
    $("sm").textContent = `Yeay! ${it.name} jadi milikmu & langsung dipakai! 🎉`;
    ctx.confetti(14);
  } catch (e) {
    $("sm").textContent = e.message;
  }
  render();
}

async function equip(e) {
  try {
    const { player } = await api.equip(e);
    ctx.player = player;
    ctx.onChange(player);
    tryLook = { ...tryLook, ...player.equipped };
    Object.keys(tryLook).forEach((k) => { if (!player.equipped[k] && ctx.player.owned.includes(tryLook[k])) delete tryLook[k]; });
    $("sm").textContent = "Gaya baru tersimpan ✓";
  } catch (err) {
    $("sm").textContent = err.message;
  }
  render();
}
