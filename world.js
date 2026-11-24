// Peta 3D bergaya Roblox: baseplate ber-stud, jalan, plaza, bangunan, rumah, taman, pohon, lampu, mobil.
import { buildCat, animateCat, mat } from "./cat.js";

const T = window.THREE;

// ---------- util ----------
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const rr = (a, b) => a + rnd() * (b - a);

function canvasTex(w, h, draw, rx = 1, ry = 1) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new T.CanvasTexture(c);
  t.wrapS = t.wrapT = T.RepeatWrapping;
  t.repeat.set(rx, ry);
  t.anisotropy = 4;
  return t;
}
function studTex(base, rx, ry) {
  return canvasTex(64, 64, (x, w) => {
    x.fillStyle = base;
    x.fillRect(0, 0, w, w);
    for (let i = 0; i < 260; i++) {
      x.fillStyle = `rgba(${rnd() < 0.5 ? "0,0,0" : "255,255,255"},${rr(0.02, 0.05)})`;
      x.fillRect(rr(0, w), rr(0, w), 3, 3);
    }
    x.beginPath();
    x.arc(32, 32, 15, 0, Math.PI * 2);
    x.fillStyle = "rgba(0,0,0,.10)";
    x.fill();
    x.beginPath();
    x.arc(30, 30, 14, 0, Math.PI * 2);
    x.fillStyle = "rgba(255,255,255,.12)";
    x.fill();
    x.strokeStyle = "rgba(0,0,0,.08)";
    x.strokeRect(0, 0, w, w);
  }, rx, ry);
}

function B(w, h, d, m, x, y, z, p, shadow = true) {
  const me = new T.Mesh(new T.BoxGeometry(w, h, d), m);
  me.position.set(x, y, z);
  me.castShadow = shadow;
  me.receiveShadow = true;
  p.add(me);
  return me;
}
function M(geo, m, x, y, z, p, shadow = true) {
  const me = new T.Mesh(geo, m);
  me.position.set(x, y, z);
  me.castShadow = shadow;
  me.receiveShadow = true;
  p.add(me);
  return me;
}
function flat(w, d, m, x, y, z, p) {
  const me = new T.Mesh(new T.PlaneGeometry(w, d), m);
  me.rotation.x = -Math.PI / 2;
  me.position.set(x, y, z);
  me.receiveShadow = true;
  p.add(me);
  return me;
}

function signTex(emoji, text, bg, fg = "#fff") {
  return canvasTex(512, 128, (x, w, h) => {
    x.fillStyle = bg;
    x.fillRect(0, 0, w, h);
    x.strokeStyle = "rgba(255,255,255,.85)";
    x.lineWidth = 8;
    x.strokeRect(6, 6, w - 12, h - 12);
    x.fillStyle = fg;
    x.font = "bold 64px system-ui, sans-serif";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText(`${emoji} ${text}`, w / 2, h / 2 + 4);
  });
}
function labelSprite(text, scale = 3, bg = "rgba(0,0,0,.45)") {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 64;
  const x = c.getContext("2d");
  x.fillStyle = bg;
  const r = 28;
  x.beginPath();
  x.moveTo(r, 4);
  x.arcTo(252, 4, 252, 60, r);
  x.arcTo(252, 60, 4, 60, r);
  x.arcTo(4, 60, 4, 4, r);
  x.arcTo(4, 4, 252, 4, r);
  x.fill();
  x.fillStyle = "#fff";
  x.font = "bold 34px system-ui, sans-serif";
  x.textAlign = "center";
  x.textBaseline = "middle";
  x.fillText(text, 128, 34);
  const s = new T.Sprite(new T.SpriteMaterial({ map: new T.CanvasTexture(c), depthTest: false }));
  s.scale.set(scale, scale / 4, 1);
  s.renderOrder = 10;
  return s;
}
function emojiSprite(e, size = 2.4) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const x = c.getContext("2d");
  x.beginPath();
  x.arc(64, 64, 58, 0, Math.PI * 2);
  x.fillStyle = "rgba(255,255,255,.95)";
  x.fill();
  x.lineWidth = 6;
  x.strokeStyle = "#3b2a1a";
  x.stroke();
  x.font = "72px system-ui, sans-serif";
  x.textAlign = "center";
  x.textBaseline = "middle";
  x.fillText(e, 64, 70);
  const s = new T.Sprite(new T.SpriteMaterial({ map: new T.CanvasTexture(c) }));
  s.scale.set(size, size, 1);
  return s;
}

// ---------- tempat penting ----------
export const PLACES = [
  { name: "Warung Ikan", emoji: "🐟", x: -15, z: -15, face: 1, color: 0xf0932b, trim: 0xfff3e0, roof: "gable", roofColor: 0xc0392b, awning: [0x2e86de, 0xffffff] },
  { name: "Taman Balok", emoji: "🧱", x: 15, z: -15, face: 1, color: 0x3c8dde, trim: 0xffffff, roof: "blocks", roofColor: 0x2d6cb3, awning: [0xf1c40f, 0xe74c3c] },
  { name: "Pos Anjing", emoji: "🐶", x: -15, z: 15, face: -1, color: 0x8e6bbf, trim: 0xf5eefc, roof: "gable", roofColor: 0x4a3470, awning: [0x27ae60, 0xffffff] },
  { name: "Toko Aksesori", emoji: "🛍️", x: 15, z: 15, face: -1, color: 0xff7eb6, trim: 0xffffff, roof: "shop", roofColor: 0xd94f8f, awning: [0xff4d8d, 0xffffff] },
];

export function createWorld(el, { onEnter, onFish, minimap }) {
  seed = 7;
  const W = () => el.clientWidth || window.innerWidth;
  const H = () => el.clientHeight || window.innerHeight;

  const scene = new T.Scene();
  scene.fog = new T.Fog(0xcfe8ff, 70, 170);
  const cam = new T.PerspectiveCamera(55, W() / H(), 0.1, 400);
  const ren = new T.WebGLRenderer({ antialias: true });
  ren.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  ren.setSize(W(), H());
  ren.shadowMap.enabled = true;
  ren.shadowMap.type = T.PCFSoftShadowMap;
  el.appendChild(ren.domElement);

  // langit gradasi
  const sky = new T.Mesh(
    new T.SphereGeometry(300, 24, 12),
    new T.ShaderMaterial({
      side: T.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {},
      vertexShader: "varying vec3 p; void main(){ p = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);} ",
      fragmentShader: "varying vec3 p; void main(){ float h = clamp(p.y*1.6,0.0,1.0); vec3 c = mix(vec3(0.85,0.93,1.0), vec3(0.32,0.62,0.97), h); gl_FragColor = vec4(c,1.0);} ",
    }),
  );
  scene.add(sky);

  scene.add(new T.HemisphereLight(0xdff1ff, 0x6a8f4b, 0.75));
  const sun = new T.DirectionalLight(0xfff4e0, 0.85);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const sc = sun.shadow.camera;
  sc.left = sc.bottom = -32;
  sc.right = sc.top = 32;
  sc.near = 1;
  sc.far = 120;
  sun.shadow.bias = -0.0006;
  scene.add(sun, sun.target);

  const world = new T.Group();
  scene.add(world);
  const colliders = [];
  const addBox = (x1, x2, z1, z2) => colliders.push({ b: [Math.min(x1, x2), Math.max(x1, x2), Math.min(z1, z2), Math.max(z1, z2)] });
  const addCircle = (x, z, r) => colliders.push({ c: [x, z, r] });

  // ---------- tanah ----------
  const SIZE = 104, HALF = 48;
  const grass = new T.MeshStandardMaterial({ map: studTex("#62b847", SIZE / 2, SIZE / 2), roughness: 0.9 });
  flat(SIZE, SIZE, grass, 0, 0, 0, world);
  const outer = new T.MeshStandardMaterial({ map: studTex("#5aa841", 120, 120), roughness: 1 });
  const og = flat(480, 480, outer, 0, -0.05, 0, world);
  og.receiveShadow = false;

  const asphaltTex = canvasTex(128, 128, (x, w) => {
    x.fillStyle = "#4b4f57";
    x.fillRect(0, 0, w, w);
    for (let i = 0; i < 900; i++) {
      const v = rr(50, 110) | 0;
      x.fillStyle = `rgba(${v},${v},${v + 6},.35)`;
      x.fillRect(rr(0, w), rr(0, w), 2, 2);
    }
  });
  const asphalt = (len, vertical) => {
    const t = asphaltTex.clone();
    t.needsUpdate = true;
    t.repeat.set(vertical ? 2 : len / 3, vertical ? len / 3 : 2);
    return new T.MeshStandardMaterial({ map: t, roughness: 0.95 });
  };
  const ROAD = 3.2;
  flat(ROAD * 2, SIZE, asphalt(SIZE, true), 0, 0.02, 0, world);
  flat(SIZE, ROAD * 2, asphalt(SIZE, false), 0, 0.021, 0, world);

  const white = mat(0xf5f5f5, { roughness: 0.7 });
  const yellow = mat(0xffd43b, { roughness: 0.7 });
  for (let p = -HALF + 2; p < HALF; p += 4) {
    if (Math.abs(p) < 10) continue;
    flat(0.22, 1.9, yellow, 0, 0.03, p, world);
    flat(1.9, 0.22, yellow, p, 0.03, 0, world);
  }
  // zebra cross
  for (let i = -2; i <= 2; i++) {
    [-9, 9].forEach((d) => {
      flat(0.7, 2, white, i * 1.25, 0.031, d, world);
      flat(2, 0.7, white, d, 0.031, i * 1.25, world);
    });
  }

  // trotoar + kanstin
  const tileTex = canvasTex(64, 64, (x, w) => {
    x.fillStyle = "#c9ccd1";
    x.fillRect(0, 0, w, w);
    x.strokeStyle = "#a9adb4";
    x.lineWidth = 3;
    x.strokeRect(0, 0, w, w);
  });
  const sideMat = (l, v) => {
    const t = tileTex.clone();
    t.needsUpdate = true;
    t.repeat.set(v ? 1 : l / 2.4, v ? l / 2.4 : 1);
    return new T.MeshStandardMaterial({ map: t, roughness: 0.85 });
  };
  const curb = mat(0x9ea3aa);
  const SW = 2.4;
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
    const len = HALF - ROAD;
    const mid = sz * (ROAD + len / 2);
    // sepanjang jalan utara-selatan
    flat(SW, len, sideMat(len, true), sx * (ROAD + SW / 2), 0.06, mid, world);
    B(0.2, 0.14, len, curb, sx * (ROAD + 0.1), 0.07, mid, world, false);
    // sepanjang jalan barat-timur
    const midx = sx * (ROAD + len / 2);
    flat(len, SW, sideMat(len, false), midx, 0.061, sz * (ROAD + SW / 2), world);
    B(len, 0.14, 0.2, curb, midx, 0.07, sz * (ROAD + 0.1), world, false);
  });

  // plaza & air mancur
  const plazaTex = canvasTex(128, 128, (x, w) => {
    x.fillStyle = "#e3d3b4";
    x.fillRect(0, 0, w, w);
    x.strokeStyle = "#c9b48e";
    x.lineWidth = 3;
    for (let i = 0; i <= 4; i++) {
      x.beginPath(); x.moveTo(i * 32, 0); x.lineTo(i * 32, w); x.stroke();
      x.beginPath(); x.moveTo(0, i * 32); x.lineTo(w, i * 32); x.stroke();
    }
  }, 4, 4);
  const plaza = new T.Mesh(new T.CircleGeometry(7.5, 40), new T.MeshStandardMaterial({ map: plazaTex, roughness: 0.8 }));
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.y = 0.05;
  plaza.receiveShadow = true;
  world.add(plaza);
  const stone = mat(0xb8b2a7);
  M(new T.CylinderGeometry(2.6, 2.8, 0.7, 28), stone, 0, 0.35, 0, world);
  const water = new T.MeshStandardMaterial({ color: 0x4fc3f7, roughness: 0.1, metalness: 0.2, transparent: true, opacity: 0.85 });
  M(new T.CylinderGeometry(2.3, 2.3, 0.1, 28), water, 0, 0.66, 0, world, false);
  M(new T.CylinderGeometry(0.35, 0.5, 1.8, 12), stone, 0, 1.3, 0, world);
  M(new T.CylinderGeometry(1.1, 0.6, 0.3, 16), stone, 0, 2.2, 0, world);
  const jet = M(new T.ConeGeometry(0.35, 1.4, 10, 1, true), new T.MeshStandardMaterial({ color: 0xb3e5fc, transparent: true, opacity: 0.7 }), 0, 3, 0, world, false);
  addCircle(0, 0, 2.8);

  // ---------- bangunan ----------
  const brickTex = canvasTex(128, 128, (x, w) => {
    x.fillStyle = "#ffffff";
    x.fillRect(0, 0, w, w);
    x.fillStyle = "#e4e4e4";
    for (let r = 0; r < 8; r++) {
      x.fillRect(0, r * 16, w, 2);
      for (let c = 0; c < 4; c++) x.fillRect(((c * 32 + (r % 2) * 16) % w), r * 16, 2, 16);
    }
  }, 3, 2);
  const glass = new T.MeshStandardMaterial({ color: 0x9fd8ff, roughness: 0.08, metalness: 0.4, emissive: 0x16324a });
  const wood = mat(0x7a4a26);
  const markers = [];
  const pads = [];
  const clickable = [];

  function windowAt(g, x, y, z, w = 1.4, h = 1.3, side = false) {
    const f = B(side ? 0.12 : w + 0.25, h + 0.25, side ? w + 0.25 : 0.12, white, x, y, z, g, false);
    B(side ? 0.14 : w, h, side ? w : 0.14, glass, x, y, z, g, false);
    B(side ? 0.3 : w + 0.4, 0.12, side ? w + 0.4 : 0.3, white, x, y - h / 2 - 0.12, z, g, false);
    return f;
  }

  function building(p, i) {
    const g = new T.Group();
    g.position.set(p.x, 0, p.z);
    g.rotation.y = p.face > 0 ? 0 : Math.PI;
    world.add(g);
    const w = 10, d = 8, h = p.roof === "shop" ? 6 : 5.2;
    const wall = new T.MeshStandardMaterial({ color: p.color, map: brickTex, roughness: 0.8 });
    const trim = mat(p.trim);
    B(w + 0.6, 0.35, d + 0.6, mat(0x8d8d8d), 0, 0.17, 0, g);
    B(w, h, d, wall, 0, h / 2 + 0.3, 0, g);
    B(w + 0.3, 0.35, d + 0.3, trim, 0, h + 0.3, 0, g);
    B(0.3, h, 0.3, trim, w / 2, h / 2 + 0.3, d / 2, g, false);
    B(0.3, h, 0.3, trim, -w / 2, h / 2 + 0.3, d / 2, g, false);
    // pintu
    const fz = d / 2 + 0.05;
    B(2.2, 3, 0.2, trim, 0, 1.8, fz, g, false);
    B(1.8, 2.7, 0.22, wood, 0, 1.65, fz + 0.02, g, false);
    M(new T.SphereGeometry(0.09, 8, 6), mat(0xffd43b, { metalness: 0.7 }), 0.6, 1.6, fz + 0.15, g, false);
    // jendela depan & samping
    windowAt(g, -3.3, 2.1, fz, 2.2, 1.6);
    windowAt(g, 3.3, 2.1, fz, 2.2, 1.6);
    [-1.8, 1.8].forEach((z) => { windowAt(g, w / 2 + 0.05, 2.4, z, 1.6, 1.4, true); windowAt(g, -w / 2 - 0.05, 2.4, z, 1.6, 1.4, true); });
    // kanopi bergaris
    const n = 8;
    for (let k = 0; k < n; k++) {
      const a = B(w / n, 0.12, 1.6, mat(p.awning[k % 2]), -w / 2 + w / n / 2 + (k * w) / n, 3.55, fz + 0.75, g);
      a.rotation.x = 0.35;
    }
    // papan nama
    const sign = new T.Mesh(new T.PlaneGeometry(6.5, 1.6), new T.MeshStandardMaterial({ map: signTex(p.emoji, p.name, "#" + new T.Color(p.roofColor).getHexString()), roughness: 0.6 }));
    sign.position.set(0, h - 0.6, fz + 0.12);
    g.add(sign);
    // atap
    const rm = mat(p.roofColor, { roughness: 0.7 });
    if (p.roof === "gable") {
      const s = new T.Shape();
      s.moveTo(-w / 2 - 0.6, 0); s.lineTo(w / 2 + 0.6, 0); s.lineTo(0, 2.6); s.lineTo(-w / 2 - 0.6, 0);
      const geo = new T.ExtrudeGeometry(s, { depth: d + 1, bevelEnabled: false });
      geo.translate(0, 0, -(d + 1) / 2);
      M(geo, rm, 0, h + 0.45, 0, g);
      B(0.8, 1.6, 0.8, mat(0x8d6e63), 2.6, h + 2, -1.2, g); // cerobong
    } else if (p.roof === "blocks") {
      B(w + 0.3, 0.5, d + 0.3, rm, 0, h + 0.7, 0, g);
      [[0xe74c3c, -2.5, -1], [0xf1c40f, -0.8, -1.4], [0x27ae60, 1.2, -0.8], [0x9b59b6, 2.9, -1.6], [0xe67e22, -1.6, 1]].forEach(([c, x, z], k) => {
        const b = B(1.5, 1.5, 1.5, mat(c), x, h + 1.7, z, g);
        b.rotation.y = k * 0.4;
      });
      B(1.5, 1.5, 1.5, mat(0x3498db), -0.8, h + 3.2, -1.4, g).rotation.y = 0.8;
    } else {
      B(w + 0.4, 0.6, d + 0.4, rm, 0, h + 0.75, 0, g);
      const big = new T.Mesh(new T.PlaneGeometry(7, 1.8), new T.MeshStandardMaterial({ map: signTex("✨", "BUTIK MOMO", "#ff4d8d"), emissive: 0x330011 }));
      big.position.set(0, h + 2.1, fz - 1);
      g.add(big);
      B(7.2, 2, 0.2, white, 0, h + 2.1, fz - 1.15, g);
    }
    // pad masuk yang menyala
    const padMat = new T.MeshStandardMaterial({ color: 0x55efc4, emissive: 0x1abc9c, emissiveIntensity: 0.7, transparent: true, opacity: 0.85 });
    const pad = new T.Mesh(new T.CylinderGeometry(1.3, 1.3, 0.08, 28), padMat);
    pad.position.set(0, 0.1, fz + 1.9);
    g.add(pad);
    const ring = new T.Mesh(new T.TorusGeometry(1.3, 0.06, 6, 32), new T.MeshBasicMaterial({ color: 0xffffff }));
    ring.rotation.x = Math.PI / 2;
    ring.position.copy(pad.position);
    g.add(ring);
    const wp = new T.Vector3();
    pad.getWorldPosition(wp);
    pads.push({ x: wp.x, z: wp.z, i, ring });
    // penanda melayang
    const mk = emojiSprite(p.emoji, 2.4);
    mk.position.set(p.x, h + (p.roof === "gable" ? 5 : 5.4), p.z);
    scene.add(mk);
    markers.push(mk);
    g.traverse((o) => (o.userData.goto = { x: wp.x, z: wp.z }));
    clickable.push(g);
    addBox(p.x - w / 2 - 0.3, p.x + w / 2 + 0.3, p.z - d / 2 - 0.3, p.z + d / 2 + 0.3);
    return g;
  }
  PLACES.forEach(building);

  // dekorasi depan toko aksesori: patung kucing bergaya
  [["hat_crown", "body_hero", "back_cape", "fur_gold", -4], ["hat_wizard", "back_butterfly", "neck_bow", "fur_pink", 4]].forEach(([a, b, c, f, dx]) => {
    const ped = B(1.4, 0.8, 1.4, white, 15 + dx, 0.4, 15 - 6.2, world);
    const k = buildCat({ hat: a, body: b.startsWith("body") ? b : undefined, back: b.startsWith("back") ? b : c, neck: c.startsWith("neck") ? c : undefined, fur: f }, { items: CATALOG_FUR });
    k.scale.setScalar(0.6);
    k.position.set(15 + dx, 0.8, 15 - 6.2);
    k.rotation.y = Math.PI;
    world.add(k);
    addBox(15 + dx - 0.7, 15 + dx + 0.7, 8.1, 9.5);
    ped.userData.k = k;
  });
  // rumah anjing di samping Pos Anjing
  {
    const g = new T.Group();
    g.position.set(-22.5, 0, 9);
    world.add(g);
    B(2, 1.6, 2, mat(0xd35400), 0, 0.8, 0, g);
    const s = new T.Shape();
    s.moveTo(-1.3, 0); s.lineTo(1.3, 0); s.lineTo(0, 1.1); s.lineTo(-1.3, 0);
    const geo = new T.ExtrudeGeometry(s, { depth: 2.4, bevelEnabled: false });
    geo.translate(0, 0, -1.2);
    M(geo, mat(0x7f3b0a), 0, 1.6, 0, g);
    B(0.9, 1.1, 0.05, mat(0x2d1b0e), 0, 0.6, -1.01, g);
    addBox(-23.6, -21.4, 7.9, 10.1);
  }

  // ---------- rumah warga ----------
  const HOUSES = [
    [-34, -14, 0xfad390, 0x6a3d9a], [-34, 14, 0x82ccdd, 0xb33939], [34, -14, 0xf8c291, 0x218c74], [34, 14, 0xb8e994, 0x8e44ad],
    [-14, -34, 0xf6e58d, 0x2c3e50], [14, 34, 0xdff9fb, 0xc0392b], [-14, 34, 0xffbe76, 0x30336b],
  ];
  HOUSES.forEach(([x, z, c, r]) => {
    const g = new T.Group();
    g.position.set(x, 0, z);
    const faceRoad = Math.abs(x) > Math.abs(z) ? (x > 0 ? -Math.PI / 2 : Math.PI / 2) : z > 0 ? Math.PI : 0;
    g.rotation.y = faceRoad;
    world.add(g);
    const w = 7, d = 6, h = 3.6;
    B(w, h, d, new T.MeshStandardMaterial({ color: c, map: brickTex, roughness: 0.85 }), 0, h / 2, 0, g);
    const s = new T.Shape();
    s.moveTo(-w / 2 - 0.5, 0); s.lineTo(w / 2 + 0.5, 0); s.lineTo(0, 2.4); s.lineTo(-w / 2 - 0.5, 0);
    const geo = new T.ExtrudeGeometry(s, { depth: d + 0.8, bevelEnabled: false });
    geo.translate(0, 0, -(d + 0.8) / 2);
    M(geo, mat(r, { roughness: 0.7 }), 0, h, 0, g);
    B(1.4, 2.3, 0.15, wood, 0, 1.15, d / 2 + 0.05, g, false);
    windowAt(g, -2.2, 2, d / 2 + 0.05, 1.3, 1.1);
    windowAt(g, 2.2, 2, d / 2 + 0.05, 1.3, 1.1);
    // pagar kayu depan
    for (let k = -4; k <= 4; k++) if (Math.abs(k) > 0) B(0.18, 0.9, 0.18, white, k * 0.9, 0.45, d / 2 + 2.4, g);
    B(3.4, 0.14, 0.1, white, -2.3, 0.65, d / 2 + 2.4, g, false);
    B(3.4, 0.14, 0.1, white, 2.3, 0.65, d / 2 + 2.4, g, false);
    // kotak bunga
    [-2.2, 2.2].forEach((fx) => {
      B(1.5, 0.3, 0.4, wood, fx, 1.2, d / 2 + 0.25, g, false);
      for (let f = 0; f < 4; f++) B(0.2, 0.2, 0.2, mat([0xff6b81, 0xffd43b, 0xffffff, 0xa29bfe][f]), fx - 0.55 + f * 0.37, 1.45, d / 2 + 0.25, g, false);
    });
    const hw = Math.abs(faceRoad) === Math.PI / 2 ? d / 2 : w / 2, hd = Math.abs(faceRoad) === Math.PI / 2 ? w / 2 : d / 2;
    addBox(x - hw - 0.5, x + hw + 0.5, z - hd - 0.5, z + hd + 0.5);
  });

  const ducks = [];
  // ---------- taman: kolam, bangku, taman bermain ----------
  {
    const px = -30, pz = -32;
    const pond = new T.Mesh(new T.CircleGeometry(5, 32), water);
    pond.rotation.x = -Math.PI / 2;
    pond.position.set(px, 0.08, pz);
    world.add(pond);
    const rim = M(new T.TorusGeometry(5, 0.35, 6, 32), stone, px, 0.1, pz, world);
    rim.rotation.x = Math.PI / 2;
    addCircle(px, pz, 5.2);
    // bebek
    for (let k = 0; k < 3; k++) {
      const dk = new T.Group();
      dk.position.set(px + Math.cos(k * 2) * 2.5, 0.2, pz + Math.sin(k * 2) * 2.5);
      B(0.5, 0.35, 0.7, mat(0xffffff), 0, 0, 0, dk);
      B(0.3, 0.3, 0.3, mat(0xffffff), 0, 0.3, 0.3, dk);
      B(0.15, 0.08, 0.2, mat(0xf39c12), 0, 0.28, 0.52, dk);
      dk.userData.duck = k;
      world.add(dk);
      ducks.push(dk);
    }
    // jembatan kecil
    B(1.8, 0.2, 3, wood, px + 5, 0.35, pz, world);
  }
  {
    // taman bermain
    const gx = 30, gz = -32;
    const sand = flat(12, 10, mat(0xf3d9a4, { roughness: 1 }), gx, 0.04, gz, world);
    sand.receiveShadow = true;
    // perosotan
    B(0.3, 3, 0.3, mat(0xe74c3c), gx - 3, 1.5, gz - 2, world);
    B(0.3, 3, 0.3, mat(0xe74c3c), gx - 1.6, 1.5, gz - 2, world);
    B(1.8, 0.2, 1.6, mat(0x3498db), gx - 2.3, 3, gz - 2, world);
    const sl = B(1.4, 0.15, 4, mat(0xf1c40f), gx - 2.3, 1.6, gz + 0.6, world);
    sl.rotation.x = 0.7;
    addBox(gx - 3.4, gx - 1.2, gz - 2.6, gz + 2.4);
    // ayunan
    B(0.2, 3, 0.2, mat(0x2ecc71), gx + 1.5, 1.5, gz - 1, world);
    B(0.2, 3, 0.2, mat(0x2ecc71), gx + 4.5, 1.5, gz - 1, world);
    B(3.2, 0.2, 0.2, mat(0x2ecc71), gx + 3, 3, gz - 1, world);
    const sw = new T.Group();
    sw.position.set(gx + 3, 3, gz - 1);
    B(0.04, 2, 0.04, mat(0x555555), -0.4, -1, 0, sw);
    B(0.04, 2, 0.04, mat(0x555555), 0.4, -1, 0, sw);
    B(1, 0.1, 0.4, mat(0xe67e22), 0, -2, 0, sw);
    world.add(sw);
    world.userData.swing = sw;
    addBox(gx + 1.3, gx + 4.7, gz - 1.3, gz - 0.7);
  }
  function bench(x, z, ry) {
    const g = new T.Group();
    g.position.set(x, 0, z);
    g.rotation.y = ry;
    world.add(g);
    B(2, 0.12, 0.6, wood, 0, 0.55, 0, g);
    B(2, 0.5, 0.1, wood, 0, 0.85, -0.28, g);
    [-0.85, 0.85].forEach((bx) => B(0.12, 0.55, 0.5, mat(0x333333), bx, 0.27, 0, g));
    addCircle(x, z, 1);
  }
  bench(-22, -32, Math.PI / 2);
  bench(-30, -24, Math.PI);
  bench(5.5, 6.5, -Math.PI / 4);
  bench(-5.5, -6.5, (Math.PI * 3) / 4);

  // ---------- lampu jalan ----------
  const pole = mat(0x2d3436, { metalness: 0.5, roughness: 0.4 });
  const bulb = new T.MeshStandardMaterial({ color: 0xfff7d6, emissive: 0xffe9a0, emissiveIntensity: 0.8 });
  for (let p = -42; p <= 42; p += 14) {
    if (Math.abs(p) < 8) continue;
    [[ROAD + 2, p], [-(ROAD + 2), p], [p, ROAD + 2], [p, -(ROAD + 2)]].forEach(([x, z]) => {
      M(new T.CylinderGeometry(0.1, 0.14, 4.2, 8), pole, x, 2.1, z, world);
      const arm = B(1.2, 0.1, 0.1, pole, x - Math.sign(x) * 0.5 * (Math.abs(x) < 6 ? 1 : 0), 4.15, z - Math.sign(z) * 0.5 * (Math.abs(z) < 6 ? 1 : 0), world, false);
      if (Math.abs(z) < 6) arm.rotation.y = Math.PI / 2;
      M(new T.SphereGeometry(0.28, 10, 8), bulb, arm.position.x - Math.sign(x) * 0.5 * (Math.abs(x) < 6 ? 1 : 0), 4.0, arm.position.z - Math.sign(z) * 0.5 * (Math.abs(z) < 6 ? 1 : 0), world, false);
      addCircle(x, z, 0.35);
    });
  }

  // ---------- mobil parkir ----------
  function car(x, z, ry, color) {
    const g = new T.Group();
    g.position.set(x, 0, z);
    g.rotation.y = ry;
    world.add(g);
    B(1.8, 0.7, 3.6, mat(color, { roughness: 0.3, metalness: 0.2 }), 0, 0.65, 0, g);
    B(1.6, 0.6, 1.9, mat(color, { roughness: 0.3, metalness: 0.2 }), 0, 1.3, -0.2, g);
    B(1.62, 0.45, 1.7, glass, 0, 1.32, -0.2, g, false);
    [[-0.9, 1.1], [0.9, 1.1], [-0.9, -1.1], [0.9, -1.1]].forEach(([wx, wz]) => {
      const wh = M(new T.CylinderGeometry(0.38, 0.38, 0.3, 14), mat(0x1e1e1e), wx, 0.38, wz, g);
      wh.rotation.z = Math.PI / 2;
    });
    B(0.4, 0.2, 0.05, mat(0xffffcc, { emissive: 0x666633 }), -0.55, 0.75, 1.81, g, false);
    B(0.4, 0.2, 0.05, mat(0xffffcc, { emissive: 0x666633 }), 0.55, 0.75, 1.81, g, false);
    const c = Math.cos(ry), s = Math.abs(Math.sin(ry));
    const hx = s > 0.5 ? 1.9 : 1, hz = s > 0.5 ? 1 : 1.9;
    addBox(x - hx, x + hx, z - hz, z + hz);
    return c;
  }
  car(-2.1, 24, 0, 0xe74c3c);
  car(2.1, -28, Math.PI, 0x0984e3);
  car(26, -2.1, Math.PI / 2, 0xfdcb6e);
  car(-36, 2.1, -Math.PI / 2, 0x00b894);

  // ---------- pohon & semak ----------
  const trunkM = mat(0x8d5a2b);
  const leafM = [mat(0x2e9e44), mat(0x3cb44b), mat(0x27863a), mat(0x55c26a)];
  function tree(x, z) {
    const s = rr(0.8, 1.3);
    const g = new T.Group();
    g.position.set(x, 0, z);
    g.scale.setScalar(s);
    g.rotation.y = rr(0, Math.PI);
    world.add(g);
    B(0.6, 2.2, 0.6, trunkM, 0, 1.1, 0, g);
    const lm = leafM[(rnd() * 4) | 0];
    if (rnd() < 0.55) {
      B(2.6, 1.6, 2.6, lm, 0, 2.8, 0, g);
      B(1.8, 1.2, 1.8, lm, 0, 4.0, 0, g);
      B(1, 0.8, 1, lm, 0, 4.9, 0, g);
    } else {
      const geo = new T.IcosahedronGeometry(1.7, 0);
      const l = M(geo, lm, 0, 3.3, 0, g);
      l.material = lm;
      M(new T.IcosahedronGeometry(1.1, 0), lm, 0.8, 4.2, 0.3, g);
    }
    addCircle(x, z, 0.5 * s + 0.1);
  }
  const blocked = (x, z, m = 2) =>
    Math.abs(x) < ROAD + SW + 1.2 || Math.abs(z) < ROAD + SW + 1.2 || Math.hypot(x, z) < 9 ||
    colliders.some((c) => (c.b ? x > c.b[0] - m && x < c.b[1] + m && z > c.b[2] - m && z < c.b[3] + m : Math.hypot(x - c.c[0], z - c.c[1]) < c.c[2] + m)) ||
    (x > 23 && x < 37 && z > -38 && z < -26);
  let placed = 0;
  for (let k = 0; k < 400 && placed < 46; k++) {
    const x = rr(-HALF + 2, HALF - 2), z = rr(-HALF + 2, HALF - 2);
    if (blocked(x, z, 2.2)) continue;
    tree(x, z);
    placed++;
  }
  const bushM = [mat(0x3aa655), mat(0x2f8f47)];
  for (let k = 0, n = 0; k < 300 && n < 40; k++) {
    const x = rr(-HALF + 1, HALF - 1), z = rr(-HALF + 1, HALF - 1);
    if (blocked(x, z, 1)) continue;
    n++;
    if (rnd() < 0.5) B(rr(0.8, 1.4), rr(0.6, 0.9), rr(0.8, 1.4), bushM[n % 2], x, 0.35, z, world);
    else for (let f = 0; f < 3; f++) B(0.22, 0.3, 0.22, mat([0xff6b81, 0xffd43b, 0xffffff, 0xa29bfe, 0xff9f43][(n + f) % 5]), x + f * 0.35, 0.15, z + (f % 2) * 0.3, world, false);
  }

  // ---------- pagar pembatas ----------
  {
    const postGeo = new T.BoxGeometry(0.3, 1.3, 0.3);
    const count = Math.ceil((HALF * 2) / 2) * 4;
    const inst = new T.InstancedMesh(postGeo, white, count);
    inst.castShadow = true;
    const m4 = new T.Matrix4();
    let k = 0;
    for (let p = -HALF; p < HALF; p += 2) {
      [[p, -HALF], [p, HALF], [-HALF, p], [HALF, p]].forEach(([x, z]) => {
        m4.setPosition(x, 0.65, z);
        inst.setMatrixAt(k++, m4);
      });
    }
    inst.count = k;
    world.add(inst);
    [[0, -HALF, HALF * 2, 0.12], [0, HALF, HALF * 2, 0.12], [-HALF, 0, 0.12, HALF * 2], [HALF, 0, 0.12, HALF * 2]].forEach(([x, z, w, d]) => {
      B(w, 0.14, d, white, x, 1.0, z, world, false);
      B(w, 0.14, d, white, x, 0.5, z, world, false);
    });
  }

  // ---------- gunung & awan ----------
  const mtn = [new T.MeshStandardMaterial({ color: 0x6d9f5b, flatShading: true }), new T.MeshStandardMaterial({ color: 0x7f8c8d, flatShading: true })];
  for (let k = 0; k < 18; k++) {
    const a = (k / 18) * Math.PI * 2 + rr(-0.1, 0.1), r = rr(110, 150), hgt = rr(25, 55);
    const m = M(new T.ConeGeometry(rr(18, 30), hgt, 6), mtn[k % 2], Math.cos(a) * r, hgt / 2 - 1, Math.sin(a) * r, scene, false);
    m.receiveShadow = false;
    if (hgt > 42) M(new T.ConeGeometry(6, 9, 6), new T.MeshStandardMaterial({ color: 0xffffff, flatShading: true }), m.position.x, hgt - 5, m.position.z, scene, false);
  }
  const clouds = [];
  const cloudM = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 1, emissive: 0x777777 });
  for (let k = 0; k < 12; k++) {
    const g = new T.Group();
    for (let b = 0; b < 4; b++) B(rr(4, 8), rr(1.5, 3), rr(3, 6), cloudM, b * 3 - 4, rr(0, 1.5), rr(-1.5, 1.5), g, false);
    g.position.set(rr(-120, 120), rr(32, 48), rr(-120, 120));
    scene.add(g);
    clouds.push(g);
  }

  // ---------- spawn pad ----------
  {
    const sp = B(3.2, 0.2, 3.2, mat(0x95a5a6), 0, 0.1, 5.2, world);
    sp.receiveShadow = true;
    const logo = new T.Mesh(new T.PlaneGeometry(2.6, 2.6), new T.MeshBasicMaterial({ map: canvasTex(128, 128, (x, w) => { x.fillStyle = "#7f8c8d"; x.fillRect(0, 0, w, w); x.font = "90px system-ui"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("🐾", 64, 70); }), transparent: true }));
    logo.rotation.x = -Math.PI / 2;
    logo.position.set(0, 0.21, 5.2);
    world.add(logo);
  }

  // ---------- ikan ----------
  const fishes = [];
  const fishMat = new T.MeshStandardMaterial({ color: 0x4aa8ff, emissive: 0x0b4a8a, roughness: 0.3 });
  function fishSpot() {
    for (let k = 0; k < 50; k++) {
      const x = rr(-HALF + 3, HALF - 3), z = rr(-HALF + 3, HALF - 3);
      if (!collide(x, z, 1.2)) return [x, z];
    }
    return [rr(-6, 6), 8];
  }
  function mkFish() {
    const f = new T.Group();
    B(0.8, 0.45, 0.25, fishMat, 0, 0, 0, f);
    const tl = M(new T.ConeGeometry(0.28, 0.4, 4), fishMat, -0.55, 0, 0, f);
    tl.rotation.z = Math.PI / 2;
    B(0.1, 0.1, 0.27, mat(0x111111), 0.22, 0.07, 0, f, false);
    const glow = new T.Mesh(new T.RingGeometry(0.5, 0.75, 24), new T.MeshBasicMaterial({ color: 0xfff176, transparent: true, opacity: 0.6, side: T.DoubleSide }));
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = -0.95;
    f.add(glow);
    const [x, z] = fishSpot();
    f.position.set(x, 1, z);
    scene.add(f);
    return f;
  }

  // ---------- tabrakan ----------
  function collide(x, z, r) {
    for (const c of colliders) {
      if (c.b) {
        const cx = Math.max(c.b[0], Math.min(x, c.b[1])), cz = Math.max(c.b[2], Math.min(z, c.b[3]));
        if ((x - cx) ** 2 + (z - cz) ** 2 < r * r) return true;
      } else if (Math.hypot(x - c.c[0], z - c.c[1]) < c.c[2] + r) return true;
    }
    return false;
  }
  function resolve(p, r) {
    for (let it = 0; it < 2; it++)
      for (const c of colliders) {
        if (c.b) {
          const cx = Math.max(c.b[0], Math.min(p.x, c.b[1])), cz = Math.max(c.b[2], Math.min(p.z, c.b[3]));
          let dx = p.x - cx, dz = p.z - cz;
          const d = Math.hypot(dx, dz);
          if (d < r) {
            if (d < 1e-4) {
              // di dalam kotak: dorong keluar lewat sisi terdekat
              const opts = [[c.b[0] - r - p.x, 0], [c.b[1] + r - p.x, 0], [0, c.b[2] - r - p.z], [0, c.b[3] + r - p.z]];
              opts.sort((a, b) => Math.abs(a[0] + a[1]) - Math.abs(b[0] + b[1]));
              p.x += opts[0][0];
              p.z += opts[0][1];
            } else {
              p.x += (dx / d) * (r - d);
              p.z += (dz / d) * (r - d);
            }
          }
        } else {
          const dx = p.x - c.c[0], dz = p.z - c.c[1], d = Math.hypot(dx, dz), m = c.c[2] + r;
          if (d < m && d > 1e-4) {
            p.x = c.c[0] + (dx / d) * m;
            p.z = c.c[1] + (dz / d) * m;
          }
        }
      }
    p.x = Math.max(-HALF + 1, Math.min(HALF - 1, p.x));
    p.z = Math.max(-HALF + 1, Math.min(HALF - 1, p.z));
  }

  for (let k = 0; k < 14; k++) fishes.push(mkFish());

  // ---------- pemain ----------
  const player = new T.Group();
  player.position.set(0, 0, 5.2);
  player.rotation.y = 0;
  scene.add(player);
  let catModel = null, nameTag = null;
  const shadowBlob = new T.Mesh(new T.CircleGeometry(0.9, 20), new T.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25, depthWrite: false }));
  shadowBlob.rotation.x = -Math.PI / 2;
  scene.add(shadowBlob);

  const marker = new T.Mesh(new T.RingGeometry(0.4, 0.6, 24), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: T.DoubleSide, depthWrite: false }));
  marker.rotation.x = -Math.PI / 2;
  marker.position.y = 0.12;
  scene.add(marker);

  // ---------- kontrol ----------
  let target = null, vy = 0, py = 0, speedNow = 0;
  let yaw = 0.35, pitch = 0.5, dist = 13;
  const keys = {};
  let busy = false, lock = -1, active = true;
  const camPos = new T.Vector3(0, 8, 18);
  const ptrs = new Map();
  let drag = null, pinch0 = 0;
  const cvs = ren.domElement;
  cvs.style.touchAction = "none";

  cvs.addEventListener("pointerdown", (e) => {
    cvs.setPointerCapture(e.pointerId);
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ptrs.size === 1) drag = { x: e.clientX, y: e.clientY, moved: 0 };
    if (ptrs.size === 2) {
      const [a, b] = [...ptrs.values()];
      pinch0 = Math.hypot(a.x - b.x, a.y - b.y);
      drag = null;
    }
  });
  cvs.addEventListener("pointermove", (e) => {
    if (!ptrs.has(e.pointerId)) return;
    const prev = ptrs.get(e.pointerId);
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ptrs.size === 2) {
      const [a, b] = [...ptrs.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      dist = Math.max(6, Math.min(26, dist * (pinch0 / d)));
      pinch0 = d;
      return;
    }
    if (!drag) return;
    const dx = e.clientX - prev.x, dy = e.clientY - prev.y;
    drag.moved += Math.abs(dx) + Math.abs(dy);
    if (drag.moved > 8) {
      yaw -= dx * 0.008;
      pitch = Math.max(0.15, Math.min(1.2, pitch + dy * 0.005));
    }
  });
  const up = (e) => {
    if (!ptrs.has(e.pointerId)) return;
    ptrs.delete(e.pointerId);
    if (drag && drag.moved <= 8 && ptrs.size === 0) tap(e.clientX, e.clientY);
    if (ptrs.size === 0) drag = null;
  };
  cvs.addEventListener("pointerup", up);
  cvs.addEventListener("pointercancel", up);
  cvs.addEventListener("wheel", (e) => { e.preventDefault(); dist = Math.max(6, Math.min(26, dist + e.deltaY * 0.01)); }, { passive: false });
  const ray = new T.Raycaster();
  const groundPlane = new T.Plane(new T.Vector3(0, 1, 0), 0);
  function tap(cx, cy) {
    if (busy) return;
    const r = cvs.getBoundingClientRect();
    const v = new T.Vector2(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(v, cam);
    const hit = ray.intersectObjects(clickable, true)[0];
    if (hit && hit.object.userData.goto) {
      target = new T.Vector3(hit.object.userData.goto.x, 0, hit.object.userData.goto.z);
    } else {
      const pt = new T.Vector3();
      if (!ray.ray.intersectPlane(groundPlane, pt)) return;
      target = pt;
    }
    marker.position.x = target.x;
    marker.position.z = target.z;
    marker.material.opacity = 1;
    marker.scale.setScalar(1.4);
  }
  const kd = (e) => {
    if (e.target && e.target.tagName === "INPUT") return;
    keys[e.key.toLowerCase()] = e.type === "keydown";
    if (e.type === "keydown" && e.key === " ") { jump(); e.preventDefault(); }
  };
  window.addEventListener("keydown", kd);
  window.addEventListener("keyup", kd);
  function jump() {
    if (busy || py > 0.01) return;
    vy = 8;
  }

  // ---------- minimap ----------
  const mm = minimap?.getContext("2d");
  const toMM = (v) => ((v + HALF) / (HALF * 2)) * (minimap?.width || 1);
  const MMCOL = ["#f0932b", "#3c8dde", "#8e6bbf", "#ff7eb6"];
  function drawMinimap() {
    if (!mm) return;
    const S = minimap.width;
    mm.clearRect(0, 0, S, S);
    mm.fillStyle = "#62b847";
    mm.fillRect(0, 0, S, S);
    mm.fillStyle = "#4b4f57";
    const rw = (ROAD * 2 * S) / (HALF * 2);
    mm.fillRect(S / 2 - rw / 2, 0, rw, S);
    mm.fillRect(0, S / 2 - rw / 2, S, rw);
    mm.fillStyle = "#e3d3b4";
    mm.beginPath(); mm.arc(S / 2, S / 2, (7.5 * S) / 96, 0, 7); mm.fill();
    mm.fillStyle = "#4fc3f7";
    mm.beginPath(); mm.arc(toMM(-30), toMM(-32), (5 * S) / 96, 0, 7); mm.fill();
    PLACES.forEach((p, i) => {
      mm.fillStyle = MMCOL[i];
      const s = (10 * S) / 96;
      mm.fillRect(toMM(p.x) - s / 2, toMM(p.z) - s / 2.4, s, s / 1.2);
      mm.font = `${Math.round(S / 10)}px system-ui`;
      mm.textAlign = "center";
      mm.textBaseline = "middle";
      mm.fillText(p.emoji, toMM(p.x), toMM(p.z));
    });
    mm.fillStyle = "#fff176";
    fishes.forEach((f) => { mm.beginPath(); mm.arc(toMM(f.position.x), toMM(f.position.z), 2, 0, 7); mm.fill(); });
    const x = toMM(player.position.x), z = toMM(player.position.z), a = player.rotation.y;
    mm.save();
    mm.translate(x, z);
    mm.rotate(-a);
    mm.fillStyle = "#ff4757";
    mm.strokeStyle = "#fff";
    mm.lineWidth = 2;
    mm.beginPath(); mm.moveTo(0, 7); mm.lineTo(5, -5); mm.lineTo(-5, -5); mm.closePath(); mm.fill(); mm.stroke();
    mm.restore();
  }

  // ---------- loop ----------
  const clock = new T.Clock();
  let t = 0, frame = 0, raf = 0;
  const fwd = new T.Vector3(), right = new T.Vector3(), move = new T.Vector3();
  function loop() {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), 0.05);
    t += dt;
    frame++;

    // input
    move.set(0, 0, 0);
    fwd.set(-Math.sin(yaw), 0, -Math.cos(yaw));
    right.set(Math.cos(yaw), 0, -Math.sin(yaw));
    if (keys.w || keys.arrowup) move.add(fwd);
    if (keys.s || keys.arrowdown) move.sub(fwd);
    if (keys.d || keys.arrowright) move.add(right);
    if (keys.a || keys.arrowleft) move.sub(right);
    if (move.lengthSq() > 0) target = null;
    else if (target) {
      move.set(target.x - player.position.x, 0, target.z - player.position.z);
      if (move.length() < 0.2) { target = null; move.set(0, 0, 0); }
    }
    let want = 0;
    if (!busy && move.lengthSq() > 0) {
      move.normalize();
      want = 1;
      const sp = 7.5 * dt;
      player.position.x += move.x * sp;
      player.position.z += move.z * sp;
      const ang = Math.atan2(move.x, move.z);
      let da = ang - player.rotation.y;
      da = Math.atan2(Math.sin(da), Math.cos(da));
      player.rotation.y += da * Math.min(1, dt * 12);
      const before = player.position.clone();
      resolve(player.position, 0.75);
      if (target && before.distanceTo(player.position) > 0.05 && Math.hypot(target.x - player.position.x, target.z - player.position.z) < 3) target = null;
    }
    speedNow += (want - speedNow) * Math.min(1, dt * 8);
    // lompat
    vy -= 24 * dt;
    py = Math.max(0, py + vy * dt);
    if (py === 0) vy = 0;
    player.position.y = py;
    if (catModel) animateCat(catModel, t, speedNow, py > 0.05 ? 1 : 0);
    shadowBlob.position.set(player.position.x, 0.08, player.position.z);
    shadowBlob.scale.setScalar(1 - Math.min(py, 3) * 0.15);

    marker.material.opacity = Math.max(0, marker.material.opacity - dt * 1.2);
    marker.scale.setScalar(Math.max(0.6, marker.scale.x - dt));

    // ikan
    fishes.forEach((f, k) => {
      f.rotation.y += dt * 2.5;
      f.position.y = 1 + Math.sin(t * 3 + k) * 0.2;
      if (!busy && Math.hypot(player.position.x - f.position.x, player.position.z - f.position.z) < 1.4 && py < 2) {
        const [x, z] = fishSpot();
        f.position.set(x, 1, z);
        onFish?.();
      }
    });

    // pintu masuk
    pads.forEach((p) => {
      p.ring.scale.setScalar(1 + Math.sin(t * 4) * 0.08);
      const d = Math.hypot(player.position.x - p.x, player.position.z - p.z);
      if (lock === p.i && d > 3.2) lock = -1;
      if (!busy && lock !== p.i && d < 1.4) {
        lock = p.i;
        target = null;
        onEnter?.(p.i);
      }
    });
    markers.forEach((m, k) => (m.position.y += Math.sin(t * 2 + k) * 0.01));
    clouds.forEach((c) => { c.position.x += dt * 1.2; if (c.position.x > 140) c.position.x = -140; });
    jet.scale.y = 1 + Math.sin(t * 8) * 0.1;
    if (world.userData.swing) world.userData.swing.rotation.x = Math.sin(t * 1.6) * 0.5;
    ducks.forEach((o) => { { const a = t * 0.3 + o.userData.duck * 2.1; o.position.x = -30 + Math.cos(a) * 2.8; o.position.z = -32 + Math.sin(a) * 2.8; o.rotation.y = -a; } });

    // kamera
    const cx = player.position.x + Math.sin(yaw) * Math.cos(pitch) * dist;
    const cz = player.position.z + Math.cos(yaw) * Math.cos(pitch) * dist;
    const cy = player.position.y * 0.5 + 1.5 + Math.sin(pitch) * dist;
    camPos.lerp(new T.Vector3(cx, cy, cz), Math.min(1, dt * 8));
    cam.position.copy(camPos);
    cam.lookAt(player.position.x, player.position.y * 0.5 + 1.6, player.position.z);
    sun.position.set(player.position.x + 20, 40, player.position.z + 14);
    sun.target.position.set(player.position.x, 0, player.position.z);
    sky.position.copy(cam.position);

    if (frame % 6 === 0) drawMinimap();
    ren.render(scene, cam);
  }
  loop();

  function resize() {
    cam.aspect = W() / H();
    cam.updateProjectionMatrix();
    ren.setSize(W(), H());
  }
  window.addEventListener("resize", resize);

  return {
    setLook(look, catalog, name) {
      if (catModel) player.remove(catModel);
      catModel = buildCat(look, catalog);
      player.add(catModel);
      if (!nameTag) {
        nameTag = labelSprite(name || "Momo", 3);
        nameTag.position.set(0, 3.2, 0);
        player.add(nameTag);
      }
    },
    setName(name) {
      if (nameTag) player.remove(nameTag);
      nameTag = labelSprite(name, 3);
      nameTag.position.set(0, 3.2, 0);
      player.add(nameTag);
    },
    setBusy(b) {
      busy = b;
      Object.keys(keys).forEach((k) => (keys[k] = false));
    },
    setActive(a) {
      if (a === active) return;
      active = a;
      if (a) { clock.getDelta(); loop(); resize(); } else cancelAnimationFrame(raf);
    },
    jump,
    resize,
  };
}

// warna bulu untuk patung dekorasi (tidak bergantung pada katalog server)
const CATALOG_FUR = [
  { id: "fur_gold", color: "#ffd43b", dark: "#e0a800" },
  { id: "fur_pink", color: "#ff9ecf", dark: "#e874ad" },
];
