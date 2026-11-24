// Tiga permainan nilai tempat (satuan, puluhan, ratusan). Setiap ronde 5 soal.
const $ = (i) => document.getElementById(i);
const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const NM = ["satuan", "puluhan", "ratusan"];
const TITLES = ["🐟 Warung Ikan", "🧱 Taman Balok", "🐶 Pos Anjing"];

let g = 0, n = 0, ok = 0, ans = null, tgt = 0, cnt = [0, 0, 0], name = "", done = null, confetti = () => {};

export function startGame(kind, opts) {
  g = kind; n = 0; ok = 0;
  name = opts.name; done = opts.onDone; confetti = opts.confetti;
  $("gt").textContent = TITLES[g];
  next();
}

function next() {
  if (n >= 5) return fin();
  n++;
  dots();
  $("m").textContent = "";
  $("area").innerHTML = "";
  [q0, q1, q2][g]();
}
function dots() {
  let s = "";
  for (let i = 1; i <= 5; i++) s += i < n ? "🐟" : i === n ? "🐾" : "⚪";
  $("dots").textContent = s;
}
const say = (t) => ($("q").textContent = t);
function wrong(h) { $("m").textContent = "Coba lagi ya, " + name + "! " + h; }
function right() { ok++; confetti(8); $("m").textContent = "Yeay, benar! 🎉"; setTimeout(next, 900); }

function q0() {
  const v = String(R(100, 999)), p = R(0, 2);
  ans = p;
  say("Mana angka " + NM[2 - p] + "-nya? (" + n + "/5)");
  $("area").innerHTML = '<div class="row">' + [0, 1, 2].map((i) => `<button class="d" data-i="${i}">${v[i]}</button>`).join("") + "</div>";
  $("area").querySelectorAll("button").forEach((b) => (b.onclick = () => (+b.dataset.i === ans ? right() : wrong("Petunjuk: ratusan paling kiri, satuan paling kanan 👉"))));
}

function q1() {
  tgt = R(1, 6) * 100 + R(0, 9) * 10 + R(0, 9);
  cnt = [0, 0, 0];
  say("Buat angka " + tgt + " (" + n + "/5)");
  draw1();
}
function draw1() {
  const c = ["#e74c3c", "#3498db", "#f1c40f"];
  let h = '<div class="row">';
  for (let i = 2; i >= 0; i--) {
    let b = "";
    for (let j = 0; j < cnt[i]; j++) b += `<i class="blk" style="background:${c[i]}"></i>`;
    h += `<div class="pv"><div>${NM[i]}<br><small>(${[1, 10, 100][i]})</small></div><div class="col">${b}</div><div class="row tight"><button data-c="${i}" data-d="1">+</button><button data-c="${i}" data-d="-1">−</button></div></div>`;
  }
  h += `</div><p>Jumlah: <b>${cnt[0] + cnt[1] * 10 + cnt[2] * 100}</b></p><button id="chk">Sudah pas!</button>`;
  $("area").innerHTML = h;
  $("area").querySelectorAll("button[data-c]").forEach((b) => (b.onclick = () => { const i = +b.dataset.c; cnt[i] = Math.max(0, Math.min(9, cnt[i] + +b.dataset.d)); draw1(); }));
  $("chk").onclick = () => {
    const s = cnt[0] + cnt[1] * 10 + cnt[2] * 100;
    s === tgt ? right() : wrong(s < tgt ? "Masih kurang balok." : "Balok kebanyakan.");
  };
}

function q2() {
  const a = R(100, 999);
  let b = Math.random() < 0.2 ? a : Math.random() < 0.5 ? R(100, 999) : a + (R(0, 1) ? R(1, 9) * 10 : -R(1, 9) * 10);
  if (b < 100 || b > 999) b = R(100, 999);
  ans = a > b ? ">" : a < b ? "<" : "=";
  say("Pilih tanda yang pas (" + n + "/5)");
  $("area").innerHTML = `<div class="big">${a} ❓ ${b}</div><div class="row">${["<", "=", ">"].map((s) => `<button class="d" data-s="${s}">${s === "<" ? "&lt;" : s === ">" ? "&gt;" : "="}</button>`).join("")}</div>`;
  $("area").querySelectorAll("button").forEach((x) => (x.onclick = () => (x.dataset.s === ans ? right() : wrong("Petunjuk: lihat ratusannya dulu!"))));
}

function fin() {
  confetti(30);
  say("Hebat, " + name + "! 🌟");
  $("dots").textContent = "";
  $("area").innerHTML = `<div class="big">🐱🐟</div><div>Kamu dapat <b>${ok}</b> ikan!</div><div class="row"><button id="again">Main lagi</button></div>`;
  $("again").onclick = () => startGame(g, { name, onDone: done, confetti });
  done?.(ok);
}
