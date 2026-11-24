// Model kucing kotak-kotak + semua aksesori. Dipakai di peta (world.js) dan preview toko (shop.js).
const T = window.THREE;
const MATS = new Map();
export function mat(color, opts = {}) {
  const key = color + JSON.stringify(opts);
  if (!MATS.has(key)) MATS.set(key, new T.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0, ...opts }));
  return MATS.get(key);
}

function box(w, h, d, m, x, y, z, parent) {
  const me = new T.Mesh(new T.BoxGeometry(w, h, d), m);
  me.position.set(x, y, z);
  me.castShadow = true;
  me.receiveShadow = true;
  parent.add(me);
  return me;
}
function mesh(geo, m, x, y, z, parent) {
  const me = new T.Mesh(geo, m);
  me.position.set(x, y, z);
  me.castShadow = true;
  parent.add(me);
  return me;
}

const GOLD = () => mat(0xffc93c, { metalness: 0.6, roughness: 0.3 });

// ---------- Aksesori ----------
// Topi & wajah menempel ke grup kepala (ukuran kepala 0.95 x 0.85 x 0.85, pusat di 0,0,0; depan = +z).
// Leher, baju, punggung menempel ke akar kucing (badan pusat y=0.9, panjang z -0.75..0.75).
const BUILD = {
  hat_bunga(g) {
    const f = new T.Group();
    f.position.set(0.36, 0.5, 0.12);
    box(0.12, 0.12, 0.12, mat(0xffd43b), 0, 0, 0, f);
    [[0.12, 0], [-0.12, 0], [0, 0.12], [0, -0.12]].forEach(([a, b]) => box(0.13, 0.13, 0.06, mat(0xffffff), a, b, 0, f));
    g.add(f);
  },
  hat_cap(g) {
    box(0.86, 0.26, 0.8, mat(0xe74c3c), 0, 0.55, 0, g);
    box(0.86, 0.06, 0.45, mat(0xc0392b), 0, 0.44, 0.58, g);
    box(0.2, 0.08, 0.2, mat(0xffffff), 0, 0.71, 0, g);
  },
  hat_beanie(g) {
    box(1.0, 0.34, 0.9, mat(0x8e44ad), 0, 0.53, 0, g);
    box(1.04, 0.12, 0.94, mat(0xf39c12), 0, 0.4, 0, g);
    mesh(new T.SphereGeometry(0.14, 10, 8), mat(0xffffff), 0, 0.8, 0, g);
  },
  hat_party(g) {
    const c = mesh(new T.ConeGeometry(0.26, 0.65, 14), mat(0xe91e63), 0.08, 0.78, 0, g);
    c.rotation.z = -0.18;
    mesh(new T.SphereGeometry(0.08, 8, 6), mat(0xffd43b), 0.14, 1.1, 0, g);
    mesh(new T.TorusGeometry(0.2, 0.035, 6, 16), mat(0xffd43b), 0.05, 0.6, 0, g).rotation.x = Math.PI / 2;
  },
  hat_headphone(g) {
    box(1.08, 0.08, 0.16, mat(0x2d3436), 0, 0.5, 0, g);
    box(0.08, 0.45, 0.16, mat(0x2d3436), 0.52, 0.28, 0, g);
    box(0.08, 0.45, 0.16, mat(0x2d3436), -0.52, 0.28, 0, g);
    box(0.16, 0.32, 0.32, mat(0x00cec9), 0.56, 0.05, 0, g);
    box(0.16, 0.32, 0.32, mat(0x00cec9), -0.56, 0.05, 0, g);
  },
  hat_cowboy(g) {
    mesh(new T.CylinderGeometry(0.78, 0.78, 0.05, 20), mat(0x8d5a2b), 0, 0.46, 0, g);
    mesh(new T.CylinderGeometry(0.34, 0.4, 0.36, 16), mat(0x8d5a2b), 0, 0.66, 0, g);
    mesh(new T.CylinderGeometry(0.405, 0.405, 0.08, 16), mat(0x3b2a1a), 0, 0.52, 0, g);
  },
  hat_wizard(g) {
    mesh(new T.CylinderGeometry(0.72, 0.72, 0.04, 20), mat(0x2c3e91), 0, 0.45, 0, g);
    const c = mesh(new T.ConeGeometry(0.42, 1.05, 16), mat(0x2c3e91), 0, 0.98, -0.04, g);
    c.rotation.x = -0.15;
    box(0.16, 0.16, 0.04, mat(0xffd43b, { emissive: 0x665500 }), 0, 0.85, 0.35, g).rotation.z = Math.PI / 4;
  },
  hat_crown(g) {
    mesh(new T.CylinderGeometry(0.38, 0.38, 0.22, 10, 1, true), GOLD(), 0, 0.55, 0, g).material.side = T.DoubleSide;
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      mesh(new T.ConeGeometry(0.08, 0.2, 6), GOLD(), Math.sin(a) * 0.36, 0.75, Math.cos(a) * 0.36, g);
    }
    box(0.1, 0.1, 0.04, mat(0xe74c3c, { emissive: 0x440000 }), 0, 0.55, 0.39, g);
  },

  face_kumis(g) {
    [-1, 1].forEach((s) => {
      const k = box(0.28, 0.07, 0.05, mat(0x3b2a1a), s * 0.15, -0.2, 0.45, g);
      k.rotation.z = s * -0.25;
    });
  },
  face_glasses(g) {
    [-1, 1].forEach((s) => mesh(new T.TorusGeometry(0.13, 0.025, 6, 18), mat(0x2d3436), s * 0.22, 0.08, 0.45, g));
    box(0.18, 0.03, 0.03, mat(0x2d3436), 0, 0.1, 0.45, g);
  },
  face_sun(g) {
    [-1, 1].forEach((s) => box(0.3, 0.2, 0.04, mat(0x111111, { roughness: 0.15 }), s * 0.22, 0.08, 0.45, g));
    box(1.0, 0.05, 0.05, mat(0x111111), 0, 0.12, 0.44, g);
  },
  face_heart(g) {
    const sh = new T.Shape();
    sh.moveTo(0, -0.12);
    sh.bezierCurveTo(-0.2, 0.02, -0.12, 0.16, 0, 0.06);
    sh.bezierCurveTo(0.12, 0.16, 0.2, 0.02, 0, -0.12);
    const geo = new T.ExtrudeGeometry(sh, { depth: 0.04, bevelEnabled: false });
    [-1, 1].forEach((s) => mesh(geo, mat(0xff4d8d, { roughness: 0.2 }), s * 0.22, 0.08, 0.43, g));
    box(0.14, 0.03, 0.03, mat(0xff4d8d), 0, 0.12, 0.46, g);
  },
  face_mask(g) {
    box(0.98, 0.24, 0.88, mat(0xd63031), 0, 0.08, 0, g);
    [-1, 1].forEach((s) => {
      box(0.18, 0.14, 0.02, mat(0xffffff), s * 0.22, 0.08, 0.445, g);
      box(0.1, 0.1, 0.02, mat(0x000000), s * 0.22, 0.08, 0.455, g);
    });
  },

  neck_bow(g) {
    const b = new T.Group();
    b.position.set(0, 1.05, 0.82);
    [-1, 1].forEach((s) => {
      const c = mesh(new T.ConeGeometry(0.14, 0.26, 4), mat(0xe74c3c), s * 0.15, 0, 0, b);
      c.rotation.z = s * Math.PI / 2;
    });
    box(0.1, 0.1, 0.1, mat(0xc0392b), 0, 0, 0, b);
    g.add(b);
  },
  neck_bell(g) {
    collar(g, 0xe74c3c);
    mesh(new T.SphereGeometry(0.1, 10, 8), GOLD(), 0, 0.98, 0.86, g);
  },
  neck_tie(g) {
    collar(g, 0xffffff);
    box(0.14, 0.12, 0.06, mat(0x2e86de), 0, 1.0, 0.8, g);
    box(0.16, 0.34, 0.05, mat(0x2e86de), 0, 0.78, 0.78, g);
  },
  neck_scarf(g) {
    const t = mesh(new T.TorusGeometry(0.44, 0.1, 8, 20), mat(0xe74c3c), 0, 1.12, 0.6, g);
    t.rotation.x = Math.PI / 2;
    t.scale.y = 0.75;
    box(0.2, 0.45, 0.07, mat(0xe74c3c), 0.22, 0.86, 0.86, g);
    box(0.21, 0.08, 0.08, mat(0xffffff), 0.22, 0.9, 0.86, g);
    box(0.21, 0.08, 0.08, mat(0xffffff), 0.22, 0.72, 0.86, g);
  },
  neck_gold(g) {
    const t = mesh(new T.TorusGeometry(0.44, 0.035, 6, 24), GOLD(), 0, 1.1, 0.6, g);
    t.rotation.x = Math.PI / 2;
    t.scale.y = 0.75;
    const p = box(0.14, 0.14, 0.05, mat(0x00b894, { roughness: 0.1, metalness: 0.3 }), 0, 0.98, 0.88, g);
    p.rotation.z = Math.PI / 4;
  },

  body_tee(g) { shirt(g, 0x3498db); },
  body_stripe(g) {
    shirt(g, 0xffffff);
    [-0.35, 0, 0.35].forEach((z) => box(1.08, 0.64, 0.12, mat(0x2d3436), 0, 0.93, z, g));
  },
  body_dress(g) {
    shirt(g, 0xff7eb6);
    box(1.18, 0.3, 1.36, mat(0xff9ecf), 0, 0.62, 0.02, g);
    box(1.22, 0.06, 1.4, mat(0xffffff), 0, 0.48, 0.02, g);
  },
  body_hoodie(g) {
    shirt(g, 0x27ae60);
    box(0.8, 0.35, 0.3, mat(0x229954), 0, 1.38, 0.38, g);
    box(0.5, 0.18, 0.04, mat(0x1e8449), 0, 0.78, 0.76, g);
  },
  body_jacket(g) {
    shirt(g, 0x4a3426);
    box(0.06, 0.62, 1.22, mat(0xbdc3c7, { metalness: 0.6, roughness: 0.3 }), 0, 0.96, 0.05, g).scale.set(1, 1.02, 1);
    box(1.1, 0.12, 0.24, mat(0x3a2619), 0, 1.24, 0.62, g);
  },
  body_hero(g) {
    shirt(g, 0x0984e3);
    [-1, 1].forEach((s) => {
      const z = box(0.04, 0.32, 0.12, mat(0xffd43b, { emissive: 0x554400 }), s * 0.535, 0.95, 0.05, g);
      z.rotation.x = 0.6;
    });
    box(1.1, 0.1, 1.26, mat(0xd63031), 0, 0.66, 0.05, g);
  },

  back_bag(g) {
    box(0.7, 0.5, 0.55, mat(0xe74c3c), 0, 1.5, -0.2, g);
    box(0.5, 0.25, 0.1, mat(0xc0392b), 0, 1.42, -0.52, g);
    box(0.06, 0.06, 0.9, mat(0x3b2a1a), 0.3, 1.27, 0.1, g);
    box(0.06, 0.06, 0.9, mat(0x3b2a1a), -0.3, 1.27, 0.1, g);
  },
  back_cape(g) {
    const pivot = new T.Group();
    pivot.position.set(0, 1.3, 0.55);
    const c = box(1.1, 0.04, 1.5, mat(0xd63031, { side: T.DoubleSide }), 0, 0, -0.75, pivot);
    c.castShadow = true;
    g.add(pivot);
    g.userData.anim.push({ o: pivot, k: "cape" });
  },
  back_butterfly(g) {
    wings(g, [0xff7675, 0xfdcb6e, 0x74b9ff], 0.9);
  },
  back_angel(g) {
    wings(g, [0xffffff, 0xf1f2f6, 0xdfe4ea], 1.05);
  },
  back_jet(g) {
    [-1, 1].forEach((s) => {
      mesh(new T.CylinderGeometry(0.16, 0.16, 0.6, 12), mat(0xb2bec3, { metalness: 0.7, roughness: 0.3 }), s * 0.2, 1.55, -0.25, g).rotation.x = Math.PI / 2;
      mesh(new T.ConeGeometry(0.16, 0.22, 12), mat(0xd63031), s * 0.2, 1.55, 0.14, g).rotation.x = Math.PI / 2;
      const fl = mesh(new T.ConeGeometry(0.12, 0.4, 10), mat(0xff9f1a, { emissive: 0xff5500 }), s * 0.2, 1.55, -0.75, g);
      fl.rotation.x = -Math.PI / 2;
      fl.castShadow = false;
      g.userData.anim.push({ o: fl, k: "flame" });
    });
  },
};

function collar(g, color) {
  const t = mesh(new T.TorusGeometry(0.44, 0.05, 6, 24), mat(color), 0, 1.1, 0.6, g);
  t.rotation.x = Math.PI / 2;
  t.scale.y = 0.75;
}
function shirt(g, color) {
  box(1.06, 0.62, 1.22, mat(color), 0, 0.93, 0.05, g);
}
function wings(g, cols, size) {
  [-1, 1].forEach((s) => {
    const piv = new T.Group();
    piv.position.set(s * 0.15, 1.38, -0.05);
    const a = box(0.7 * size, 0.05, 0.55 * size, mat(cols[0], { side: T.DoubleSide }), s * 0.38 * size, 0.12, 0.08, piv);
    a.rotation.z = s * 0.35;
    const b = box(0.5 * size, 0.05, 0.42 * size, mat(cols[1], { side: T.DoubleSide }), s * 0.3 * size, 0.02, -0.38 * size, piv);
    b.rotation.z = s * 0.25;
    box(0.2 * size, 0.06, 0.2 * size, mat(cols[2]), s * 0.4 * size, 0.15, 0.08, piv);
    piv.userData.side = s;
    g.add(piv);
    g.userData.anim.push({ o: piv, k: "wing" });
  });
}

// ---------- Kucing ----------
export function buildCat(look = {}, catalog) {
  const fur = (catalog?.items || []).find((i) => i.id === look.fur) || { color: "#ff9f43", dark: "#e67e22" };
  const M = new T.MeshStandardMaterial({ color: fur.color, roughness: 0.6 });
  const D = new T.MeshStandardMaterial({ color: fur.dark, roughness: 0.6 });
  const W = mat(0xfff5e6);

  const cat = new T.Group();
  cat.userData = { anim: [], legs: [], M, D };

  const torso = new T.Group();
  cat.add(torso);
  box(1, 0.7, 1.5, M, 0, 0.9, 0, torso);
  box(0.7, 0.12, 1.1, W, 0, 0.56, 0.05, torso); // perut putih
  [-0.25, 0.15].forEach((z) => box(1.02, 0.12, 0.14, D, 0, 1.1, z, torso)); // belang

  const head = new T.Group();
  head.position.set(0, 1.5, 0.95);
  cat.add(head);
  box(0.95, 0.85, 0.85, M, 0, 0, 0, head);
  box(0.5, 0.25, 0.1, W, 0, -0.2, 0.43, head); // moncong
  [-1, 1].forEach((s) => {
    const ear = box(0.25, 0.3, 0.18, M, s * 0.29, 0.55, -0.05, head);
    ear.rotation.z = s * -0.15;
    box(0.13, 0.18, 0.05, mat(0xff9ecf), s * 0.29, 0.53, 0.05, head);
    box(0.16, 0.18, 0.05, mat(0x1a1a1a), s * 0.22, 0.08, 0.43, head);
    box(0.06, 0.06, 0.02, mat(0xffffff), s * 0.2 + 0.03, 0.12, 0.46, head);
    box(0.12, 0.06, 0.02, mat(0xffb3c7), s * 0.33, -0.12, 0.43, head); // pipi
    [0.02, -0.06].forEach((y) => {
      const w = box(0.32, 0.015, 0.015, mat(0x555555), s * 0.4, -0.18 + y, 0.45, head);
      w.rotation.z = s * y * 3;
    });
  });
  box(0.14, 0.09, 0.05, mat(0xff6b81), 0, -0.1, 0.46, head);

  [[-0.3, 0.5], [0.3, 0.5], [-0.3, -0.5], [0.3, -0.5]].forEach(([x, z], i) => {
    const leg = new T.Group();
    leg.position.set(x, 0.6, z);
    box(0.26, 0.55, 0.26, D, 0, -0.27, 0, leg);
    box(0.28, 0.1, 0.32, W, 0, -0.55, 0.03, leg);
    leg.userData.phase = i === 0 || i === 3 ? 0 : Math.PI;
    cat.add(leg);
    cat.userData.legs.push(leg);
  });

  const tail = new T.Group();
  tail.position.set(0, 1.12, -0.72);
  cat.add(tail);
  let seg = tail;
  for (let i = 0; i < 4; i++) {
    const s = new T.Group();
    s.position.set(0, i ? 0.24 : 0, i ? 0 : 0);
    seg.add(s);
    box(0.18, 0.28, 0.18, i === 3 ? D : M, 0, 0.12, 0, s);
    s.rotation.x = i ? -0.25 : -0.9;
    seg = s;
    cat.userData.anim.push({ o: s, k: "tail", i });
  }

  cat.userData.head = head;
  cat.userData.torso = torso;

  // Aksesori
  const acc = { hat: head, face: head, neck: torso, body: torso, back: torso };
  Object.entries(look).forEach(([slot, id]) => {
    if (slot === "fur" || !BUILD[id]) return;
    const parent = acc[slot] || cat;
    const g = new T.Group();
    g.userData.anim = cat.userData.anim;
    BUILD[id](g);
    g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    parent.add(g);
  });
  return cat;
}

// speed 0..1, t detik
export function animateCat(cat, t, speed, air = 0) {
  const u = cat.userData;
  const sw = Math.sin(t * 12);
  u.legs.forEach((l) => (l.rotation.x = (air ? 0.5 * (l.userData.phase ? 1 : -1) : Math.sin(t * 12 + l.userData.phase) * 0.7 * speed)));
  u.torso.position.y = Math.abs(sw) * 0.06 * speed;
  u.head.position.y = 1.5 + Math.abs(sw) * 0.05 * speed + Math.sin(t * 2) * 0.015;
  u.head.rotation.y = Math.sin(t * 0.7) * 0.15 * (1 - speed);
  u.anim.forEach((a) => {
    if (a.k === "tail") a.o.rotation.z = Math.sin(t * (3 + speed * 5) - a.i * 0.6) * (0.18 + speed * 0.12);
    else if (a.k === "cape") a.o.rotation.x = -0.15 - speed * 0.45 - Math.sin(t * 9) * 0.08 * (0.3 + speed);
    else if (a.k === "wing") a.o.rotation.z = a.o.userData.side * (0.2 + Math.sin(t * (4 + speed * 10)) * 0.35);
    else if (a.k === "flame") a.o.scale.setScalar(0.7 + Math.random() * 0.4 + speed * 0.4);
  });
}
