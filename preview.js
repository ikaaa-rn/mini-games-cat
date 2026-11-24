// Preview toko: kucing utuh berjalan di jalan setapak yang terus bergulir, bisa diputar dengan jari.
import { buildCat, animateCat, mat } from "./cat.js";

const T = window.THREE;

export function createPreview(el) {
  const scene = new T.Scene();
  scene.fog = new T.Fog(0xbfe6ff, 12, 26);
  const cam = new T.PerspectiveCamera(36, 1, 0.1, 60);
  const ren = new T.WebGLRenderer({ antialias: true, alpha: true });
  ren.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  ren.shadowMap.enabled = true;
  ren.shadowMap.type = T.PCFSoftShadowMap;
  el.appendChild(ren.domElement);

  scene.add(new T.HemisphereLight(0xe8f6ff, 0x6a8f4b, 0.8));
  const sun = new T.DirectionalLight(0xfff4e0, 0.8);
  sun.position.set(4, 8, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: 1, far: 30 });
  scene.add(sun);

  // tanah rumput + jalan setapak
  const grass = new T.Mesh(new T.PlaneGeometry(60, 30), mat(0x62b847, { roughness: 0.95 }));
  grass.rotation.x = -Math.PI / 2;
  grass.receiveShadow = true;
  scene.add(grass);
  const path = new T.Mesh(new T.PlaneGeometry(60, 1.9), mat(0xd9c39a, { roughness: 1 }));
  path.rotation.x = -Math.PI / 2;
  path.position.y = 0.01;
  path.receiveShadow = true;
  scene.add(path);

  const movers = []; // [obj, parallax, wrap]
  const add = (o, k, span) => { scene.add(o); movers.push([o, k, span]); return o; };
  const stoneM = [mat(0xc9b48e), mat(0xbfa77d)];
  for (let i = 0; i < 18; i++) {
    const s = new T.Mesh(new T.BoxGeometry(0.75, 0.05, 0.6), stoneM[i % 2]);
    s.position.set(-11 + i * 1.25, 0.03, (i % 2 ? 0.35 : -0.3));
    s.receiveShadow = true;
    add(s, 1, 22.5);
  }
  const flowerC = [0xff6b81, 0xffd43b, 0xffffff, 0xa29bfe];
  for (let i = 0; i < 22; i++) {
    const g = new T.Group();
    const near = i % 2 === 0;
    g.position.set(-11 + i * 1.05, 0, near ? 1.6 + (i % 3) * 0.3 : -1.5 - (i % 3) * 0.35);
    if (i % 3 === 0) {
      const b = new T.Mesh(new T.BoxGeometry(0.2, 0.25, 0.2), mat(flowerC[i % 4]));
      b.position.y = 0.2;
      b.castShadow = true;
      g.add(b);
      const st = new T.Mesh(new T.BoxGeometry(0.05, 0.2, 0.05), mat(0x2e9e44));
      st.position.y = 0.08;
      g.add(st);
    } else {
      const b = new T.Mesh(new T.BoxGeometry(0.5, 0.3, 0.4), mat(i % 2 ? 0x3aa655 : 0x2f8f47));
      b.position.y = 0.15;
      b.castShadow = true;
      g.add(b);
    }
    add(g, 1, 23.1);
  }
  // pohon latar (parallax lebih lambat)
  for (let i = 0; i < 7; i++) {
    const g = new T.Group();
    g.position.set(-12 + i * 3.6, 0, -5 - (i % 2) * 1.5);
    const tr = new T.Mesh(new T.BoxGeometry(0.4, 1.6, 0.4), mat(0x8d5a2b));
    tr.position.y = 0.8;
    g.add(tr);
    const lf = new T.Mesh(new T.BoxGeometry(1.8, 1.4, 1.8), mat(i % 2 ? 0x2e9e44 : 0x3cb44b));
    lf.position.y = 2.1;
    lf.castShadow = true;
    g.add(lf);
    add(g, 0.6, 25.2);
  }

  const holder = new T.Group();
  scene.add(holder);
  let cat = null;
  let walking = true, spin = 0, spinV = 0, speed = 1;

  // putar dengan seret
  let lastX = null;
  ren.domElement.style.touchAction = "none";
  ren.domElement.addEventListener("pointerdown", (e) => { lastX = e.clientX; ren.domElement.setPointerCapture(e.pointerId); });
  ren.domElement.addEventListener("pointermove", (e) => { if (lastX === null) return; spinV = (e.clientX - lastX) * 0.012; spin += spinV; lastX = e.clientX; });
  const end = () => (lastX = null);
  ren.domElement.addEventListener("pointerup", end);
  ren.domElement.addEventListener("pointercancel", end);

  function resize() {
    const w = el.clientWidth || 300, h = el.clientHeight || 220;
    ren.setSize(w, h);
    cam.aspect = w / h;
    // jaga seluruh badan kucing (termasuk topi & ekor) tetap terlihat
    const d = w / h < 1 ? 9.5 : 7.6;
    cam.position.set(d * 0.55, 2.7, d * 0.83);
    cam.lookAt(0, 1.15, 0);
    cam.updateProjectionMatrix();
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(el);

  const clock = new T.Clock();
  let t = 0, raf = 0, running = false;
  function loop() {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), 0.05);
    t += dt;
    speed += ((walking ? 1 : 0) - speed) * Math.min(1, dt * 5);
    movers.forEach(([o, k, span]) => {
      o.position.x -= dt * 2.6 * speed * k;
      if (o.position.x < -12) o.position.x += span;
    });
    if (lastX === null) { spinV *= 0.92; spin += spinV; }
    holder.rotation.y = Math.PI / 2 + spin;
    if (cat) animateCat(cat, t, speed);
    ren.render(scene, cam);
  }

  return {
    setLook(look, catalog) {
      if (cat) holder.remove(cat);
      cat = buildCat(look, catalog);
      holder.add(cat);
    },
    setWalking(w) { walking = w; },
    get walking() { return walking; },
    resetSpin() { spin = 0; spinV = 0; },
    start() { if (running) return; running = true; clock.getDelta(); resize(); loop(); },
    stop() { running = false; cancelAnimationFrame(raf); },
  };
}
