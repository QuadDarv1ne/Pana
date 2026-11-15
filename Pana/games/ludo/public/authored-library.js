import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { loc, locKey } from '/engine/i18n.js';

// Authored poses and props from the supplied Ludo Studio v2/v3 references.
// The adapter supplies real participants and awarded paths; these are cosmetic.
export function createAuthoredLibrary(ctx) {
  const {V3, clamp, smooth, easeOut, easeIO, elastic, rnd, lerpAngle, easeIn, backOut, FX, cue, face, lookAt, up, cell, hopPath, settle, flash, baseCenter, camYaw, yawTo, dirTo, perpTo, pathAt, pathYaw, cells, die, dieSpin, dieFace, pawns, colors, names, scene, cloud, bump, crowns, crown, tint, approach, scared, flyHome, dizzyHome, hopTo, celebrate, landPose, homeSlot, nextSafe, bubble, wall, spot, hemi, sun, mkTex, fe, xe, me, Ei, Hi, ir, ua} = ctx;
  const actions={}; let Re=0;
  const PI = Math.PI, sin = Math.sin, cos = Math.cos, abs = Math.abs, UP = new V3(0, 1, 0);
  const now = () => ctx.time;
  const seg = (c, a, b) => clamp((c - a) / (b - a));
  const arc = (v) => 4 * v * (1 - v);
  const pulse = (c, a, b) => (c > a && c < b ? sin(seg(c, a, b) * PI) : 0);
  const squash = (p, k) => p.scale.set(1 + k * 0.5, 1 - k, 1 + k * 0.5);
  const park = (p, pos, yaw) => (p.position.copy(pos), p.rotation.set(0, yaw, 0));
  const onPawn = (p, x, y, z) => new V3(x,y,z).multiply(p.scale).applyEuler(p.rotation).add(p.position);
  const fwdOf = (yaw) => new V3(sin(yaw), 0, cos(yaw));
  const rightOf = (yaw) => new V3(cos(yaw), 0, -sin(yaw));
  const watchAll = (pos, extra = {}) => { for (const p of pawns) face(p, { ...lookAt(p, pos), ...extra }); };
  const eachHome = (x, fn) => x.team.forEach((p, k) => { x.busy.add(p); const b = cell(x.seat, -1, k); park(p, b, camYaw(b)); fn(p, k, b); });
  const dim = (k) => { hemi.intensity = 2.5 - 1.3 * k; sun.intensity = 3 - 1.7 * k; };
  const spotOn = (pos, k) => { dim(k); spot.intensity = 16 * k; spot.position.set(pos.x, 4.2, pos.z); spot.target.position.copy(pos); };
  const sweat = (pos, t, n = 3, col = "#6ec3ff") => { for (let k = 0; k < n; k++) { const v = (t * 1.4 + k / n) % 1, ang = k * 2.4 + 0.6; FX.puff(pos.clone().add(new V3(cos(ang) * 0.22 * v, 0.42 + 0.5 * v - 1.1 * v * v, sin(ang) * 0.22 * v)), 0.04, 1 - v, col); } };
  const steam = (pos, t, n = 4, col = "#ffffff") => { for (let k = 0; k < n; k++) { const v = (t * 1.2 + k / n) % 1; FX.puff(pos.clone().add(new V3(sin(k * 2.1 + v * 3) * 0.05, 0.5 + v * 0.4, cos(k * 1.7) * 0.05)), 0.05 + v * 0.08, (1 - v) * 0.6, col); } };
  const orbitStars = (pos, h = 0.55, rad = 0.2, n = 3) => { for (let k = 0; k < n; k++) { const ang = now() * 4 + (k * PI * 2) / n; FX.star(pos.clone().add(new V3(cos(ang) * rad, h + sin(ang * 2) * 0.025, sin(ang) * rad)), 0.09, ang, 1); } };
  const colorOf = (p) => colors[p.userData.seat];
  const hopArc = (p, from, to, v, h) => { p.position.copy(from).lerp(to, easeIO(v)); p.position.y += arc(v) * h; };

  
  const props = [];
  const std = (color, extra = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.45, clearcoat: 0.4, ...extra });
  const part = (parent, geo, mat, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; parent.add(m); return m; };
  const prop = (build) => { const g = new THREE.Group(); g.rotation.order = "YXZ"; build && build(g); g.visible = false; scene.add(g); props.push(g); return g; };
  const pool = (count, build) => Array.from({ length: count }, (_, k) => prop((g) => build(g, k)));
  const show = (obj, pos, yaw = 0, sc = 1, pitch = 0, roll = 0) => { obj.visible = sc > 0.004; obj.position.copy(pos); obj.rotation.set(pitch, yaw, roll); obj.scale.setScalar(Math.max(0.001, sc)); return obj; };
  const stretch = (obj, from, to, thick) => { const d = to.clone().sub(from), len = d.length(); obj.visible = len > 0.005; if (!obj.visible) return; obj.position.copy(from).addScaledVector(d, 0.5); obj.quaternion.setFromUnitVectors(UP, d.multiplyScalar(1 / len)); obj.scale.set(thick, len, thick); };
  const CREAM = "#fff6e2", DARK = "#2b2030", WOOD = "#9a6234";
  const signs = [locKey("¡Queremos|salir!"), locKey("¡Seis|YA!"), locKey("¡Huelga!"), locKey("¡Dado|tramposo!")].map((txt) =>
    prop((g) => {
      const tex = mkTex(256, 128, (cx, w, h) => {
        cx.fillStyle = CREAM; cx.fillRect(0, 0, w, h); cx.strokeStyle = DARK; cx.lineWidth = 10; cx.strokeRect(5, 5, w - 10, h - 10);
        cx.fillStyle = "#e8443a"; cx.textAlign = "center"; cx.textBaseline = "middle";
        const lines = loc(txt).split("|"); cx.font = `900 ${lines.length > 1 ? 46 : 52}px Nunito,"Arial Black",system-ui,sans-serif`;
        lines.forEach((l, k) => cx.fillText(l, w / 2, h / 2 + 4 + (k - (lines.length - 1) / 2) * 50));
      });
      part(g, new THREE.CylinderGeometry(0.008, 0.008, 0.3, 6), std(WOOD), 0, 0.15, 0);
      part(g, new THREE.BoxGeometry(0.25, 0.125, 0.012), std(CREAM), 0, 0.33, 0);
      part(g, new THREE.PlaneGeometry(0.24, 0.12), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6 }), 0, 0.33, 0.0066);
    }),
  );
  const tiles = pool(16, (g) => { part(g, new RoundedBoxGeometry(0.05, 0.014, 0.1, 2, 0.005), std(CREAM), 0, 0.007, 0); part(g, new THREE.BoxGeometry(0.046, 0.003, 0.006), std(DARK), 0, 0.0145, 0); part(g, new THREE.CylinderGeometry(0.007, 0.007, 0.003, 8), std(DARK), 0, 0.0145, 0.026); part(g, new THREE.CylinderGeometry(0.007, 0.007, 0.003, 8), std(DARK), 0, 0.0145, -0.026); });
  const table = prop((g) => { part(g, new THREE.CylinderGeometry(0.26, 0.26, 0.025, 28), std(WOOD), 0, 0.1, 0); part(g, new THREE.CylinderGeometry(0.05, 0.08, 0.09, 12), std("#7a4a26"), 0, 0.045, 0); });
  const webMat = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide, opacity: 0.9, map: mkTex(256, 256, (cx, w) => {
    cx.strokeStyle = "#ffffff"; cx.lineWidth = 2.2; cx.translate(w / 2, w / 2);
    for (let k = 0; k < 12; k++) { const ang = (k / 12) * PI * 2; cx.beginPath(); cx.moveTo(0, 0); cx.lineTo(cos(ang) * 124, sin(ang) * 124); cx.stroke(); }
    for (let ring = 1; ring <= 6; ring++) { cx.beginPath(); for (let k = 0; k <= 12; k++) { const ang = (k / 12) * PI * 2, ang0 = ((k - 0.5) / 12) * PI * 2, rr = ring * 20; k === 0 ? cx.moveTo(cos(ang) * rr, sin(ang) * rr) : cx.quadraticCurveTo(cos(ang0) * rr * 0.86, sin(ang0) * rr * 0.86, cos(ang) * rr, sin(ang) * rr); } cx.stroke(); }
  }) });
  const web = prop((g) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), webMat); m.rotation.x = -PI / 2; g.add(m); });
  const spider = prop((g) => { part(g, new THREE.SphereGeometry(0.035, 12, 10), std(DARK), 0, 0, 0); part(g, new THREE.SphereGeometry(0.022, 10, 8), std(DARK), 0, -0.01, 0.04); for (const sx of [-1, 1]) part(g, new THREE.SphereGeometry(0.007, 6, 6), new THREE.MeshBasicMaterial({ color: "#ffffff" }), sx * 0.01, -0.004, 0.058); });
  const hands = pool(12, (g) => { g.userData.mat = std("#ffffff"); part(g, new THREE.SphereGeometry(0.034, 12, 10), g.userData.mat); });
  const hand = (k, pos, color, sc = 1) => { const h = hands[k]; h.userData.mat.color.set(color); return show(h, pos, 0, sc); };
  const hankies = pool(4, (g) => { const m = part(g, new THREE.PlaneGeometry(0.1, 0.1), new THREE.MeshStandardMaterial({ color: "#ffffff", side: THREE.DoubleSide, roughness: 0.8 }), 0, -0.05, 0); m.castShadow = false; });
  const cannon = prop((g) => {
    const tube = new THREE.Group(); tube.position.set(0, 0.14, 0); tube.rotation.x = PI / 2 - 0.75; g.add(tube); g.userData.tube = tube;
    part(tube, new THREE.CylinderGeometry(0.105, 0.125, 0.36, 20, 1, true), std("#3a3340", { side: THREE.DoubleSide, metalness: 0.5 }), 0, 0.1, 0);
    part(tube, new THREE.SphereGeometry(0.125, 16, 10), std("#3a3340", { metalness: 0.5 }), 0, -0.08, 0);
    part(tube, new THREE.TorusGeometry(0.11, 0.018, 8, 20), std("#ffc93c", { metalness: 0.6 }), 0, 0.28, 0).rotation.x = PI / 2;
    for (const sx of [-1, 1]) part(g, new THREE.CylinderGeometry(0.085, 0.085, 0.04, 16), std(WOOD), sx * 0.14, 0.085, 0).rotation.z = PI / 2;
  });
  const skate = prop((g) => { part(g, new RoundedBoxGeometry(0.11, 0.018, 0.3, 2, 0.008), std("#ff8a3d"), 0, 0, 0); for (const sx of [-1, 1]) for (const sz of [-1, 1]) part(g, new THREE.CylinderGeometry(0.022, 0.022, 0.02, 10), std(CREAM), sx * 0.045, -0.022, sz * 0.1).rotation.z = PI / 2; });
  const chimney = prop((g) => { part(g, new THREE.CylinderGeometry(0.04, 0.03, 0.09, 12), std("#3a3340"), 0, 0.045, 0); part(g, new THREE.CylinderGeometry(0.052, 0.052, 0.016, 12), std("#ffc93c", { metalness: 0.5 }), 0, 0.095, 0); });
  const rods = pool(4, (g) => { g.userData.mat = std(WOOD); part(g, new THREE.CylinderGeometry(1, 1, 1, 10), g.userData.mat); });
  const rod = (k, from, to, thick, color) => { rods[k].userData.mat.color.set(color); stretch(rods[k], from, to, thick); };
  const phone = prop((g) => { part(g, new RoundedBoxGeometry(0.075, 0.125, 0.012, 2, 0.008), std(DARK), 0, 0, 0); part(g, new THREE.PlaneGeometry(0.062, 0.108), new THREE.MeshBasicMaterial({ color: "#9fe8ff" }), 0, 0, 0.0066); part(g, new THREE.SphereGeometry(0.006, 8, 6), std("#ffffff"), 0.022, 0.045, -0.008); });
  const goal = prop((g) => {
    const white = std("#ffffff");
    for (const sx of [-1, 1]) part(g, new THREE.CylinderGeometry(0.012, 0.012, 0.38, 8), white, sx * 0.3, 0.19, 0);
    part(g, new THREE.CylinderGeometry(0.012, 0.012, 0.62, 8), white, 0, 0.38, 0).rotation.z = PI / 2;
    const net = new THREE.MeshStandardMaterial({ transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false, map: mkTex(128, 128, (cx, w) => { cx.strokeStyle = "#ffffff"; cx.lineWidth = 3; for (let k = 0; k <= w; k += 16) { cx.beginPath(); cx.moveTo(k, 0); cx.lineTo(k, w); cx.moveTo(0, k); cx.lineTo(w, k); cx.stroke(); } }) });
    const back = part(g, new THREE.PlaneGeometry(0.6, 0.4), net, 0, 0.18, -0.16); back.rotation.x = 0.35; back.castShadow = false; g.userData.net = back;
  });
  const fork = prop((g) => { const m = std(WOOD); part(g, new THREE.CylinderGeometry(0.02, 0.026, 0.2, 8), m, 0, 0.1, 0); for (const sx of [-1, 1]) part(g, new THREE.CylinderGeometry(0.016, 0.018, 0.24, 8), m, sx * 0.065, 0.3, 0).rotation.z = -sx * 0.576; });
  const vacuum = prop((g) => {
    const body = part(g, new RoundedBoxGeometry(0.26, 0.2, 0.32, 3, 0.06), std("#e8443a"), 0, 0.14, 0); g.userData.body = body;
    part(g, new THREE.SphereGeometry(0.07, 14, 10), std(DARK), 0, 0.26, -0.04);
    for (const sx of [-1, 1]) part(g, new THREE.CylinderGeometry(0.05, 0.05, 0.03, 14), std(DARK), sx * 0.14, 0.05, -0.08).rotation.z = PI / 2;
    part(g, new THREE.CylinderGeometry(0.035, 0.035, 0.05, 12), std("#c9d3de", { metalness: 0.7 }), 0, 0.2, 0.17).rotation.x = PI / 2;
  });
  const beamMat = new THREE.MeshBasicMaterial({ color: "#b6ffbf", transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false, fog: false });
  const ufo = prop((g) => {
    part(g, new THREE.SphereGeometry(0.3, 28, 12), std("#c9d3de", { metalness: 0.8, roughness: 0.25, clearcoat: 1 }), 0, 0, 0).scale.y = 0.26;
    part(g, new THREE.SphereGeometry(0.14, 18, 10, 0, PI * 2, 0, PI / 2), std("#8fe9ff", { transparent: true, opacity: 0.7 }), 0, 0.03, 0);
    for (let k = 0; k < 6; k++) part(g, new THREE.SphereGeometry(0.022, 8, 6), new THREE.MeshBasicMaterial({ color: "#ffe680" }), cos((k / 6) * PI * 2) * 0.24, -0.03, sin((k / 6) * PI * 2) * 0.24).castShadow = false;
    const beam = part(g, new THREE.CylinderGeometry(0.07, 0.27, 1.05, 24, 1, true), beamMat, 0, -0.56, 0); beam.castShadow = false; g.userData.beam = beam;
  });
  const cake = prop((g) => { part(g, new THREE.CylinderGeometry(0.07, 0.07, 0.05, 20), std("#ff9ec4"), 0, 0.025, 0); part(g, new THREE.CylinderGeometry(0.076, 0.076, 0.016, 20), std("#fffaf0"), 0, 0.056, 0); part(g, new THREE.SphereGeometry(0.016, 10, 8), std("#e8443a"), 0, 0.078, 0); });
  const splat = prop((g) => { part(g, new THREE.SphereGeometry(0.095, 14, 10), std("#fffaf0", { roughness: 0.7 }), 0, 0, 0).scale.set(1, 0.95, 0.45); part(g, new THREE.SphereGeometry(0.016, 10, 8), std("#e8443a"), 0.02, 0.03, 0.045); });
  const ghostMat = new THREE.MeshPhysicalMaterial({ color: "#ffffff", transparent: true, opacity: 0.8, roughness: 0.3, depthWrite: false });
  const ghostEye = new THREE.MeshBasicMaterial({ color: DARK, transparent: true });
  const ghost = prop((g) => {
    part(g, new THREE.SphereGeometry(0.115, 20, 12), ghostMat, 0, 0.3, 0).castShadow = false; part(g, new THREE.CylinderGeometry(0.085, 0.125, 0.19, 20), ghostMat, 0, 0.15, 0).castShadow = false;
    for (let k = 0; k < 4; k++) part(g, new THREE.SphereGeometry(0.05, 10, 8), ghostMat, cos(k * PI / 2) * 0.08, 0.05, sin(k * PI / 2) * 0.08).castShadow = false;
    for (const sx of [-1, 1]) part(g, new THREE.SphereGeometry(0.02, 10, 8), ghostEye, sx * 0.042, 0.32, 0.1).castShadow = false;
    part(g, new THREE.SphereGeometry(0.016, 10, 8), ghostEye, 0, 0.275, 0.108).castShadow = false;
  });
  const tongue = prop((g) => { part(g, new RoundedBoxGeometry(0.034, 0.012, 0.075, 2, 0.005), std("#ff5a8a"), 0, 0, 0.036); });
  const carpet = prop((g) => { part(g, new THREE.BoxGeometry(0.3, 0.012, 1), std("#c81e2e", { roughness: 0.9, clearcoat: 0 }), 0, 0, 0.5); for (const sx of [-1, 1]) part(g, new THREE.BoxGeometry(0.02, 0.013, 1), std("#ffc93c"), sx * 0.135, 0, 0.5); });
  const carpetRoll = prop((g) => { part(g, new THREE.CylinderGeometry(1, 1, 0.31, 16), std("#a31421", { roughness: 0.9 })).rotation.z = PI / 2; });
  const pinata = prop((g) => {
    part(g, new THREE.SphereGeometry(0.15, 16, 12), std("#ff4b9a"), 0, -0.2, 0); part(g, new THREE.TorusGeometry(0.15, 0.02, 8, 24), std("#ffc629"), 0, -0.2, 0).rotation.x = PI / 2;
    const tips = [[0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]], cols = ["#2ad1b2", "#ffc629", "#3d7bf2", "#a46bff", "#ff8a3d", "#8dff8a"];
    tips.forEach(([x, y, z], k) => { const cn = part(g, new THREE.ConeGeometry(0.07, 0.2, 10), std(cols[k]), x * 0.22, -0.2 + y * 0.22, z * 0.22); cn.quaternion.setFromUnitVectors(UP, new V3(x, y, z)); });
  });
  const mangos = pool(10, (g) => { part(g, new THREE.SphereGeometry(0.05, 12, 10), std("#ffb52e", { roughness: 0.35 }), 0, 0, 0).scale.set(1, 1.28, 0.9); part(g, new THREE.SphereGeometry(0.012, 6, 6), std("#3f8f3a"), 0, 0.066, 0); });
  const watches = pool(5, (g) => { part(g, new THREE.CylinderGeometry(0.05, 0.05, 0.014, 20), std(DARK), 0, 0, 0).rotation.x = PI / 2; part(g, new THREE.CylinderGeometry(0.04, 0.04, 0.016, 20), std(CREAM), 0, 0, 0).rotation.x = PI / 2; g.userData.needle = part(g, new THREE.BoxGeometry(0.005, 0.032, 0.004), std("#e8443a"), 0, 0.012, 0.0095); });
  const fly = prop((g) => { part(g, new THREE.SphereGeometry(0.02, 8, 6), std(DARK), 0, 0, 0); g.userData.wings = [-1, 1].map((sx) => { const w = part(g, new THREE.PlaneGeometry(0.035, 0.02), new THREE.MeshBasicMaterial({ color: "#dff6ff", transparent: true, opacity: 0.7, side: THREE.DoubleSide }), sx * 0.022, 0.012, 0); w.castShadow = false; return w; }); });
  
  const avatar = prop();

  // Dice poses.
  const DIE_START = () => ctx.dieStart.clone();
  const DIE_MID = ctx.dieLanding;
  const setDie = (num) => dieSpin.quaternion.setFromEuler(new THREE.Euler(...dieFace[num]));
  const tumble = (num, v, turns = 1) => { const k = easeOut(v) * turns; dieSpin.quaternion.setFromEuler(new THREE.Euler(k * PI * 7, k * PI * 4.5, k * PI * 5.5)).slerp(new THREE.Quaternion().setFromEuler(new THREE.Euler(...dieFace[num])), smooth((v - 0.6) / 0.4)); };
  const dieWobble = (t, amt = 1) => { const k = Math.exp(-t * 6) * amt; die.rotation.set(0.1 * k * sin(t * 26), 0, 0.13 * k * sin(t * 22 + 1)); };
  const badFace = (x) => (x.steps === 6 ? 3 : x.steps);
  
  const failRoll = x => x.steps;

  
  Object.assign(actions, {
    
    huelga(x, c) {
      const { D, J, col, seat } = x, ctr = baseCenter(seat);
      failRoll(x, c);
      cue("sad", 0.18); [0.5, 0.6, 0.7, 0.8, 0.9].forEach((tm) => cue("tap", tm));
      const chant = c > 0.46 ? abs(sin((c - 0.46) * D * 6)) : 0;
      eachHome(x, (p, k, b) => {
        if (c < 0.2) return face(p, lookAt(p, die.position));
        const sit = smooth(seg(c, 0.2 + k * 0.02, 0.32 + k * 0.02));
        p.scale.set(1 + 0.14 * sit, 1 - 0.3 * sit, 1 + 0.14 * sit);
        p.rotation.z = sin(now() * 3 + k) * 0.05 * sit;
        cue("land", 0.3 + k * 0.02);
        const pop = elastic(seg(c, 0.34 + k * 0.04, 0.52 + k * 0.04)), yaw = camYaw(b);
        const at = b.clone().addScaledVector(rightOf(yaw), 0.15).setY(b.y - 0.14 + 0.2 * pop + chant * 0.05 * J * (k % 2 ? 1 : 0.6));
        show(signs[k], at, yaw, pop, 0, sin(now() * 4 + k * 1.7) * 0.12 * J);
        face(p, { open: 0.6, mouth: chant > 0.5 ? "o" : "flat", ly: 0.25, noBlink: true });
      });
      FX.text(locKey("¡Queremos salir!"), col, up(ctr, 1.3), (c - 0.5) * D, { hold: true, size: 0.95 });

    },
    bostezo(x, c) {
      const { D, J } = x;
      failRoll(x, c);
      eachHome(x, (p, k, b) => {
        const t0 = 0.26 + k * 0.15, v = seg(c, t0, t0 + 0.22), y = sin(v * PI);
        cue("yawn", t0 + 0.02);
        if (c < 0.2) return face(p, lookAt(p, die.position));
        p.scale.set(1 - 0.06 * y, 1 + 0.14 * y * J, 1 - 0.06 * y);
        p.rotation.x = -0.28 * y * J;
        const after = c > t0 + 0.22;
        face(p, { open: after ? 0.45 : 1 - 0.85 * y, mouth: y > 0.15 ? "o" : after ? "flat" : "smile", mouthSize: 1 + 2 * y * J, ly: after ? -0.3 : 0.5 * y, noBlink: true });
        if (y > 0.3) FX.puff(onPawn(p, 0, 0.3, 0.16).add(new V3(0, y * 0.08, 0)), 0.05 + y * 0.05, 0.35);
        FX.text(locKey("aaah"), "#ffffff", up(b, 0.8), (c - t0 - 0.04) * D, { life: 0.8, size: 0.4, tilt: 0.15 });
      });
      FX.text(locKey("Qué aburrimiento…"), "#c9c3d6", up(baseCenter(x.seat), 1.25), (c - 0.84) * D, { hold: true, size: 0.75 });

    },
    cartas(x, c) {
      const { D, J, col, seat } = x, ctr = baseCenter(seat), lvl = c < 0.33 ? 0 : c < 0.66 ? 1 : 2;
      failRoll(x, c, [0.02, 0.35, 0.68][lvl], [0.07, 0.4, 0.73][lvl], [2, 4, 5][lvl]);
      const b0 = cell(seat, -1, 0), b1 = cell(seat, -1, 1), mid = b0.clone().lerp(b1, 0.5), along = dirTo(b0, b1), yawA = yawTo(b0, b1);
      eachHome(x, (p, k, b) => {
        const target = lvl === 0 ? (k < 2 ? mid : b) : ctr;
        if (target !== b) p.rotation.y = yawTo(b, target);
        const lean = lvl === 2 ? 0.2 : 0.1;
        p.rotation.x = target !== b ? lean : 0;
        face(p, target === b ? { ly: -0.3, open: 0.5, mouth: "flat" } : { ...lookAt(p, up(target, 0.2)), open: lvl === 2 ? 1.25 : 1, mouth: lvl === 2 ? "o" : "smile", noBlink: lvl === 2 });
      });
      if (lvl === 0) {
        for (let k = 0; k < 4; k++) { const t0 = 0.09 + k * 0.055, v = seg(c, t0, t0 + 0.035); cue("clack", t0 + 0.035); if (v <= 0) continue; const at = mid.clone().addScaledVector(along, (k - 1.5) * 0.105).setY(0.2 + 0.25 * (1 - easeIn(v))); show(tiles[k], at, yawA + PI / 2, 1); const who = x.team[k % 2]; if (v < 1) who.rotation.x = 0.35 * sin(v * PI); }
      } else {
        const tp = elastic(seg(c, 0.36, 0.44)); cue("pop", 0.37);
        show(table, ctr.clone().setY(0.19), 0, tp);
        const top = 0.19 + 0.115;
        if (lvl === 1) {
          for (let k = 0; k < 10; k++) { const t0 = 0.42 + k * 0.022, v = seg(c, t0, t0 + 0.02); cue("clack", t0 + 0.02); if (v <= 0) continue; const ang = k * 0.62, rad = 0.05 + k * 0.016; show(tiles[k], new V3(ctr.x + cos(ang) * rad, top + 0.2 * (1 - easeIn(v)), ctr.z + sin(ang) * rad), -ang, 0.8); }
          FX.text(locKey("¡Tranca!"), col, up(ctr, 1.05), (c - 0.6) * D, { life: 1, size: 0.6 });
        } else {
          
          let idx = 0; const rows = [[-0.09, 0, 0.09], [-0.045, 0.045], [0]];
          rows.forEach((row, lv) => row.forEach((ox) => { for (const sd of [-1, 1]) { const t0 = 0.7 + idx * 0.017, v = seg(c, t0, t0 + 0.02); cue("tap", t0 + 0.02); const tl = tiles[idx++]; if (v <= 0) continue; const fall = c > 0.955 ? easeIn(seg(c, 0.955, 0.985)) : 0; show(tl, new V3(ctr.x + ox + sd * 0.022, top + lv * 0.088 + 0.045 + 0.2 * (1 - easeIn(v)) - fall * (lv * 0.088 + 0.04), ctr.z), sd * PI / 2, 0.85, PI / 2 - 0.3 - fall * 1.25); } }));
          const tense = seg(c, 0.7, 0.95);
          x.team.forEach((p, k) => { p.position.x += sin(now() * 70 + k) * 0.003 * tense * J; });
          if (c > 0.955) { cue("strike", 0.957); const t2 = (c - 0.955) * D; FX.text(locKey("¡Nooo!"), "#ff5a3c", up(ctr, 1.1), t2, { hold: true, size: 0.8 }); FX.dust(up(ctr, 0.1), t2, { count: 10, size: 0.14, seed: 3 }); x.team.forEach((p) => face(p, { open: 1.4, size: 1.15, pupil: 0.5, mouth: "o", noBlink: true })); }
        }
      }
      FX.text([locKey("Nivel 1 · dominó"), locKey("Nivel 2 · mesa y partida"), locKey("Nivel 3 · castillo")][lvl], "#ffffff", up(ctr, 1.35), (c - [0.06, 0.38, 0.7][lvl]) * D, { life: 1.6, size: 0.6 });

    },
    empujon(x, c) {
      const { D, J, mover: p, seat, piece, col } = x, b = cell(seat, -1, piece), goalPos = cell(seat, 0), dir = dirTo(b, goalPos), yaw = yawTo(b, goalPos);
      const W = b.clone().addScaledVector(dir, 0.36), foot = W.clone().addScaledVector(dir, -0.13);
      failRoll(x, c);
      x.busy.add(p);
      cue("pop", 0.17); cue("hop", 0.3); [0.4, 0.46, 0.52].forEach((tm) => cue("tap", tm)); cue("slip", 0.6); cue("land", 0.74);
      
      wall.visible = c > 0.16; wall.position.copy(W).setY(0.15); wall.rotation.set(0, yaw, 0);
      wall.children.forEach((br, k) => { const v = (c - 0.16 - k * 0.012) / 0.06; br.visible = v > 0; br.position.copy(br.userData.home); br.position.y += 0.4 * (1 - backOut(v)); br.material.color.set(col); br.scale.setScalar(Math.max(0.01, Math.min(1, v * 2))); });
      if (c < 0.3) { park(p, b, lerpAngle(camYaw(b), yaw, smooth(seg(c, 0.16, 0.26)))); face(p, { ...lookAt(p, up(W, 0.3)), open: 0.5, mouth: "flat" }); }
      else if (c < 0.38) { const v = seg(c, 0.3, 0.38); hopArc(p, b, foot, v, 0.14); p.rotation.set(0.2, yaw, 0); face(p, { open: 1.1, mouth: "o", noBlink: true }); }
      else if (c < 0.6) { const v = seg(c, 0.38, 0.6), t2 = (c - 0.38) * D; park(p, foot, yaw); p.position.y += 0.2 * easeOut(v) + abs(sin(t2 * 18)) * 0.015; p.position.x += sin(t2 * 40) * 0.004 * J; p.rotation.x = 0.32; p.rotation.z = sin(t2 * 18) * 0.12 * J; p.scale.set(0.94, 1.1, 0.94); face(p, { ly: 0.9, open: 0.5, mouth: "flat", noBlink: true }); sweat(p.position, t2, 2); }
      else if (c < 0.74) { const v = seg(c, 0.6, 0.74); park(p, foot, yaw); p.position.y += 0.2 * (1 - easeIn(v)); p.rotation.x = 0.32; p.scale.set(1.06, 0.92, 1.06); face(p, { ly: -0.6, open: 1.3, pupil: 0.6, mouth: "o", noBlink: true }); }
      else if (c < 0.9) { const v = seg(c, 0.74, 0.8), t2 = (c - 0.8) * D; park(p, foot.clone().addScaledVector(dir, -0.1 * easeOut(v)), yaw); p.rotation.x = 0.32 - 1.77 * easeOut(v); face(p, { lx: cos(now() * 9), ly: sin(now() * 9), mouth: "o", noBlink: true }); if (t2 > 0) { settle(p, t2, 0.8); orbitStars(p.position.clone().addScaledVector(dir, -0.3), 0.14, 0.13); FX.dust(p.position, t2, { count: 8, size: 0.14, seed: 12 }); } }
      else { const v = easeOut(seg(c, 0.9, 0.97)); park(p, foot.clone().addScaledVector(dir, -0.1), lerpAngle(yaw, camYaw(b), v)); p.rotation.x = -1.45 * (1 - v); face(p, { open: 0.6, mouth: "sad", ly: -0.5 }); }
      FX.text(locKey("¡Ñiii!"), "#ffffff", up(W, 0.75), (c - 0.6) * D, { life: 0.8, size: 0.5, tilt: 0.2 });
      FX.text(locKey("¡Ay!"), "#ff8fd0", up(foot, 0.8), (c - 0.76) * D, { life: 1, size: 0.65 });
      for (const q of x.team) if (q !== p) face(q, { ...lookAt(q, up(p.position, 0.3)), mouth: c > 0.76 ? "o" : "smile" });

    },
    telarana(x, c) {
      const { D, J, col, seat } = x, ctr = baseCenter(seat), fails = [[0.03, 2], [0.19, 4], [0.35, 1]];
      const six = c >= 0.8;
      let cur = -1;
      fails.forEach(([tm], k) => { if (c >= tm) cur = k; FX.text(`${k + 1}…`, "#c9c3d6", up(ctr, 1.1), (c - tm - 0.08) * D, { life: 0.9, size: 0.6 }); cue("sad", tm + 0.09); });
      if (!six && cur >= 0) failRoll(x, c, fails[cur][0], fails[cur][0] + 0.07, fails[cur][1]);
      const grow = smooth(seg(c, 0.44, 0.76)), gone = six ? easeOut(seg(c, 0.84, 0.92)) : 0;
      if (grow > 0 && gone < 1) {
        const size = (me === 4 ? 2.05 : 1.7) * (0.25 + 0.75 * grow) * (1 + gone * 0.9);
        web.visible = true; web.position.copy(ctr).setY(0.5 + gone * 0.5); web.rotation.set(0, 0.3, 0); web.scale.set(size, 1, size); webMat.opacity = 0.9 * Math.min(1, grow * 2) * (1 - gone);
        const drop = smooth(seg(c, 0.58, 0.72)), sp = new V3(ctr.x + 0.25, 2.2 - 1.45 * drop + sin(now() * 2.2) * 0.05 + gone * 3, ctr.z - 0.1);
        show(spider, sp, camYaw(sp), 1, 0.3); rod(0, sp.clone().setY(3.2), sp, 0.003, "#ffffff");
      }
      cue("stretch", 0.46); cue("stretch", 0.6);
      if (six) {
        const v = seg(c, 0.8, 0.86), t2 = (c - 0.86) * D;
        setDie(6); if (v < 1) { die.position.y = 0.15 + arc(v) * 0.7; dieSpin.quaternion.premultiply(new THREE.Quaternion().setFromEuler(new THREE.Euler((1 - v) * PI * 4, (1 - v) * PI * 2, 0))); }
        cue("clack", 0.86); cue("tada", 0.87); cue("whoosh", 0.86);
        FX.badge(6, col, new V3(xe.dieX, 0.75, 0), t2, { hold: true, size: 0.45 });
        FX.text(locKey("¡SEIS!"), "#ffd23f", up(ctr, 1.3), t2, { hold: true, size: 1 });
        FX.confetti(up(ctr, 0.4), t2, { count: 60, power: 0.9, seed: 5 }); FX.dust(up(ctr, 0.3), t2, { count: 14, size: 0.2, spread: 0.8, seed: 8 });
      }
      eachHome(x, (p, k, b) => {
        const dusty = grow * (1 - gone);
        tint(p, "#9a94a3", 0.65 * dusty);
        if (six && c > 0.86) { const h = ((c - 0.86) * D * 2.4 + k * 0.27) % 1; p.position.y += arc(h) * 0.16 * J; face(p, { open: 1.2, mouth: "o", noBlink: true }); }
        else { p.scale.set(1 + 0.04 * dusty, 1 - 0.1 * dusty, 1 + 0.04 * dusty); p.rotation.x = 0.16 * dusty; face(p, c > 0.44 ? { open: 1 - 0.6 * dusty, ly: -0.5, mouth: "sad" } : lookAt(p, die.position)); }
      });
      FX.text(locKey("…cuánto tiempo aquí"), "#c9c3d6", up(ctr, 1.3), (c - 0.6) * D, { life: 1.5, size: 0.6 });

    },
    reclamo(x, c) {
      const { D, J, mover: p, seat, piece } = x, b = cell(seat, -1, piece), rest = new V3(xe.dieX, 0.15, 0), yawD = yawTo(b, rest);
      failRoll(x, c);
      x.busy.add(p);
      cue("rumble", 0.3); [0.42, 0.5, 0.58, 0.66].forEach((tm) => cue("bonk", tm));
      const turn = smooth(seg(c, 0.18, 0.3)), rage = smooth(seg(c, 0.3, 0.4)) * (1 - smooth(seg(c, 0.84, 0.95))), t2 = (c - 0.36) * D;
      park(p, b, lerpAngle(camYaw(b), yawD, turn));
      p.position.addScaledVector(dirTo(b, rest), 0.1 * rage);
      p.position.y += abs(sin(t2 * 8)) * 0.05 * J * rage;
      p.rotation.x = 0.18 * rage;
      tint(p, "#ff3b30", 0.45 * rage * (0.7 + 0.3 * sin(now() * 12)));
      face(p, rage > 0.2 ? { ...lookAt(p, die.position), open: 0.5, pupil: 0.7, mouth: "o", mouthSize: 1.5 + 0.5 * sin(now() * 20), noBlink: true } : lookAt(p, die.position));
      if (rage > 0.05) {
        const shake = sin(t2 * 16) * 0.07;
        hand(0, onPawn(p, 0.15, 0.47 + shake, 0.08), colorOf(p), 1.25 * rage);
        steam(p.position, t2, 4);
        die.position.x += 0.06 * rage + sin(now() * 60) * 0.004 * rage; die.rotation.z = -0.18 * rage; die.scale.setScalar(1 - 0.12 * rage);
      }
      FX.text(locKey("¡#@%&!"), "#ff5a3c", up(b, 1), (c - 0.38) * D, { life: 1.4, size: 0.8, tilt: 0.12 });
      FX.text(locKey("¡Dame un seis!"), "#ffffff", up(b, 0.95), (c - 0.62) * D, { life: 1.2, size: 0.6 });
      FX.text(locKey("glup"), "#a9c1ff", up(rest, 0.75), (c - 0.5) * D, { life: 1, size: 0.4 });
      for (const q of x.team) if (q !== p) face(q, { ...lookAt(q, up(p.position, 0.3)), open: 1.15, mouth: rage > 0.3 ? "o" : "smile" });

    },

    
    soplido(x, c) {
      const { D, J, col, steps } = x, A = ctx.dieStart.clone().setY(-0.065), yaw = yawTo(A, DIE_MID), f = fwdOf(yaw);
      const hold = A.clone().addScaledVector(f, 0.36).setY(0.56), blows = [0.12, 0.22, 0.32];
      const blow = blows.reduce((mx, tm) => Math.max(mx, pulse(c, tm, tm + 0.08)), 0), wind = smooth(seg(c, 0.42, 0.5)), fling = c >= 0.5 ? Math.exp(-(c - 0.5) * D * 5) : 0;
      blows.forEach((tm) => cue("blow", tm)); cue("whoosh", 0.5); cue("clack", 0.72); cue("clack", 0.8); cue("pop", 0.86); steps === 6 && cue("tada", 0.88); steps === 1 && cue("sad", 0.88);
      show(avatar, A, yaw, 1, (0.2 * blow - 0.22 * wind + 0.45 * fling) * J);
      avatar.scale.set(1 + 0.07 * blow, 1 - 0.05 * blow + 0.05 * wind, 1 + 0.07 * blow);
      if (c < 0.5) {
        die.position.copy(hold); die.position.y += sin(now() * 3) * 0.012 + 0.14 * wind; die.position.addScaledVector(f, -0.12 * wind); die.scale.setScalar(0.8);
        dieSpin.quaternion.setFromEuler(new THREE.Euler(0.4, now() * 1.2, 0.3));
        const mouth = A.clone().addScaledVector(f, 0.2).setY(0.53);
        if (blow > 0.2) for (let k = 0; k < 4; k++) { const v = (now() * 2.5 + k / 4) % 1; FX.puff(mouth.clone().lerp(up(hold, 0.05), v).add(new V3(0, sin(v * PI) * 0.03, 0)), 0.04 + v * 0.05, (1 - v) * 0.7); }
        if (c > 0.14) for (let k = 0; k < 3; k++) { const ang = now() * 3 + k * 2.1; FX.star(hold.clone().add(new V3(cos(ang) * 0.3, 0.1 + sin(ang * 1.7) * 0.15, sin(ang) * 0.3)), 0.07, ang, 0.9, "#fff36b"); }
        blows.forEach((tm, k) => FX.text(locKey("fuuu"), "#bfefff", up(hold, 0.45 + k * 0.05), (c - tm) * D, { life: 0.6, size: 0.4, tilt: 0.1 }));
        FX.text(locKey("¡Suerte!"), "#fff36b", up(hold, 0.75), (c - 0.4) * D, { life: 0.8, size: 0.55 });
      } else {
        const from = hold.clone().setY(hold.y + 0.14), v = seg(c, 0.5, 0.72);
        if (v < 1) { die.position.copy(from).lerp(DIE_MID, v); die.position.y += arc(v) * (0.9 * J + 0.2); }
        else { die.position.copy(DIE_MID); const b1 = seg(c, 0.72, 0.8), b2 = seg(c, 0.8, 0.85); die.position.y += b1 < 1 ? arc(b1) * 0.25 * J : arc(b2) * 0.08 * J; if (c > 0.85) dieWobble((c - 0.85) * D, J); }
        tumble(steps, seg(c, 0.5, 0.85));
        FX.dust(DIE_MID.clone().setY(0.17), (c - 0.72) * D, { count: 10, size: 0.2, spread: 0.45, seed: 2 });
        const t2 = (c - 0.86) * D;
        FX.badge(steps, col, up(DIE_MID, 0.66), t2, { hold: true, size: 0.5 });
        if (t2 >= 0 && steps === 6) { FX.text(locKey("¡SEIS!"), "#ffd23f", up(DIE_MID, 1.12), t2 - 0.08, { life: 1.8, size: 0.95 }); FX.confetti(up(DIE_MID, 0.3), t2, { count: 60, power: 0.9, seed: 3 }); }
      }
      watchAll(die.position, { mouth: c > 0.5 && c < 0.86 ? "o" : "smile" });

    },
    dadomareado(x, c) {
      const { D, J, col, steps } = x, S = DIE_START(), L = ctx.dieLanding.clone(), tL = 0.3, tS = 0.82;
      cue("whoosh", 0.02); cue("clack", tL); [0.4, 0.5, 0.58, 0.65, 0.7, 0.74, 0.77].forEach((tm) => cue("tap", tm)); cue("pop", 0.88);
      const v = seg(c, 0, tL);
      if (v < 1) { die.position.copy(S).lerp(L, v); die.position.y = MathLerp(S.y, L.y, v) + arc(v) * 0.22; tumble(steps, v * 0.55, 0.35); }
      else {
        die.position.copy(L); setDie(steps);
        const t2 = (c - tL) * D, w = seg(c, tL, tS), amp = 0.5 * Math.pow(1 - w, 1.4) * (0.6 + 0.4 * J), ph = t2 * 5 + t2 * t2 * 3.5;
        die.rotation.set(amp * cos(ph), ph * 0.25 * (1 - w), amp * sin(ph));
        die.position.y += 0.215 * abs(sin(amp)) * 1.1;
        if (c > tS) { const t3 = (c - tS) * D; die.rotation.set(0, 0, sin(t3 * 3) * 0.1 * J); orbitStars(L, 0.42, 0.25, 4); FX.text(locKey("ay…"), "#a9c1ff", up(L, 0.95), t3 - 0.1, { life: 1.2, size: 0.45, tilt: 0.2 }); }
      }
      FX.text(locKey("pfff"), "#c9c3d6", up(S, 0.2), (c - 0.03) * D, { life: 0.8, size: 0.5 });
      FX.badge(steps, col, up(L, 0.7), (c - 0.88) * D, { hold: true, size: 0.5 });
      const sway = c > tL && c < tS ? sin((c - tL) * D * 5) * 0.14 * J : 0;
      for (const p of pawns) { p.rotation.z = sway; face(p, { ...lookAt(p, die.position), mouth: c > tL && c < tS ? "o" : "smile", pupil: c > tS ? 1 : 0.8 }); }

    },
    rebote(x, c) {
      const { D, J, col, steps, rival: rv, rivalSeat } = x, S = DIE_START(), Rp = rv.position.clone(), head = up(Rp, 0.42), tH = 0.2;
      x.busy.add(rv);
      cue("whoosh", 0.02); cue("bonk", tH); cue("clack", 0.6); cue("clack", 0.7); cue("pop", 0.82); steps === 6 && cue("tada", 0.84);
      if (c < tH) { const v = c / tH; die.position.copy(S).lerp(head, v); die.position.y += arc(v) * 0.15; dieSpin.quaternion.setFromEuler(new THREE.Euler(v * 22, v * 15, v * 9)); for (let k = 1; k <= 5; k++) { const w = v - k * 0.06; w > 0 && FX.puff(S.clone().lerp(head, w), 0.12 - k * 0.015, 0.5 - k * 0.08); } }
      else if (c < 0.6) { const v = seg(c, tH, 0.6); die.position.copy(head).lerp(DIE_MID, v); die.position.y += arc(v) * (1.5 * J + 0.3); tumble(steps, v * 0.8); }
      else { die.position.copy(DIE_MID); const b1 = seg(c, 0.6, 0.7), b2 = seg(c, 0.7, 0.76); die.position.y += b1 < 1 ? arc(b1) * 0.3 * J : arc(b2) * 0.1 * J; tumble(steps, 0.8 + 0.2 * seg(c, 0.6, 0.76)); if (c > 0.76) dieWobble((c - 0.76) * D, J); }
      const tHit = (c - tH) * D;
      park(rv, Rp, camYaw(Rp));
      if (c < tH) face(rv, c > 0.1 ? { ...lookAt(rv, die.position), open: 1.4, pupil: 0.5, mouth: "o", noBlink: true } : {});
      else if (c < 0.46) { const sq2 = 0.5 * Math.exp(-tHit * 6) * abs(cos(tHit * 14)); squash(rv, sq2); rv.rotation.y += PI * 4 * easeOut(seg(c, tH, 0.4)); rv.rotation.z = sin(tHit * 9) * 0.2; face(rv, { lx: cos(now() * 9), ly: sin(now() * 9), mouth: "o", noBlink: true }); orbitStars(Rp); }
      else {
        const mad = smooth(seg(c, 0.46, 0.56)), t2 = (c - 0.5) * D;
        rv.rotation.y = lerpAngle(camYaw(Rp), yawTo(Rp, DIE_MID), mad); rv.position.y += abs(sin(t2 * 9)) * 0.05 * J * mad; rv.rotation.x = 0.15 * mad;
        tint(rv, "#ff3b30", 0.4 * mad); face(rv, { ...lookAt(rv, die.position), open: 0.5, pupil: 0.75, mouth: "flat", noBlink: true }); steam(Rp, t2, 4);
        FX.text(locKey("¡Oye!"), "#ff5a3c", up(Rp, 0.95), t2, { life: 1.1, size: 0.75 }); FX.text(locKey("¡Fíjate!"), "#ffffff", up(Rp, 0.9), t2 - 1.1, { life: 1.2, size: 0.55 });
      }
      if (c >= tH) { bump.parent !== rv && rv.add(bump); bump.visible = true; bump.position.set(0.05, 0.4, 0.03); bump.scale.setScalar(0.4 + 0.6 * elastic(tHit / 0.6)); }
      if (tHit >= 0) { FX.text(locKey("¡POC!"), "#ffd23f", up(Rp, 1.05), tHit, { life: 0.9, size: 0.9 }); FX.burst(head, tHit, { count: 10, radius: 0.6 }); tHit < 0.5 && (Re += 0.08 * J * Math.exp(-tHit * 9)); }
      FX.dust(DIE_MID.clone().setY(0.17), (c - 0.6) * D, { count: 10, size: 0.2, spread: 0.45, seed: 6 });
      FX.badge(steps, col, up(DIE_MID, 0.66), (c - 0.82) * D, { hold: true, size: 0.5 });
      for (const p of x.team) face(p, c > 0.3 && c < 0.8 ? { lx: -0.9, ly: 0.6, open: 0.8, mouth: "o", mouthSize: 0.6 } : lookAt(p, die.position));
      FX.text(locKey("ups…"), "#ffffff", up(baseCenter(x.seat), 1), (c - 0.34) * D, { life: 1.2, size: 0.5 });

    },
    tercerseis(x, c) {
      const { D, J, col, seat } = x, S = DIE_START(), rest = new V3(xe.dieX, 0.15, 0), edge = new V3(xe.radius - 0.25, 0.375, 0), tR = 0.26, tC = 0.38, tW = 0.56;
      cue("whoosh", 0.01); cue("clack", 0.18); cue("clack", tR - 0.02); cue("pop", tR); cue("tada", tR + 0.01); cue("sad", tC); cue("rumble", tC + 0.06); cue("zap", tC + 0.12); [0.62, 0.7, 0.78, 0.86].forEach((tm) => cue("land", tm)); cue("plop", 0.93);
      let pos;
      if (c < 0.18) { const v = c / 0.18; pos = S.clone().lerp(DIE_MID, v); pos.y += arc(v) * 0.9; }
      else if (c < tW) { pos = DIE_MID.clone(); pos.y += arc(seg(c, 0.18, tR)) * 0.2 * (c < tR ? 1 : 0); }
      else {
        const v = seg(c, tW, 0.95), hops = 5, k = Math.min(hops - 1, Math.floor(v * hops)), fr = v * hops - k, pts = [DIE_MID, DIE_MID.clone().lerp(edge, 0.33), DIE_MID.clone().lerp(edge, 0.66), edge, new V3(xe.radius - 0.03, 0.375, 0), rest];
        pos = pts[k].clone().lerp(pts[k + 1], easeIO(fr)); pos.y = MathLerp(pts[k].y, pts[k + 1].y, k === hops - 1 ? easeIn(fr) : fr) + arc(fr) * 0.1;
        die.rotation.set(0, 0, -0.22 * J - 0.08 * sin(fr * PI));
      }
      die.position.copy(pos); tumble(6, seg(c, 0, tR));
      const sad = smooth(seg(c, tC, tC + 0.1));
      die.scale.set(1 + 0.08 * sad, 1 - 0.14 * sad, 1 + 0.08 * sad); die.position.y -= 0.03 * sad;
      
      [0, 1, 2].forEach((k) => FX.badge(6, k === 2 && c > tC ? "#ff3b30" : col, new V3(-0.35 + k * 0.35, 1.35, 0.1), k < 2 ? (c + 0.01) * D : (c - tR) * D, { hold: true, size: 0.34 }));
      FX.text(locKey("¡SEIS!"), "#ffd23f", up(DIE_MID, 0.95), (c - tR) * D, { life: (tC - tR) * D, size: 0.9 });
      FX.text(locKey("¡Tercer seis!"), "#ff5a3c", new V3(0, 1.85, 0.1), (c - tC) * D, { hold: true, size: 0.95 });
      FX.text(locKey("Pierdes el turno"), "#c9c3d6", new V3(0, 0.95, 0.9), (c - tC - 0.1) * D, { hold: true, size: 0.6 });
      if (c > tC) {
        const t2 = (c - tC) * D, cp = up(die.position, 0.85);
        cloud.visible = true; cloud.position.copy(cp); cloud.scale.setScalar(0.55 * Math.max(0.01, elastic(t2 / 0.5)));
        for (let k = 0; k < 12; k++) { const h = t2 * 1.6 + rnd(k); if (h < 1) continue; const v = h % 1; FX.puff(cp.clone().add(new V3((rnd(k * 3.1) - 0.5) * 0.45, -0.1 - v * 0.62, (rnd(k * 7.3) - 0.5) * 0.45)), 0.04, 0.85, "#6ec3ff"); }
        const fl = (c - tC - 0.12) * D; if (fl > 0 && fl < 0.25) hemi.intensity = 2.5 + 4 * Math.exp(-fl * 10);
      }
      for (const p of pawns) { const mine = p.userData.seat === seat; if (mine) x.busy.add(p); if (mine && c > tC) { const k = smooth(seg(c, tC, tC + 0.1)); p.scale.set(1 + 0.04 * k, 1 - 0.08 * k, 1 + 0.04 * k); p.rotation.x = 0.18 * k; face(p, { ly: -0.9, open: 0.55, mouth: "sad" }); } else if (mine && c > tR) { const h = ((c - tR) * D * 2.4 + p.userData.piece * 0.27) % 1; p.position.y += arc(h) * 0.16 * J; face(p, { open: 1.1, mouth: "o", noBlink: true }); } else face(p, { ...lookAt(p, die.position), mouth: !mine && c > tC ? "o" : "smile", mouthSize: !mine && c > tC ? 1.4 : 1 }); }

    },

    
    canon(x, c) {
      const { D, J, mover: p, seat, piece, col } = x, b = cell(seat, -1, piece), T2 = cell(seat, 0), yaw = yawTo(b, T2), dir = dirTo(b, T2), tB = 0.46, tL = 0.76;
      x.busy.add(p);
      cue("pop", 0.03); cue("hop", 0.1); cue("fuse", 0.26); cue("pum", tB); cue("land", tL); cue("pop", tL + 0.02);
      const tb = (c - tB) * D, recoil = tb > 0 ? 0.12 * Math.exp(-tb * 6) : 0, shake = c > 0.26 && c < tB ? sin(now() * 60) * 0.006 * seg(c, 0.26, tB) : 0;
      const cs = backOut(seg(c, 0.02, 0.1)) * (1 - smooth(seg(c, 0.84, 0.94)));
      show(cannon, b.clone().addScaledVector(dir, -recoil).setY(0.165).add(new V3(shake, 0, shake)), yaw, cs);
      const tube = cannon.userData.tube; tube.scale.set(1, 1, 1);
      if (c > 0.26 && c < tB) { const k = seg(c, 0.26, tB); tube.scale.set(1 + 0.12 * k, 1 - 0.14 * k, 1 + 0.12 * k); }
      else if (tb > 0) { const k = Math.exp(-tb * 7) * cos(tb * 22); tube.scale.set(1 - 0.1 * k, 1 + 0.25 * k, 1 - 0.1 * k); }
      cannon.updateMatrixWorld(true);
      const muzzle = tube.localToWorld(new V3(0, 0.3, 0)), breech = tube.localToWorld(new V3(0, -0.2, 0));
      if (c < 0.1) { park(p, b, yaw); p.position.y += 0.5 * easeOut(c / 0.1); face(p, { open: 1.2, mouth: "o", noBlink: true }); }
      else if (c < 0.24) { const v = seg(c, 0.1, 0.24); p.position.copy(up(b, 0.5)).lerp(muzzle, easeIO(Math.min(1, v * 1.6))); p.position.y += arc(Math.min(1, v * 1.6)) * 0.1; p.rotation.set(0, yaw, 0); p.scale.setScalar(Math.max(0.01, 1 - 0.75 * easeIn(seg(v, 0.5, 1)))); face(p, { open: 1.2, mouth: "o", noBlink: true }); }
      else if (c < tB) { p.visible = false; for (let k = 0; k < 3; k++) FX.star(breech.clone().add(new V3((rnd(k + Math.floor(now() * 20)) - 0.5) * 0.08, 0.05 + rnd(k * 3 + Math.floor(now() * 20)) * 0.08, 0)), 0.06, now() * 9 + k, 1, k % 2 ? "#ffd23f" : "#ff8a3d"); }
      else if (c < tL) { const v = seg(c, tB, tL), at = muzzle.clone().lerp(T2, v); at.y += arc(v) * (1.2 * J + 0.3); p.position.copy(at); p.rotation.set(PI * 4 * v, yaw, 0); p.scale.setScalar(0.6 + 0.4 * easeOut(v)); face(p, { open: 1.4, size: 1.15, pupil: 0.5, mouth: "o", noBlink: true }); for (let k = 1; k <= 6; k++) { const w = v - k * 0.03; if (w > 0) { const q = muzzle.clone().lerp(T2, w); q.y += arc(w) * (1.2 * J + 0.3) + 0.2; FX.puff(q, 0.12 - k * 0.012, 0.5 - k * 0.07); } } }
      else { const t2 = (c - tL) * D; park(p, T2, yaw); settle(p, t2, 2.2); face(p, { open: t2 < 0.25 ? 0.35 : 1, noBlink: t2 < 0.25 }); FX.dust(T2, t2, { count: 12, size: 0.2, spread: 0.45, seed: 9 }); FX.ring(T2, t2, col); flash(T2, t2, col); FX.text(locKey("¡Salgo!"), col, up(T2, 0.95), t2, { life: 1.3, size: 0.8 }); t2 < 0.5 && (Re += 0.05 * J * Math.exp(-t2 * 10)); }
      if (tb >= 0) { FX.text(locKey("¡PUM!"), "#ff5a3c", up(muzzle, 0.6), tb, { life: 1, size: 1 }); FX.dust(muzzle, tb, { count: 14, size: 0.26, spread: 0.55, life: 0.8, color: "#d9d2dc", seed: 14 }); FX.burst(muzzle, tb, { count: 12, radius: 0.7, color: "#ffb347" }); tb < 0.6 && (Re += 0.12 * J * Math.exp(-tb * 8)); }
      for (const q of x.team) if (q !== p) { const k = c > 0.26 && c < tB + 0.04 ? 1 : 0; q.rotation.x = -0.2 * k; face(q, k ? { open: 0.1, mouth: "flat", noBlink: true } : { ...lookAt(q, up(p.position, 0.3)), mouth: c > tB ? "o" : "smile" }); }

    },
    tropezon(x, c) {
      const { D, J, mover: p, seat, piece, col } = x, b = cell(seat, -1, piece), T2 = cell(seat, 0), yaw = yawTo(b, T2), dir = dirTo(b, T2), E = b.clone().lerp(T2, 0.5), F = E.clone().addScaledVector(dir, 0.14);
      x.busy.add(p);
      cue("hop", 0.1); cue("slip", 0.24); cue("bonk", 0.33); cue("boing", 0.47); cue("hop", 0.7); cue("land", 0.84);
      if (c < 0.1) { park(p, b, yaw); squash(p, smooth(c / 0.1) * 0.3); face(p, { open: 0.4, noBlink: true }); }
      else if (c < 0.24) { hopArc(p, b, E, seg(c, 0.1, 0.24), 0.28 * J + 0.05); p.rotation.set(0, yaw, 0); face(p, { open: 0.3, noBlink: true }); }
      else if (c < 0.34) { const v = seg(c, 0.24, 0.34); p.position.copy(E).lerp(F, easeOut(v)); p.rotation.set(1.5 * easeIn(v), yaw, 0); face(p, { open: 1.4, size: 1.2, pupil: 0.5, mouth: "o", noBlink: true }); }
      else if (c < 0.46) { const t2 = (c - 0.34) * D; park(p, F, yaw); p.rotation.x = 1.5; settle(p, t2, 0.8); orbitStars(F.clone().addScaledVector(dir, 0.3), 0.14, 0.13); FX.dust(F.clone().addScaledVector(dir, 0.2), t2, { count: 9, size: 0.15, seed: 15 }); }
      else if (c < 0.52) { const v = seg(c, 0.46, 0.52); park(p, F, yaw); p.position.y += arc(v) * 0.2; p.rotation.x = 1.5 * (1 - easeOut(v)); face(p, { open: 1.3, pupil: 0.6, mouth: "flat", noBlink: true }); }
      else if (c < 0.7) { const v = seg(c, 0.52, 0.7); park(p, F, yaw + sin(v * PI * 2) * 0.5); face(p, { lx: sin(v * PI * 2) * 1, open: 0.8, mouth: "o", mouthSize: 0.55, noBlink: true }); FX.text(locKey("la-la"), "#ffffff", onPawn(p, 0.1, 0.5 + v * 0.2, 0.1), (c - 0.56) * D, { life: 0.9, size: 0.4, tilt: 0.2 }); }
      else if (c < 0.84) { hopArc(p, F, T2, seg(c, 0.7, 0.84), 0.2 * J + 0.05); p.rotation.set(0, yaw, 0); face(p, { open: 0.4, noBlink: true }); }
      else { const t2 = (c - 0.84) * D; park(p, T2, yaw); settle(p, t2); p.rotation.z = 0.14 * smooth(t2 / 0.3); face(p, { open: 0.35, lx: 0.4, noBlink: true }); FX.dust(T2, t2, { count: 8, size: 0.14, seed: 16 }); flash(T2, t2, col); FX.text(locKey("Aquí no pasó nada"), "#ffffff", up(T2, 0.95), t2 - 0.1, { hold: true, size: 0.55 }); }
      FX.text(locKey("¡Ups!"), "#ff8fd0", up(F, 0.75), (c - 0.3) * D, { life: 0.9, size: 0.7 });
      for (const q of x.team) if (q !== p) { const lol = c > 0.34 && c < 0.5, k = q.userData.piece; if (lol) { q.position.y += abs(sin((c - 0.34) * D * 12 + k)) * 0.04 * J; face(q, { open: 0.25, mouth: "o", mouthSize: 1.3, noBlink: true }); FX.text(locKey("jiji"), "#ffffff", up(q.position, 0.75), (c - 0.36 - k * 0.02) * D, { life: 0.7, size: 0.35, tilt: 0.15 }); } else if (c >= 0.5 && c < 0.72) face(q, { lx: -0.9, ly: 0.7, mouth: "o", mouthSize: 0.5 }); else face(q, lookAt(q, up(p.position, 0.3))); }

    },
    despedida(x, c) {
      const { D, J, mover: p, seat, piece, col } = x, b = cell(seat, -1, piece), T2 = cell(seat, 0), yaw = yawTo(b, T2), words = [locKey("¡Adiós!"), locKey("¡Cuídate!"), locKey("snif"), locKey("¡Escribe!")];
      x.busy.add(p);
      cue("boing", 0.16); cue("land", 0.4); cue("pop", 0.42); cue("spit", 0.66);
      if (c < 0.16) { park(p, b, yaw); squash(p, smooth(c / 0.16) * 0.3 * J); face(p, { open: 0.5, mouth: "flat", noBlink: true }); }
      else if (c < 0.4) { const v = seg(c, 0.16, 0.4); hopArc(p, b, T2, v, 0.5 * J + 0.1); p.rotation.set(0, yaw + PI * 2 * easeOut(v), 0); face(p, { open: 1.2, mouth: "o", noBlink: true }); }
      else { const t2 = (c - 0.4) * D, back = smooth(seg(c, 0.46, 0.56)) * (1 - smooth(seg(c, 0.84, 0.94))); park(p, T2, lerpAngle(yaw, yawTo(T2, b), back)); settle(p, t2, 1.8); p.position.y += abs(sin(t2 * 7)) * 0.05 * J * back; face(p, back > 0.5 ? { open: 0.35, noBlink: true } : { open: 1 }); FX.dust(T2, t2, { count: 10, size: 0.18, seed: 9 }); FX.ring(T2, t2, col); flash(T2, t2, col); if (back > 0.3) show(hankies[3], onPawn(p, 0.13, 0.5, 0.03), p.rotation.y, 1, 0, sin(now() * 11) * 0.7); FX.text(locKey("¡Ya vuelvo!"), col, up(T2, 1), (c - 0.5) * D, { life: 1.3, size: 0.7 }); }
      let idx = 0;
      for (const q of x.team) if (q !== p) {
        const k = idx++, qb = q.position.clone(), wave = smooth(seg(c, 0.22 + k * 0.04, 0.34 + k * 0.04));
        x.busy.add(q); q.rotation.y = lerpAngle(camYaw(qb), yawTo(qb, p.position), wave);
        const blowNose = k === 2 && c > 0.62 && c < 0.74;
        q.position.y += abs(sin(now() * 5 + k)) * 0.03 * wave * J;
        face(q, blowNose ? { open: 0.1, mouth: "flat", noBlink: true } : { ...lookAt(q, up(p.position, 0.3)), open: 1.15, size: 1.1, mouth: k === 2 ? "sad" : "o", mouthSize: 0.8 });
        if (wave > 0.05) { const hp = blowNose ? onPawn(q, 0, 0.33, 0.13) : onPawn(q, 0.13, 0.5 + 0.03 * sin(now() * 9 + k), 0.03); show(hankies[k], hp, q.rotation.y, wave, 0, blowNose ? 0 : sin(now() * 9 + k * 2) * 0.75); }
        if (wave > 0.5) for (const sx of [-1, 1]) { const v = (now() * 1.1 + k * 0.3 + (sx > 0 ? 0.5 : 0)) % 1; FX.puff(onPawn(q, sx * 0.06, 0.3 - v * 0.2, 0.11), 0.03, 0.9 * (1 - v), "#6ec3ff"); }
        FX.text(words[k], "#ffffff", up(qb, 0.85), (c - 0.3 - k * 0.1) * D, { life: 1.1, size: 0.45, tilt: k % 2 ? 0.12 : -0.12 });
      }

    },

    
    patineta(x, c) {
      const { D, J, mover: p, seat, col } = x, N = Math.max(3, x.steps), path = cells(seat, 10, N), d0 = dirTo(path[0], path[1]);
      x.busy.add(p);
      cue("pop", 0.03); cue("whoosh", 0.12); [0.2, 0.32, 0.44, 0.56].forEach((tm) => cue("chug", tm)); cue("boing", 0.7); cue("clack", 0.88); cue("tada", 0.9);
      let w, lift = 0, flip = 0, pawnLift = 0;
      if (c < 0.12) w = 0; else if (c < 0.7) w = (N - 1) * smooth(seg(c, 0.12, 0.7)); else { const v = seg(c, 0.7, 0.88); w = N - 1 + easeOut(v); lift = arc(v) * 0.22 * J; pawnLift = arc(v) * 0.5 * J; flip = PI * 2 * smooth(v); }
      const at = pathAt(path, w), yaw = pathYaw(path, Math.min(w, N - 0.01));
      const slide = c < 0.1 ? 1 - easeOut(c / 0.1) : 0, away = c > 0.92 ? easeIn(seg(c, 0.92, 1)) : 0;
      const bp = at.clone().addScaledVector(d0, -0.6 * slide).addScaledVector(fwdOf(yaw), 0.7 * away).setY(0.2 + lift);
      show(skate, bp, yaw, 1 - away, 0, flip);
      const push = c > 0.12 && c < 0.4 ? abs(sin((c - 0.12) * D * 6)) : 0;
      park(p, at, yaw + (c > 0.12 && c < 0.9 ? 0.5 : 0));
      p.position.y += (c < 0.1 ? arc(seg(c, 0.04, 0.1)) * 0.2 + 0.035 * seg(c, 0.04, 0.1) : c < 0.92 ? 0.035 : 0.035 * (1 - away)) + pawnLift;
      p.rotation.z = c < 0.7 ? sin(now() * 3) * 0.1 * J : 0; p.rotation.x = -0.12 * push;
      squash(p, c > 0.88 ? 0.3 * Math.exp(-(c - 0.88) * D * 7) * cos((c - 0.88) * D * 20) : 0.1 * push);
      face(p, c > 0.7 && c < 0.88 ? { open: 1.3, mouth: "o", noBlink: true } : c > 0.88 ? { open: 0.3, noBlink: true } : { open: 0.9, ly: -0.1 });
      if (c > 0.14 && c < 0.7) for (let k = 1; k <= 4; k++) FX.puff(pathAt(path, w - k * 0.22).setY(0.2), 0.08 - k * 0.012, 0.45 - k * 0.09);
      const kc = Math.floor(w); kc > 0 && flash(path[kc], (w - kc) * 0.5, col);
      FX.text(locKey("¡Kickflip!"), "#ffd23f", up(path[N], 1.05), (c - 0.76) * D, { life: 1.4, size: 0.85 });
      FX.burst(up(path[N], 0.25), (c - 0.88) * D, { count: 8, radius: 0.4, color: "#ffffff" });

    },
    tren(x, c) {
      const { D, J, mover: p, seat, col } = x, N = 6, path = cells(seat, 8, N), t0 = 0.12, t1 = 0.86;
      x.busy.add(p);
      cue("pop", 0.02); cue("choo", 0.05); cue("choo", 0.5); for (let k = 0; k < 12; k++) cue("chug", t0 + ((t1 - t0) * (k + 0.5)) / 12); cue("spit", t1);
      const w = N * smooth(seg(c, t0, t1)), at = pathAt(path, w), yaw = pathYaw(path, Math.min(w, N - 0.01)), moving = c > t0 && c < t1;
      park(p, at, yaw);
      const chug = moving ? sin(w * PI * 4) : 0, tb = (c - t1) * D;
      p.position.y += moving ? abs(sin(w * PI * 2)) * 0.02 : 0;
      p.scale.set(1 + 0.05 * chug, 1 - 0.05 * chug, 1 + 0.05 * chug);
      p.rotation.x = c < t0 ? -0.2 * pulse(c, 0.04, t0) * J : tb > 0 ? -0.3 * J * Math.exp(-tb * 5) : 0.08;
      face(p, c < t0 ? { open: 1.2, mouth: "o", mouthSize: 1.4, noBlink: true } : moving ? { open: 0.8, ly: -0.1, mouth: "o", mouthSize: 0.7 + 0.3 * abs(chug) } : { open: tb < 0.3 ? 0.35 : 1 });
      const top = onPawn(p, 0, 0.405, 0);
      show(chimney, top, yaw, elastic(seg(c, 0.01, 0.1)) * (1 - smooth(seg(c, 0.93, 1))), p.rotation.x);
      const back = fwdOf(yaw).multiplyScalar(-1), mouthTop = up(top, 0.11);
      for (let k = 0; k < 6; k++) { const v = (now() * 1.6 + k / 6) % 1; FX.puff(mouthTop.clone().addScaledVector(back, v * (moving ? 0.35 : 0.05)).add(new V3(0, v * 0.38, 0)), 0.05 + v * 0.11, (1 - v) * 0.75); }
      for (let k = 1; k <= N; k++) { const tk = t0 + (t1 - t0) * (k / N), tt = (c - tk) * D * 0.8; flash(path[k], tt, col); FX.text(String(k), col, up(path[k], 0.72), tt, { life: 0.5, size: 0.42, tilt: 0 }); }
      FX.text(locKey("¡Chu-chu!"), "#ffffff", up(path[0], 1.05), (c - 0.05) * D, { life: 1.1, size: 0.8 });
      FX.text(locKey("¡Chu-chu!"), "#ffffff", up(at, 1.05), (c - 0.5) * D, { life: 0.9, size: 0.6 });
      if (tb >= 0) { FX.dust(up(path[N], 0.05), tb, { count: 12, size: 0.2, spread: 0.5, seed: 21 }); FX.text(locKey("¡Pssst!"), "#bfefff", up(path[N], 0.95), tb, { life: 1.1, size: 0.6 }); }

    },
    zancos(x, c) {
      const { D, J, mover: p, seat, col } = x, N = Math.max(3, x.steps), path = cells(seat, 14, N), H2 = 0.42, t0 = 0.14, t1 = 0.8;
      x.busy.add(p);
      cue("pop", 0.03); for (let k = 0; k < N * 2; k++) cue("tap", t0 + ((t1 - t0) * (k + 0.5)) / (N * 2)); cue("slip", t1); cue("land", 0.9);
      const w = N * seg(c, t0, t1), at = pathAt(path, w), yaw = pathYaw(path, Math.min(w, N - 0.01)), side = rightOf(yaw);
      const rise = c < t0 ? backOut(seg(c, 0.03, t0)) : c < t1 ? 1 : 0, scare = pulse(c, 0.42, 0.56);
      const wob = c > t0 && c < t1 ? sin(now() * 5) * 0.16 * J + scare * 0.5 * sin(now() * 14) * J : 0;
      if (c < t1) {
        park(p, at, yaw); p.position.y += H2 * rise; p.position.addScaledVector(side, wob * 0.25); p.rotation.z = -wob; p.rotation.x = 0.1 + 0.25 * scare * sin(now() * 9);
        face(p, scare > 0.2 ? { open: 1.4, size: 1.15, pupil: 0.5, mouth: "o", noBlink: true } : { open: 1.05, ly: -0.7, mouth: "flat" });
        for (const sd of [0, 1]) {
          const ph = w - sd * 0.5, bs = Math.floor(ph), fr = clamp((ph - bs) * 2), fw = c < t0 ? 0 : Math.max(0, Math.min(N, bs + sd * 0.5 + smooth(fr) - 0.25));
          const foot = pathAt(path, fw).addScaledVector(side, (sd ? 1 : -1) * 0.06).setY(0.17 + (c > t0 ? sin(fr * PI) * 0.07 : 0));
          const topP = p.position.clone().addScaledVector(side, (sd ? 1 : -1) * 0.05).setY(p.position.y + 0.04);
          if (rise > 0.05) rod(sd, foot, topP, 0.013, WOOD);
        }
      } else if (c < 0.9) {
        const v = seg(c, t1, 0.9), from = up(path[N], H2);
        p.position.copy(from).lerp(path[N], easeIn(v)); p.rotation.set(0.3 * sin(v * PI), yaw, sin(v * 14) * 0.25); face(p, { open: 1.4, mouth: "o", ly: -0.8, noBlink: true });
        for (const sd of [0, 1]) { const sg = sd ? 1 : -1, foot = path[N].clone().addScaledVector(side, sg * (0.06 + 0.5 * v)).setY(0.17), topP = up(path[N], H2 * (1 - easeIn(v)) + 0.04).addScaledVector(side, sg * (0.05 + 0.25 * v)); rod(sd, foot, topP, 0.013, WOOD); }
      } else { const t2 = (c - 0.9) * D; park(p, path[N], yaw); settle(p, t2, 2); face(p, { open: t2 < 0.3 ? 0.3 : 0.9, mouth: t2 < 0.3 ? "flat" : "o", mouthSize: 0.6 }); FX.dust(path[N], t2, { count: 10, size: 0.17, seed: 23 }); FX.ring(path[N], t2, col); flash(path[N], t2, col); FX.text(locKey("fiu…"), "#ffffff", up(path[N], 0.85), t2 - 0.15, { life: 1, size: 0.45 }); }
      FX.text(locKey("¡Uy uy uy!"), "#ffd23f", up(at, 1.35), (c - 0.43) * D, { life: 0.9, size: 0.65 });

    },
    siesta(x, c) {
      const { D, J, mover: p, seat, col } = x, N = Math.max(4, x.steps), half = Math.floor(N / 2), path = cells(seat, 16, N), M2 = path[half], yawM = yawTo(path[half - 1], M2);
      x.busy.add(p);
      cue("yawn", 0.3); cue("pop", 0.62); cue("whoosh", 0.66);
      if (c < 0.28) hopPath(p, path.slice(0, half + 1), c, 0, 0.28, { seat });
      else if (c < 0.42) { const y = sin(seg(c, 0.28, 0.42) * PI); park(p, M2, yawM); p.scale.set(1 - 0.06 * y, 1 + 0.15 * y * J, 1 - 0.06 * y); p.rotation.x = -0.3 * y * J; face(p, { open: 1 - 0.85 * y, mouth: y > 0.1 ? "o" : "smile", mouthSize: 1 + 2 * y, noBlink: true }); FX.text(locKey("aaah"), "#ffffff", up(M2, 0.85), (c - 0.3) * D, { life: 0.8, size: 0.45 }); }
      else if (c < 0.62) { const k = smooth(seg(c, 0.42, 0.48)), br = sin(now() * 1.6) * 0.5 + 0.5; park(p, M2, yawM); p.rotation.x = (0.24 + 0.08 * br) * k; p.scale.set(1 + 0.03 * k, 1 - 0.06 * k - 0.02 * br * k, 1 + 0.03 * k); face(p, { open: 0.06, mouth: "o", mouthSize: 1 + 0.5 * br, noBlink: true }); for (let q = 0; q < 2; q++) { const v = (now() * 0.5 + q * 0.5) % 1; FX.text(q ? locKey("Z") : locKey("z"), "#ffffff", M2.clone().add(new V3(0.1 + v * 0.18, 0.5 + v * 0.5, 0)), v * 1.4, { life: 1.4, size: 0.25 + v * 0.2, tilt: 0.2 }); } }
      else if (c < 0.66) { const v = seg(c, 0.62, 0.66); park(p, M2, yawM); p.position.y += arc(v) * 0.22 * J; p.scale.set(0.9, 1.15, 0.9); face(p, { open: 1.5, size: 1.2, pupil: 0.4, mouth: "o", noBlink: true }); }
      else { const r2 = hopPath(p, path.slice(half), c, 0.66, 0.9, { seat, startYaw: yawM, numbers: false }); if (c < r2.landT) for (let k = 1; k <= 3; k++) FX.puff(up(p.position.clone().addScaledVector(fwdOf(r2.yaw), -0.12 * k), 0.1), 0.09 - k * 0.02, 0.4 - k * 0.1); else { const t2 = (c - r2.landT) * D; t2 > 0.2 && sweat(path[N], t2, 3); t2 > 0.25 && face(p, { open: 0.6, mouth: "o", mouthSize: 1 + 0.4 * sin(now() * 14), noBlink: true }); FX.ring(path[N], t2, col); } }
      FX.text(locKey("!"), "#ff5a3c", up(M2, 0.85), (c - 0.62) * D, { life: 0.7, size: 0.6, tilt: 0 });
      FX.text(locKey("¡Voy tarde!"), "#ffffff", up(M2, 1.05), (c - 0.66) * D, { life: 1, size: 0.6 });

    },
    teletransporte(x, c) {
      const { D, J, mover: p, seat, col } = x, N = Math.max(5, x.steps), path = cells(seat, 8, N), A = path[0], B = path[N], yawA = pathYaw(path, 0), yawB = pathYaw(path, N - 0.01);
      x.busy.add(p);
      cue("stretch", 0.04); cue("tele", 0.24); cue("pop", 0.3); cue("pop", 0.62); cue("tada", 0.66);
      if (c < 0.3) {
        const v = c / 0.3, sh = 1 - easeIn(seg(c, 0.22, 0.3));
        park(p, A, yawA + v * v * PI * 14); p.position.y += 0.1 * smooth(v);
        p.scale.set(Math.max(0.01, sh * (1 - 0.2 * v)), Math.max(0.01, sh * (1 + 0.5 * v * J)), Math.max(0.01, sh * (1 - 0.2 * v)));
        face(p, { open: 0.3, mouth: "flat", noBlink: true });
        for (let k = 0; k < 5; k++) { const ang = now() * 8 + k * 1.26, rad = 0.35 * (1 - v); FX.star(A.clone().add(new V3(cos(ang) * rad, 0.2 + k * 0.07, sin(ang) * rad)), 0.07, ang, v, k % 2 ? "#bfefff" : "#a46bff"); }
      } else if (c < 0.62) {
        p.visible = false;
        const w = N * easeIO(seg(c, 0.34, 0.58));
        for (let k = 0; k < 7; k++) { const q = pathAt(path, w - k * 0.25); FX.star(up(q, 0.25 + 0.05 * sin(now() * 20 + k)), 0.13 - k * 0.015, now() * 6 + k, 1 - k * 0.13, k % 2 ? "#bfefff" : "#a46bff"); }
        const kc = Math.round(w); kc > 0 && kc <= N && flash(path[kc], abs(w - kc) * 0.4, "#a46bff");
      } else {
        const t2 = (c - 0.62) * D, sc = elastic(t2 / 0.5);
        park(p, B, yawB + (1 - smooth(t2 / 0.5)) * PI * 4); p.scale.setScalar(Math.max(0.01, sc));
        p.rotation.z = 0.14 * smooth((t2 - 0.5) / 0.3);
        face(p, { open: t2 > 0.5 ? 0.35 : 1.3, mouth: t2 > 0.5 ? "smile" : "o", noBlink: true });
        FX.ring(B, t2, "#a46bff", { max: 5 }); FX.burst(up(B, 0.3), t2, { count: 12, radius: 0.6, color: "#bfefff" }); flash(B, t2, col);
        FX.text(locKey("¡Pop!"), "#bfefff", up(B, 1), t2, { life: 1, size: 0.85 }); FX.text(`+${N}`, col, up(B, 0.75), t2 - 0.5, { life: 1.2, size: 0.5, tilt: 0 });
      }
      const t1 = (c - 0.3) * D;
      FX.text(locKey("¡Pop!"), "#bfefff", up(A, 0.9), t1, { life: 0.8, size: 0.7 }); FX.ring(A, t1, "#a46bff", { max: 4 });

    },
    conga(x, c) {
      const { D, J, mover: p, seat, col } = x, N = 4, mates = x.team.filter((q) => q !== p).slice(0, 2), line = [p, ...mates], path = cells(seat, 6, N + 2), t0 = 0.1, t1 = 0.86;
      const w = N * seg(c, t0, t1), bar = Math.min(N - 1, Math.floor(w)), fr = w - bar, beat = Math.min(3, Math.floor(fr * 4)), bf = fr * 4 - beat, moving = c > t0 && c < t1;
      const adv = bar + (beat < 3 ? (beat + smooth(bf)) / 3 : 1), kick = moving && beat === 3 ? sin(bf * PI) : 0;
      for (let b2 = 0; b2 < N; b2++) for (let q = 0; q < 4; q++) cue(q < 3 ? "pop" : "clap", t0 + ((t1 - t0) * (b2 + q / 4)) / N);
      cue("tada", t1 + 0.02);
      line.forEach((q, k) => {
        x.busy.add(q);
        const off = 2 - k, wq = c < t0 ? off : c < t1 ? off + adv : off + N, at = pathAt(path, wq), yaw = pathYaw(path, Math.min(wq, N + 1.99)), sd = (bar + k) % 2 ? 1 : -1;
        park(q, at, yaw);
        q.position.y += moving ? (beat < 3 ? arc(bf) * 0.05 : kick * 0.14 * J) : 0;
        q.rotation.z = moving ? (beat < 3 ? sin((beat + bf) * PI) * 0.16 * J : sd * kick * 0.55 * J) : 0;
        q.position.addScaledVector(rightOf(yaw), moving && beat === 3 ? -sd * kick * 0.05 : 0);
        if (c >= t1) { const t2 = (c - t1) * D; settle(q, t2, 1.4); q.rotation.z = (k - 1) * 0.3 * J * smooth(t2 / 0.3); }
        face(q, kick > 0.2 ? { open: 0.3, mouth: "o", mouthSize: 1.4, noBlink: true } : { open: 1, lx: sin(now() * 4 + k) * 0.4 });
        if (moving) { const v = (now() * 0.8 + k * 0.33) % 1; FX.text(locKey("la-la"), colors[(seat + k) % me], onPawn(q, 0.12, 0.5 + v * 0.3, 0), v * 1.2, { life: 1.2, size: 0.3 + v * 0.1, tilt: 0.2 }); }
      });
      for (let b2 = 0; b2 < N; b2++) FX.text(locKey("¡Hey!"), "#ffd23f", up(pathAt(path, b2 + 3), 1.05), (c - (t0 + ((t1 - t0) * (b2 + 0.75)) / N)) * D, { life: 0.5, size: 0.6 });
      const kc = Math.floor(adv); moving && flash(path[Math.min(N + 2, kc + 2)], fr * 0.5, col);
      FX.text(locKey("¡Conga!"), col, up(pathAt(path, N + 1), 1.2), (c - t1) * D, { hold: true, size: 0.95 });
      FX.burst(up(pathAt(path, N + 1), 0.6), (c - t1) * D, { count: 12, radius: 0.6, multi: true });

    },
    selfie(x, c) {
      const { D, J, mover: p, seat, rival: rv, col } = x, path = cells(seat, 14, 4), G = path[2], side = perpTo(path[1], path[3]), Rv = G.clone().addScaledVector(side, 0.42), Gs = G.clone().addScaledVector(side, 0.17);
      const ys = camYaw(G.clone().lerp(Rv, 0.5)), yawIn = yawTo(path[1], G), tA = 0.3, tB = 0.42, f1 = 0.52, f2 = 0.62, tE = 0.72;
      x.busy.add(p); x.busy.add(rv);
      cue("pop", tB - 0.02); cue("click", f1); cue("click", f2);
      const posing = c >= tB && c < tE - 0.04;
      if (c < tA) hopPath(p, path.slice(0, 3), c, 0, tA, { seat });
      else if (c < tB) { const v = smooth(seg(c, tA, tB)); p.position.copy(G).lerp(Gs, v); p.position.y += arc(v) * 0.08; p.rotation.set(0, lerpAngle(yawIn, ys, v), 0); face(p, { ...lookAt(p, up(Rv, 0.3)), open: 1.1 }); }
      else if (c < tE) { const v = smooth(seg(c, tE - 0.05, tE)); p.position.copy(Gs).lerp(G, v); p.rotation.set(0, lerpAngle(ys, yawIn, v), -0.22 * J * (1 - v) * Math.sign(Rv.clone().sub(G).dot(rightOf(ys)))); p.position.y += abs(sin((c - tB) * D * 5)) * 0.015; face(p, { open: 0.28, mouth: "smile", mouthSize: 1.3, noBlink: true }); }
      else hopPath(p, path.slice(2), c, tE, 0.95, { seat, startYaw: yawIn });
      const center = Gs.clone().lerp(Rv, 0.5), ph = center.clone().addScaledVector(fwdOf(ys), 0.5).setY(0.62 + sin(now() * 3) * 0.01);
      const ps = c < tB - 0.03 ? 0 : c < tE - 0.04 ? elastic(seg(c, tB - 0.03, tB + 0.08)) : 1 - smooth(seg(c, tE - 0.04, tE));
      show(phone, ph, ys + PI, ps, -0.25, 0.08);
      park(rv, Rv, c < tA ? camYaw(Rv) : lerpAngle(camYaw(Rv), ys, smooth(seg(c, tB, tB + 0.06)) * (1 - smooth(seg(c, tE, tE + 0.08)))));
      if (c < tA) face(rv, lookAt(rv, up(p.position, 0.3)));
      else if (c < f1) face(rv, { ...lookAt(rv, up(p.position, 0.3)), open: 0.7, mouth: "flat" });
      else if (c < f2) face(rv, { open: 0.15, mouth: "flat", noBlink: true });
      else if (c < tE) face(rv, { open: 1.1, mouth: "smile", mouthSize: 0.7, noBlink: true });
      else { face(rv, { lx: cos(now() * 9) * 0.8, ly: sin(now() * 9) * 0.8, pupil: 0.6, mouth: "o", noBlink: true }); orbitStars(Rv, 0.55, 0.16, 2); FX.text(locKey("¿?"), "#ffffff", up(Rv, 0.85), (c - tE - 0.03) * D, { life: 1.2, size: 0.5, tilt: 0.15 }); }
      for (const tf of [f1, f2]) { const t2 = (c - tf) * D; if (t2 >= 0 && t2 < 0.2) hemi.intensity = 2.5 + 5 * Math.exp(-t2 * 14); FX.burst(ph, t2, { count: 8, radius: 0.35, color: "#ffffff", life: 0.4 }); FX.text(locKey("¡clic!"), "#ffffff", up(ph, 0.25), t2, { life: 0.6, size: 0.45 }); }
      FX.text(locKey("¡Selfie!"), col, up(center, 1.1), (c - tB) * D, { life: 1.2, size: 0.75 });

    },

    
    burla(x, c) {
      const { D, J, mover: p, seat, steps, rival: rv, rivalSeat, col } = x, R = nextSafe(seat, steps + 1), path = Array.from({ length: steps + 1 }, (_, k) => cell(seat, R - steps + k)), G = path[steps];
      const rp = [cell(seat, R - 3), cell(seat, R - 2), cell(seat, R - 1)], B = rp[2], yawF = yawTo(rp[1], G), yawB = yawTo(G, B), back = dirTo(G, B);
      x.busy.add(p); x.busy.add(rv);
      cue("inflate", 0.36); cue("pop", 0.4); cue("rumble", 0.58); [0.64, 0.7, 0.76].forEach((tm) => cue("stretch", tm)); cue("boing", 0.86); cue("land", 0.93);
      const land = hopPath(p, path, c, 0, 0.36, { seat });
      if (c >= 0.36) { const sc = elastic(((c - 0.36) * D) / 0.6) * (1 + 0.03 * sin(now() * 5) + 0.12 * pulse(c, 0.85, 0.92)); bubble.visible = true; bubble.position.copy(up(G, 0.22)); bubble.scale.setScalar(Math.max(0.01, sc)); FX.ring(G, (c - 0.36) * D, "#7fd7ff", { max: 5 }); }
      if (c < 0.4) { park(rv, rp[0], yawF); face(rv, lookAt(rv, up(p.position, 0.3))); }
      else if (c < 0.56) hopPath(rv, rp, c, 0.4, 0.56, { seat: rivalSeat, numbers: false });
      else if (c < 0.82) { const t2 = (c - 0.56) * D, mad = smooth(t2 / 0.4); park(rv, B, yawF); rv.position.y += abs(sin(t2 * 10)) * 0.05 * J * mad; tint(rv, "#ff3b30", 0.45 * mad); face(rv, { ...lookAt(rv, up(G, 0.3)), open: 0.5, pupil: 0.75, mouth: "flat", noBlink: true }); steam(B, t2, 4); FX.text(locKey("grrr"), "#ff5a3c", up(B, 0.9), t2 - 0.1, { life: 1.4, size: 0.5, tilt: 0.15 }); }
      else if (c < 0.93) { const v = seg(c, 0.82, 0.93), out = v < 0.4 ? easeIn(v / 0.4) : 1 - easeOut((v - 0.4) / 0.6); rv.position.copy(B).addScaledVector(back, -0.17 * out); rv.position.y += arc(v) * 0.2 * J; rv.rotation.set(v < 0.4 ? 0.5 : -1.2 * easeOut((v - 0.4) / 0.6), yawF, 0); tint(rv, "#ff3b30", 0.45); face(rv, { open: 1.3, pupil: 0.5, mouth: "o", noBlink: true }); }
      else { const t2 = (c - 0.93) * D; park(rv, B, yawF); rv.rotation.x = -1.2; settle(rv, t2, 0.8); face(rv, { lx: cos(now() * 9), ly: sin(now() * 9), mouth: "o", noBlink: true }); orbitStars(B.clone().addScaledVector(back, 0.25), 0.14, 0.13); FX.dust(B, t2, { count: 8, size: 0.14, seed: 27 }); }
      if (c >= 0.56) {
        const turn = smooth(seg(c, 0.56, 0.62)), tease = c > 0.62 ? 1 : 0, t2 = (c - 0.62) * D;
        park(p, G, lerpAngle(land.yaw, yawB, turn)); p.rotation.z = tease * sin(t2 * 9) * 0.25 * J; p.rotation.x = tease * 0.15; p.position.y += tease * abs(sin(t2 * 9)) * 0.02;
        face(p, tease ? { open: 0.14, mouth: "o", mouthSize: 1.2, noBlink: true } : lookAt(p, up(B, 0.3)));
        if (tease) { show(tongue, onPawn(p, 0, 0.258, 0.1), p.rotation.y, 1, 0.35 + 0.2 * sin(t2 * 20), 0); tongue.rotation.z = p.rotation.z; [0, 0.55, 1.1].forEach((dl, k) => FX.text(locKey("ñañaña"), "#ff8fd0", up(G, 0.9 + k * 0.08), t2 - dl, { life: 0.6, size: 0.45, tilt: k % 2 ? 0.15 : -0.15 })); }
      }
      FX.text(locKey("¡A salvo!"), "#7fd7ff", up(G, 1.15), (c - 0.4) * D, { life: 1, size: 0.7 });
      FX.text(locKey("¡Boing!"), "#7fd7ff", up(G.clone().lerp(B, 0.5), 0.9), (c - 0.86) * D, { life: 0.9, size: 0.7 });

    },
    puntillas(x, c) {
      const { D, J, mover: p, seat, rival: rv, col } = x, path = cells(seat, 12, 5), side = perpTo(path[2], path[4]), Rv = path[3].clone().addScaledVector(side, 0.42), yawS = yawTo(path[3], Rv);
      x.busy.add(p); x.busy.add(rv);
      const steps2 = [0.24, 0.29, 0.34, 0.39, 0.44, 0.62, 0.67, 0.72, 0.77]; steps2.forEach((tm) => cue("tap", tm)); cue("pop", 0.47); cue("yawn", 0.56); cue("whoosh", 0.8);
      const stir = pulse(c, 0.46, 0.58);
      park(rv, Rv, yawS + stir * 1.2);
      const br = sin(now() * 1.6) * 0.5 + 0.5;
      rv.rotation.x = 0.24 * (1 - stir) + 0.06 * br; rv.scale.set(1.03, 0.94 - 0.02 * br, 1.03);
      face(rv, stir > 0.3 ? { open: 0.5, lx: 0.8, mouth: "flat", noBlink: true } : { open: 0.06, mouth: "o", mouthSize: 1 + 0.5 * br, noBlink: true });
      if (stir < 0.3) for (let q = 0; q < 2; q++) { const v = (now() * 0.5 + q * 0.5) % 1; FX.text(q ? locKey("Z") : locKey("z"), "#ffffff", Rv.clone().add(new V3(0.1 + v * 0.18, 0.5 + v * 0.5, 0)), v * 1.4, { life: 1.4, size: 0.25 + v * 0.2, tilt: 0.2 }); }
      FX.text(locKey("¿mmh?"), "#ffffff", up(Rv, 0.85), (c - 0.47) * D, { life: 0.9, size: 0.45, tilt: 0.15 });
      if (c < 0.16) hopPath(p, path.slice(0, 2), c, 0, 0.16, { seat });
      else if (c < 0.2) { park(p, path[1], pathYaw(path, 1)); face(p, { ...lookAt(p, up(Rv, 0.3)), open: 1.3, pupil: 0.6, mouth: "o", noBlink: true }); }
      else if (c < 0.8) {
        const w = c < 0.46 ? 1 + 1.6 * seg(c, 0.2, 0.46) : c < 0.6 ? 2.6 : 2.6 + 1.4 * seg(c, 0.6, 0.8), frozen = c >= 0.46 && c < 0.6, t2 = (c - 0.2) * D;
        park(p, pathAt(path, w), pathYaw(path, w));
        if (frozen) { p.scale.set(0.86, 1.2, 0.86); p.position.x += sin(now() * 70) * 0.003 * J; face(p, { lx: lookAt(p, up(Rv, 0.3)).lx, open: 1.5, size: 1.15, pupil: 0.4, mouth: "flat", noBlink: true }); sweat(p.position, t2, 2); }
        else { p.scale.set(0.88, 1.16, 0.88); p.position.y += abs(sin(t2 * 10)) * 0.03; p.rotation.z = sin(t2 * 10) * 0.1; p.rotation.x = 0.08; face(p, { ...lookAt(p, up(Rv, 0.3)), open: 0.8, mouth: "o", mouthSize: 0.45, noBlink: true }); }
        const kc = Math.floor(w); flash(path[kc], (w - kc) * 0.4, col);
      } else if (c < 0.86) { const y = sin(seg(c, 0.8, 0.86) * PI); park(p, path[4], pathYaw(path, 4)); p.scale.set(1 + 0.08 * y, 1 - 0.12 * y, 1 + 0.08 * y); face(p, { open: 0.3, mouth: "o", noBlink: true }); FX.puff(onPawn(p, 0, 0.27, 0.2 + y * 0.1), 0.05 + y * 0.05, 0.5); }
      else hopPath(p, path.slice(4), c, 0.86, 0.96, { seat, startYaw: pathYaw(path, 3.5), numbers: false });
      FX.text(locKey("shhh"), "#bfefff", up(path[1], 0.9), (c - 0.21) * D, { life: 1.1, size: 0.6 });
      FX.text(locKey("shhh…"), "#bfefff", up(path[3], 0.9), (c - 0.62) * D, { life: 1, size: 0.5 });
      FX.text(locKey("fiu"), "#ffffff", up(path[4], 0.85), (c - 0.81) * D, { life: 0.8, size: 0.45 });

    },
    saludo(x, c) {
      const { D, J, mover: p, seat, steps, rival: rv, col } = x, R = nextSafe(seat, steps + 1), path = Array.from({ length: steps + 1 }, (_, k) => cell(seat, R - steps + k)), G = path[steps], side = perpTo(path[steps - 1], G);
      const A = G.clone().addScaledVector(side, 0.085), B = G.clone().addScaledVector(side, -0.085), yawF = yawTo(path[steps - 1], G);
      path[steps] = A;
      x.busy.add(p); x.busy.add(rv);
      cue("click", 0.58); cue("clap", 0.58); cue("pop", 0.86);
      const land = hopPath(p, path, c, 0, 0.4, { seat });
      const turn = smooth(seg(c, 0.42, 0.5)) * (1 - smooth(seg(c, 0.86, 0.94))), up2 = smooth(seg(c, 0.5, 0.58)) * (1 - smooth(seg(c, 0.78, 0.84))), nod = pulse(c, 0.84, 0.92), snap = c > 0.58 ? Math.exp(-(c - 0.58) * D * 9) : 0;
      park(rv, B, lerpAngle(yawF + PI, yawTo(B, A), turn));
      if (c < 0.4) face(rv, lookAt(rv, up(p.position, 0.3)));
      if (c >= 0.4) {
        p.rotation.set(0.28 * nod, lerpAngle(land.yaw, yawTo(A, B), turn), 0); rv.rotation.x = 0.28 * nod;
        [p, rv].forEach((q, k) => {
          q.scale.set(1 - 0.05 * up2, 1 + 0.1 * up2 + 0.06 * snap, 1 - 0.05 * up2);
          face(q, up2 > 0.5 ? { open: 0.9, mouth: "flat", noBlink: true } : { ...lookAt(q, up((k ? p : rv).position, 0.3)), mouth: c > 0.84 ? "smile" : "flat" });
          if (up2 > 0.02) hand(k, onPawn(q, 0.105, 0.2 + 0.2 * up2, 0.06), colorOf(q), 0.9);
        });
      }
      FX.burst(up(G, 0.6), (c - 0.58) * D, { count: 6, radius: 0.3, color: "#ffffff", life: 0.5 });
      FX.text(locKey("¡Tregua!"), "#7fd7ff", up(G, 1.1), (c - 0.6) * D, { life: 1.4, size: 0.8 });
      FX.ring(G, (c - 0.4) * D, "#7fd7ff", { max: 4 });

    },

    
    alfombra(x, c) {
      const { D, J, mover: p, seat, piece, col } = x, A = cell(seat, xe.home - 4), B = homeSlot(seat, piece), yaw = yawTo(A, B), dir = dirTo(A, B), len = A.distanceTo(B) + 0.12, start = A.clone().addScaledVector(dir, -0.14).setY(0.2);
      x.busy.add(p);
      cue("tada", 0.03); cue("whoosh", 0.1); [0.46, 0.55, 0.64, 0.73].forEach((tm) => cue("click", tm)); cue("hop", 0.84); cue("land", 0.9); cue("tada", 0.91);
      const roll = easeIO(seg(c, 0.08, 0.34));
      carpet.visible = roll > 0.01; carpet.position.copy(start); carpet.rotation.set(0, yaw, 0); carpet.scale.set(1, 1, Math.max(0.01, len * roll));
      const rr = 0.012 + 0.05 * (1 - roll);
      carpetRoll.visible = c > 0.04 && roll < 0.995; carpetRoll.position.copy(start).addScaledVector(dir, len * roll).setY(0.2 + rr); carpetRoll.rotation.set(roll * 30, yaw, 0); carpetRoll.scale.set(1, rr, rr);
      const w = smooth(seg(c, 0.42, 0.84)), tW = (c - 0.42) * D, tL = (c - 0.9) * D;
      if (c < 0.42) { park(p, A, yaw); const pr = smooth(seg(c, 0.34, 0.42)); p.rotation.x = -0.14 * pr; p.scale.set(1 - 0.03 * pr, 1 + 0.07 * pr, 1 - 0.03 * pr); face(p, pr > 0.5 ? { open: 0.25, noBlink: true } : { ...lookAt(p, up(B, 0.3)), open: 1.2, mouth: "o" }); }
      else if (c < 0.84) { const last = A.clone().lerp(B, 0.8); park(p, A.clone().lerp(last, w), yaw); p.position.y += abs(sin(tW * 5)) * 0.02; p.rotation.x = -0.14; p.rotation.z = sin(tW * 5) * 0.09 * J; p.scale.set(0.97, 1.07, 0.97); face(p, { open: 0.22, noBlink: true }); }
      else if (c < 0.9) { hopArc(p, A.clone().lerp(B, 0.8), B, seg(c, 0.84, 0.9), 0.25 * J + 0.05); p.rotation.set(0, yaw + PI * 2 * easeIO(seg(c, 0.84, 0.9)), 0); face(p, { open: 1.2, mouth: "o", noBlink: true }); }
      else { park(p, B, camYaw(B)); settle(p, tL, 1.6); face(p, { open: 0.3, noBlink: true }); crown(crowns[piece], p, tL - 0.1); }
      x.team.forEach((q, k) => { if (q === p) return; x.busy.add(q); const hb = homeSlot(seat, k); park(q, hb, yawTo(hb, p.position)); const h = (now() * 2 + k * 0.3) % 1; q.position.y += c > 0.3 ? arc(h) * 0.1 * J : 0; face(q, { ...lookAt(q, up(p.position, 0.3)), open: 1.15, mouth: "o" }); crown(crowns[k], q, 1); });
      [0.46, 0.55, 0.64, 0.73].forEach((tm, k) => { const t2 = (c - tm) * D, at = p.position.clone().addScaledVector(rightOf(yaw), (k % 2 ? 1 : -1) * 0.55).setY(0.55 + (k % 3) * 0.12); FX.burst(at, t2, { count: 6, radius: 0.22, color: "#ffffff", life: 0.35 }); if (t2 >= 0 && t2 < 0.15) hemi.intensity = 2.5 + 2.5 * Math.exp(-t2 * 16); });
      FX.text(locKey("¡La última!"), "#ffd23f", up(B, 1.2), tL, { hold: true, size: 0.95 });
      FX.confetti(up(B, 0.3), tL, { count: 70, power: 0.95, seed: 17 }); FX.ring(B, tL, col, { max: 5 });

    },
    cohete(x, c) {
      const { D, J, mover: p, seat, piece, col } = x, B = homeSlot(seat, piece), path = [cell(seat, xe.home - 2), cell(seat, xe.home - 1), B], top = 3.1, tF = 0.42, tX = 0.58, tD = 0.68, tL = 0.86;
      x.busy.add(p);
      cue("fuse", 0.3); cue("whoosh", tF); cue("tele", tF); cue("pum", tX); [0.6, 0.63, 0.66].forEach((tm) => cue("pop", tm)); cue("land", tL); cue("tada", tL + 0.02);
      const yaw = camYaw(B);
      if (c < 0.28) hopPath(p, path, c, 0, 0.28, { seat, lastHeight: 1.4 });
      else if (c < tF) { const k = smooth(seg(c, 0.28, tF)); park(p, B, yaw); squash(p, 0.4 * k * J); p.position.x += sin(now() * 70) * 0.005 * k; face(p, { open: 0.4, mouth: "flat", ly: 0.6, noBlink: true }); for (let q = 0; q < 3; q++) FX.star(B.clone().add(new V3((rnd(q + Math.floor(now() * 20)) - 0.5) * 0.2, 0.03, (rnd(q * 5 + Math.floor(now() * 20)) - 0.5) * 0.2)), 0.07, now() * 9 + q, 1, q % 2 ? "#ffd23f" : "#ff8a3d"); }
      else if (c < tX) { const v = seg(c, tF, tX); park(p, B, yaw + v * PI * 6); p.position.y += top * easeOut(v); p.scale.set(0.8, 1.35, 0.8); face(p, { open: 1.3, mouth: "o", ly: 0.8, noBlink: true }); for (let q = 1; q <= 8; q++) { const w = v - q * 0.035; if (w > 0) { const at = up(B, top * easeOut(w)); q % 2 ? FX.star(at, 0.12 - q * 0.01, now() * 5 + q, 1 - q / 9, "#ffd23f") : FX.puff(at, 0.1, 0.5 - q * 0.05); } } }
      else if (c < tD) p.visible = false;
      else if (c < tL) { const v = seg(c, tD, tL); park(p, B, yaw + (1 - v) * PI * 4); p.position.y += top * (1 - easeIn(v)); p.rotation.z = sin(v * 16) * 0.3 * (1 - v); tint(p, "#3a3340", 0.55); face(p, { open: 1.3, pupil: 0.5, mouth: "o", ly: -0.8, noBlink: true }); for (let q = 1; q <= 4; q++) FX.puff(up(p.position, 0.3 + q * 0.12), 0.08, 0.45 - q * 0.09, "#5d5560"); }
      else { const t2 = (c - tL) * D; park(p, B, yaw); settle(p, t2, 2.4); tint(p, "#3a3340", 0.55 * (1 - smooth(t2 / 0.9))); face(p, { open: t2 < 0.3 ? 0.3 : 1.1, mouth: "smile", noBlink: t2 < 0.3 }); crown(crowns[0], p, t2 - 0.25); FX.dust(B, t2, { count: 12, size: 0.2, spread: 0.45, seed: 29 }); FX.ring(B, t2, col, { max: 5 }); FX.text(locKey("¡En casa!"), "#ffd23f", up(B, 1.15), t2 - 0.1, { hold: true, size: 0.85 }); t2 < 0.5 && (Re += 0.06 * J * Math.exp(-t2 * 10)); }
      const tb = (c - tX) * D, sky = up(B, top + 0.3);
      if (tb >= 0) {
        [[0, 0, 0, 0], [0.12, -0.5, 0.25, 0.3], [0.24, 0.45, 0.1, -0.35]].forEach(([dl, ox, oy, oz], k) => { const at = sky.clone().add(new V3(ox, oy, oz)); FX.burst(at, tb - dl, { count: 16, radius: 0.95, multi: true, seed: k * 31, life: 1 }); FX.ring(at.clone().setY(at.y - 0.02), tb - dl, colors[(seat + k) % me], { max: 3, life: 0.5 }); });
        FX.text(locKey("¡PUM!"), col, up(sky, 0.5), tb, { life: 1.1, size: 1.1 }); FX.confetti(sky, tb, { count: 70, power: 1, seed: 33 });
        if (tb < 0.3) hemi.intensity = 2.5 + 4 * Math.exp(-tb * 9);
      }

    },
    sudada(x, c) {
      const { D, J, mover: p, seat, piece, col } = x, B = homeSlot(seat, piece), pts = [cell(seat, xe.home - 3), cell(seat, xe.home - 2), cell(seat, xe.home - 1), B], hops = [[0.02, 0.14, 0.3], [0.2, 0.36, 0.22], [0.44, 0.66, 0.13]];
      x.busy.add(p);
      hops.forEach(([a2, b2]) => { cue("hop", a2); cue("land", b2); }); cue("yawn", 0.69); cue("land", 0.86);
      let k = 0; while (k < 2 && c >= hops[k + 1][0]) k++;
      const [a2, b2, hh] = hops[k], v = seg(c, a2, b2), yaw = yawTo(pts[k], pts[k + 1]), t2 = c * D;
      if (c < 0.66) {
        if (v < 1) { hopArc(p, pts[k], pts[k + 1], v, hh * (0.6 + 0.4 * J)); p.rotation.set(0.15, yaw, 0); squash(p, -0.1 * sin(v * PI)); }
        else { park(p, pts[k + 1], yaw); const pant = sin(t2 * 13); p.rotation.x = 0.22 + 0.04 * pant; p.scale.set(1 + 0.04 * pant, 1 - 0.07 - 0.05 * pant, 1 + 0.04 * pant); }
        face(p, { open: 0.5, ly: -0.5, mouth: "o", mouthSize: 1.1 + 0.4 * sin(t2 * 13), noBlink: true });
        sweat(p.position, t2, 3 + k);
        flash(pts[k + 1], (c - b2) * D, col);
      } else if (c < 0.78) {
        const w = seg(c, 0.67, 0.77); park(p, B, lerpAngle(yaw, camYaw(B), smooth(seg(c, 0.66, 0.7)))); p.rotation.x = -0.1; face(p, { open: 0.15, mouth: "o", mouthSize: 1.4, noBlink: true });
        hand(0, onPawn(p, -0.09 + 0.18 * smooth(w), 0.385 + 0.02 * sin(w * PI), 0.085), colorOf(p), 1); sweat(B, t2, 2);
      } else {
        const fall = easeIn(seg(c, 0.78, 0.86)), tl = (c - 0.86) * D, br = sin(now() * 4);
        park(p, B, camYaw(B)); p.rotation.x = -1.45 * fall;
        if (tl > 0) { p.scale.set(1 + 0.05 * br, 1, 1 + 0.05 * br); FX.dust(B, tl, { count: 9, size: 0.15, seed: 35 }); crown(crowns[0], p, tl - 0.4); }
        face(p, { open: 0.08, mouth: "o", mouthSize: 1.2 + 0.3 * br, noBlink: true });
      }
      FX.text(locKey("¡Uff!"), "#7cc7ff", up(B, 0.95), (c - 0.69) * D, { life: 1, size: 0.75 });
      FX.text(locKey("En casa… por fin"), "#ffd23f", up(B, 1.15), (c - 0.88) * D, { hold: true, size: 0.75 });
      FX.ring(B, (c - 0.66) * D, col);

    },

    
    pinata(x, c) {
      const { D, J, seat, col } = x, C = cell(seat, xe.home), hang = up(C, 1.3), hits = [0.2, 0.36, 0.52], tB = hits[2];
      cue("pop", 0.03); hits.forEach((tm, k) => { cue("hop", tm - 0.07); cue(k < 2 ? "bonk" : "strike", tm); }); cue("tada", tB + 0.03); [0.66, 0.7, 0.74, 0.78].forEach((tm) => cue("plop", tm));
      let swing = sin(now() * 2) * 0.12;
      hits.forEach((tm) => { const t2 = (c - tm) * D; if (t2 > 0) swing += 0.7 * Math.exp(-t2 * 2.5) * sin(t2 * 11); });
      if (c < tB) { const sc = backOut(seg(c, 0.02, 0.1)); show(pinata, hang, now() * 0.4, sc, 0, swing); pinata.rotation.order = "ZYX"; pinata.rotation.set(0, now() * 0.4, swing); rod(0, up(hang, 3), hang, 0.004, "#ffffff"); }
      const body = hang.clone().add(new V3(sin(swing) * 0.2, -0.2, 0));
      x.team.forEach((p, k) => {
        x.busy.add(p); const hb = homeSlot(seat, k); park(p, hb, camYaw(hb));
        const tm = hits[k];
        if (k < 3 && c > tm - 0.08 && c < tm + 0.07) { const v = seg(c, tm - 0.08, tm + 0.07); p.position.lerp(body.clone().setY(hb.y), 0.5 * sin(v * PI)); p.position.y += arc(v) * (0.62 * J + 0.1); p.rotation.x = -0.5 * sin(v * PI); face(p, { open: 1.2, mouth: "o", ly: 0.8, noBlink: true }); }
        else if (c > tB) { const t2 = (c - tB) * D, h = (t2 * 2.2 + k * 0.27) % 1; p.position.y += arc(h) * 0.14 * J; face(p, { ly: 0.9, open: 1.25, mouth: "o", mouthSize: 1.5, noBlink: true }); if (k === 3 && c > 0.74) { const tk = (c - 0.74) * D; p.position.y = hb.y; squash(p, 0.45 * Math.exp(-tk * 5) * abs(cos(tk * 12))); face(p, { lx: cos(now() * 9), ly: sin(now() * 9), mouth: "o", noBlink: true }); orbitStars(hb, 0.5, 0.15); FX.text(locKey("¡Ay!"), "#ff8fd0", up(hb, 0.9), tk, { life: 0.9, size: 0.55 }); } }
        else face(p, { ...lookAt(p, body), open: 1.1 });
        crown(crowns[k], p, 1);
      });
      hits.forEach((tm, k) => { const t2 = (c - tm) * D; FX.burst(body, t2, { count: k < 2 ? 6 : 18, radius: k < 2 ? 0.35 : 1, multi: true, seed: k * 11 }); k < 2 && FX.text(k ? locKey("¡Dale!") : locKey("¡Dale!"), "#ffffff", up(body, 0.5), t2, { life: 0.6, size: 0.55 }); t2 > 0 && t2 < 0.4 && (Re += 0.04 * J * Math.exp(-t2 * 10)); });
      const tb = (c - tB) * D;
      if (tb >= 0) {
        FX.confetti(body, tb, { count: 90, power: 1, seed: 41 }); FX.text(locKey("¡Mangos!"), "#ffb52e", up(body, 0.75), tb - 0.1, { hold: true, size: 1.05 });
        mangos.forEach((mg, k) => {
          const tt = tb - k * 0.05; if (tt < 0) return;
          let at, spinning = true;
          if (k === 0) { 
            const tgt = up(homeSlot(seat, 3), 0.45), w = seg(c, tB, 0.74), w2 = seg(c, 0.74, 0.84);
            if (w < 1) { at = body.clone().lerp(tgt, w); at.y += arc(w) * 0.35; }
            else { at = tgt.clone().add(new V3(0.35 * w2, 0, 0.2 * w2)); at.y = MathLerp(tgt.y, 0.26, easeIn(w2)) + arc(w2) * 0.3; spinning = w2 < 1; }
          } else {
            const ang = rnd(k * 3.3) * PI * 2, rad = 0.25 + rnd(k * 5.1) * 0.75, vy = 0.6 + rnd(k * 7.7) * 0.8, g2 = 3.4, h0 = body.y - 0.26, tg = (vy + Math.sqrt(vy * vy + 2 * g2 * h0)) / g2, prog = Math.min(1, tt / (tg + 0.4));
            at = new V3(body.x + cos(ang) * rad * prog, 0.26, body.z + sin(ang) * rad * prog);
            if (tt < tg) at.y += h0 + vy * tt - 0.5 * g2 * tt * tt; else { const w = (tt - tg) / 0.4; at.y += w < 1 ? arc(w) * 0.16 : 0; spinning = w < 1; }
          }
          show(mg, at, k * 1.3, 1, spinning ? tt * 6 : 1.3, spinning ? tt * 4 : 0.4);
        });
      }
      FX.text(locKey("¡Piñata!"), col, up(hang, 0.55), (c - 0.05) * D, { life: 1.2, size: 0.9 });

    },
    perdedores(x, c) {
      const { D, J, seat, col } = x, C = cell(seat, xe.home), Tp = new V3(0, -0.065, xe.radius + 0.85), losers = [];
      for (let k = 1; k < me; k++) losers.push(pawns[((seat + k) % me) * 4]);
      cue("tada", 0.03); cue("pop", 0.05); [0.61, 0.71, 0.81, 0.91].forEach((tm) => cue("clap", tm)); cue("sad", 0.5);
      show(table, Tp, 0, 1.25 * backOut(seg(c, 0.03, 0.12)));
      x.team.forEach((p, k) => { x.busy.add(p); const hb = homeSlot(seat, k); park(p, hb, camYaw(hb)); const h = (c * D * 2 + k * 0.25) % 1; p.position.y += arc(h) * (0.2 * J + 0.03); p.rotation.y += Math.floor(c * D * 2 + k * 0.25) % 2 ? PI * 2 * easeIO(h) : 0; face(p, { open: 0.3, noBlink: true }); crown(crowns[k], p, c * D - 0.2 - k * 0.1); });
      losers.forEach((p, k) => {
        x.busy.add(p);
        const ang = PI * 0.5 + ((k + 0.5) / losers.length - 0.5) * PI * 1.5, seatPos = Tp.clone().add(new V3(cos(ang) * 0.5, 0, sin(ang) * 0.5)), from = p.position.clone(), t0 = 0.12 + k * 0.07, v = seg(c, t0, t0 + 0.22), yawT = yawTo(seatPos, Tp);
        cue("hop", t0); cue("land", t0 + 0.22);
        if (v <= 0) return face(p, { ly: -0.6, open: 0.6, mouth: "sad" });
        if (v < 1) { hopArc(p, from, seatPos, v, 1.1); p.rotation.set(0, lerpAngle(camYaw(from), yawT, v), 0); return face(p, { open: 0.6, ly: -0.5, mouth: "sad", noBlink: true }); }
        const tl = (c - t0 - 0.22) * D, sit = smooth(tl / 0.3), period = 0.1, cv = c > 0.6 ? ((c - 0.56) % period) / period : 0, gap = c > 0.6 ? 0.012 + 0.08 * abs(cos(cv * PI)) : 0.09;
        park(p, seatPos, yawT); p.scale.set(1 + 0.1 * sit, 1 - 0.22 * sit, 1 + 0.1 * sit); p.rotation.x = 0.14 * sit;
        if (tl < 0.4) FX.dust(seatPos, tl, { count: 6, size: 0.12, seed: k * 4 });
        const cry = k === losers.length - 1;
        face(p, cry ? { open: 0.1, mouth: "sad", noBlink: true } : { ...lookAt(p, up(C, 0.5)), open: 0.6, mouth: k % 2 ? "flat" : "sad" });
        if (cry) for (const sx of [-1, 1]) for (let q = 0; q < 3; q++) { const w = (tl * 1.3 + q / 3) % 1; FX.puff(onPawn(p, sx * 0.06, 0.31 - w * 0.25, 0.1 + w * 0.06), 0.035, 0.9 * (1 - w), "#6ec3ff"); }
        if (c > 0.56) for (const sx of [-1, 1]) hand(k * 2 + (sx > 0 ? 1 : 0), onPawn(p, sx * gap, 0.2, 0.15), colorOf(p), 0.85 * smooth(seg(c, 0.56, 0.62)));
      });
      [0.61, 0.71, 0.81, 0.91].forEach((tm, k) => FX.text(k % 2 ? locKey("clap…") : locKey("bravo…"), "#c9c3d6", up(Tp, 0.95 + (k % 2) * 0.12), (c - tm) * D, { life: 0.7, size: 0.5, tilt: k % 2 ? 0.1 : -0.1 }));
      FX.text(locKey("¡Victoria!"), col, up(C, 1.4), (c - 0.05) * D, { hold: true, size: 1 });
      FX.confetti(up(C, 0.4), (c - 0.05) * D, { count: 70, power: 1, seed: 43 });
      FX.text(locKey("Mesa de los perdedores"), "#c9c3d6", up(Tp, 1.35), (c - 0.5) * D, { hold: true, size: 0.6 });

    },
    bote(x, c) {
      const { D, J, seat, col } = x, C = cell(seat, xe.home), tosses = [[0.16, 0.36, 0.9], [0.42, 0.64, 1.3], [0.7, 0.96, 1.8]], rest = 0.47;
      cue("tada", 0.03); cue("pop", 0.05); tosses.forEach(([a2, b2]) => { cue("boing", a2); cue("land", b2); });
      let lift = 0, spin = 0, push = 0;
      tosses.forEach(([a2, b2, h2], k) => { const v = seg(c, a2, b2); if (c >= a2 && v < 1) { lift = arc(v) * h2 * (0.5 + 0.5 * J); spin = PI * 2 * easeIO(v) * (k === 2 ? 2 : 1); } push = Math.max(push, pulse(c, a2 - 0.05, a2 + 0.03), pulse(c, b2 - 0.01, b2 + 0.06)); });
      const yaw = camYaw(C);
      show(avatar, C.clone().setY(rest + lift - 0.06 * push), yaw + spin, 0.72 * backOut(seg(c, 0.03, 0.12)), 0, sin(now() * 3) * 0.06 + (lift > 0 ? sin(now() * 9) * 0.12 : 0));
      x.team.forEach((p, k) => {
        x.busy.add(p); const hb = homeSlot(seat, k); park(p, hb, yawTo(C, hb));
        p.scale.set(1 + 0.12 * push, 1 - 0.22 * push + (lift > 0.1 ? 0.12 : 0), 1 + 0.12 * push);
        p.position.y += lift > 0.1 ? 0.04 * abs(sin(now() * 10 + k)) : 0;
        face(p, { ly: 1, open: lift > 0.1 ? 1.25 : 0.4, mouth: lift > 0.1 ? "o" : "smile", mouthSize: 1.4, noBlink: true });
      });
      tosses.forEach(([a2, b2], k) => { FX.text(k < 2 ? locKey("¡Hip, hip!") : locKey("¡HURRA!"), k < 2 ? "#ffffff" : "#ffd23f", up(C, 1.6 + k * 0.25), (c - a2) * D, { life: k < 2 ? 0.8 : 1.6, size: k < 2 ? 0.7 : 1.1 }); FX.burst(up(C, 0.5), (c - b2) * D, { count: 8, radius: 0.5, color: "#ffffff", life: 0.5 }); FX.confetti(up(C, 0.5), (c - a2) * D, { count: 45, power: 0.9, seed: 50 + k * 9 }); });
      FX.ring(C, (c - 0.05) * D, col, { max: 6 });

    },

    
    tamborileo(x, c) {
      const { D, J, seat, col } = x, ctr = baseCenter(seat), rest = new V3(xe.dieX, 0.15, 0), mad = smooth(seg(c, 0.3, 0.9)), t2 = c * D;
      for (let k = 0; k < 16; k++) cue("tap", 0.05 + k * 0.055);
      cue("pop", 0.52); cue("yawn", 0.7);
      eachHome(x, (p, k, b) => {
        const beat = t2 * (5 + 3 * mad) + k * 0.7, tap = Math.max(0, sin(beat * PI));
        p.rotation.z = (k % 2 ? 1 : -1) * 0.1 * tap * J; p.position.y += 0.015 * tap; p.rotation.x = 0.06;
        tint(p, "#ff3b30", 0.2 * mad);
        face(p, { lx: sin(now() * 1.3 + k) > 0 ? 0.9 : -0.2, ly: 0.1, open: 0.55 - 0.15 * mad, mouth: "flat", noBlink: true });
        const v = (t2 * 0.9 + k * 0.25) % 1; FX.text(locKey("tic"), "#ffffff", b.clone().add(new V3(0.14, 0.12 + v * 0.12, 0.1)), v * 0.7, { life: 0.7, size: 0.22, tilt: 0.1 });
      });
      FX.text(locKey("¡Te toca!"), col, up(rest, 0.85 + 0.05 * sin(now() * 6)), (c - 0.04) * D, { hold: true, size: 0.6 });
      let idx = 0;
      for (let k = 1; k < me; k++) {
        const s2 = (seat + k) % me, p = pawns[s2 * 4], q = idx++, t0 = 0.5 + q * 0.07, pop = elastic(seg(c, t0, t0 + 0.12)), tw = (c - t0) * D;
        x.busy.add(p); cue("click", t0 + 0.1);
        if (pop <= 0) { face(p, lookAt(p, up(ctr, 0.3))); continue; }
        const look = sin(tw * 2.2) > 0.2;
        show(watches[q], onPawn(p, 0.02, 0.31, 0.2), p.rotation.y, pop * 0.9, -0.5, sin(tw * 30) * 0.15 * (look ? 0 : 1)); watches[q].userData.needle.rotation.z = -now() * 6;
        p.rotation.x = look ? 0 : 0.2;
        face(p, look ? { ...lookAt(p, up(ctr, 0.3)), open: 0.5, mouth: "flat", noBlink: true } : { ly: -1, lx: 0.1, open: 0.7, mouth: "flat", noBlink: true });
        if (q === 0) FX.text(locKey("¿Para hoy?"), colors[s2], up(p.position, 0.9), tw - 0.3, { life: 1.6, size: 0.55 });
        if (q === 1) FX.text(locKey("tic, tac…"), "#ffffff", up(p.position, 0.85), tw - 0.5, { life: 1.4, size: 0.42 });
      }

    },
    mosca(x, c) {
      const { D, J, mover: p, seat, piece } = x, b = cell(seat, -1, piece), yaw = camYaw(b), t2 = c * D;
      x.busy.add(p); park(p, b, yaw);
      [0.02, 0.14, 0.4, 0.7, 0.8].forEach((tm) => cue("buzz", tm)); cue("whoosh", 0.64); cue("clap", 0.66); cue("bonk", 0.665); cue("sad", 0.9);
      const head = () => onPawn(p, 0, 0.425, 0), nose = () => onPawn(p, 0, 0.3, 0.125);
      const orbit = (rad, hh, sp) => up(b, 0.36 + hh + sin(t2 * 11) * 0.05).add(new V3(cos(t2 * sp) * rad, 0, sin(t2 * sp) * rad));
      let fp, landed = false;
      if (c < 0.24) fp = orbit(0.26, 0.05, 7);
      else if (c < 0.28) fp = orbit(0.26, 0.05, 7).lerp(head(), smooth(seg(c, 0.24, 0.28)));
      else if (c < 0.38) { fp = head(); landed = true; }
      else if (c < 0.46) fp = head().lerp(orbit(0.22, 0.15, 9), smooth(seg(c, 0.38, 0.42)));
      else if (c < 0.5) fp = orbit(0.22, 0.15, 9).lerp(nose(), smooth(seg(c, 0.46, 0.5)));
      else if (c < 0.645) { fp = nose(); landed = true; }
      else if (c < 0.86) fp = nose().lerp(orbit(0.3, 0.3, 6), smooth(seg(c, 0.645, 0.68)));
      else if (c < 0.9) fp = orbit(0.3, 0.3, 6).lerp(head(), smooth(seg(c, 0.86, 0.9)));
      else { fp = head(); landed = true; }
      
      if (c < 0.28) face(p, { ...lookAt(p, fp), open: 1.1 });
      else if (c < 0.38) face(p, { ly: 1, lx: 0, open: 1.1, pupil: 0.8, mouth: "flat", noBlink: true });
      else if (c < 0.46) { p.rotation.y = yaw + sin((c - 0.38) * D * 30) * 0.5 * J; face(p, { open: 0.2, mouth: "flat", noBlink: true }); }
      else if (c < 0.58) face(p, { ...lookAt(p, fp), ly: -0.5, pupil: 0.55, open: 1.2, mouth: "flat", noBlink: true });
      else if (c < 0.66) { const w = seg(c, 0.58, 0.66); p.rotation.z = -0.12 * sin(w * PI); face(p, { ly: -0.5, pupil: 0.55, open: 0.7, mouth: "flat", noBlink: true }); const from = onPawn(p, 0.26, 0.42, 0.05), to = onPawn(p, 0.02, 0.3, 0.14); hand(0, from.clone().lerp(to, easeIn(seg(w, 0.6, 1))), colorOf(p), 1.3 * smooth(w * 3)); }
      else if (c < 0.86) { const th = (c - 0.66) * D; squash(p, 0.4 * Math.exp(-th * 5) * abs(cos(th * 13))); p.rotation.z = sin(now() * 5) * 0.12 * J; face(p, { lx: cos(now() * 9), ly: sin(now() * 9), mouth: "o", noBlink: true }); orbitStars(b, 0.55, 0.18); if (th < 0.25) hand(0, onPawn(p, 0.02, 0.3, 0.14), colorOf(p), 1.3 * (1 - th / 0.25)); }
      else { const k = smooth(seg(c, 0.88, 0.95)); p.scale.set(1 + 0.04 * k, 1 - 0.08 * k, 1 + 0.04 * k); face(p, { ly: 0.6 * (1 - k) - 0.4 * k, open: 0.5, mouth: "sad" }); FX.puff(onPawn(p, 0, 0.26, 0.18 + k * 0.1), 0.04 + k * 0.05, 0.4 * pulse(c, 0.9, 0.98)); }
      show(fly, fp, landed ? yaw : t2 * 7, 1); fly.userData.wings.forEach((w, k) => { w.rotation.z = (k ? 1 : -1) * (landed ? 0.2 : 0.3 + 0.9 * abs(sin(now() * 60))); });
      const th = (c - 0.66) * D;
      if (th >= 0) { FX.text(locKey("¡PAF!"), "#ff5a3c", up(b, 1), th, { life: 0.9, size: 0.9 }); FX.burst(up(b, 0.32), th, { count: 8, radius: 0.4 }); th < 0.4 && (Re += 0.05 * J * Math.exp(-th * 10)); }
      FX.text(locKey("bzzz"), "#ffffff", up(fp, 0.2), (c - 0.03) * D, { life: 0.9, size: 0.35, tilt: 0.2 });
      FX.text(locKey("bzz jiji"), "#ffffff", up(fp, 0.2), (c - 0.72) * D, { life: 1.1, size: 0.38, tilt: 0.2 });
      for (const q of x.team) if (q !== p) face(q, { ...lookAt(q, fp), mouth: c > 0.66 && c < 0.86 ? "o" : "smile" });

    },
  });

  
  
  const bonk = (_, c, tH = 0.44) => {
    const { mover: m, P, V, dir, yawV, J } = _;
    if (c < 0.3) return approach(_, c);
    const v = c < tH ? easeIn(seg(c, 0.36, tH)) : 1 - easeOut(seg(c, tH, tH + 0.08)), sq2 = c < 0.36 ? smooth(seg(c, 0.3, 0.36)) * 0.3 : 0;
    m.position.copy(P).addScaledVector(dir, 0.17 * v); m.rotation.set(0.5 * v * J, yawV, 0); squash(m, sq2);
    face(m, { ...lookAt(m, up(V, 0.3)), open: c < tH ? 0.5 : 1, mouth: c < tH ? "flat" : "smile", noBlink: true });
    cue("whoosh", 0.37); cue("bonk", tH);
  };
  const hitFx = (_, c, tH, word, color = "#ff5a3c") => { const th = (c - tH) * _.D; if (th < 0) return; FX.text(word, color, up(_.V, 1), th, { life: 1, size: 0.95 }); FX.burst(up(_.V, 0.3), th, { count: 10, radius: 0.7 }); FX.ring(_.V, th, _.col, { max: 4 }); flash(_.V, th, _.col); th < 0.5 && (Re += 0.07 * _.J * Math.exp(-th * 9)); };
  const idleAt = (_, pos, extra = {}) => { park(_.mover, pos, _.yawV); face(_.mover, extra); };

  Object.assign(actions, {
    futbol(_, c) {
      const { mover: m, victim: v, V, P, VB, yawV, dir, D, J } = _, tK = 0.47, tG = 0.74, back = dirTo(V, VB);
      cue("pop", 0.31); cue("whoosh", 0.44); cue("bonk", tK); cue("goal", tG); cue("land", tG + 0.02);
      const gs = backOut(seg(c, 0.3, 0.4)) * (1 - smooth(seg(c, 0.94, 1))), bulge = c > tG ? Math.exp(-(c - tG) * D * 5) : 0;
      show(goal, VB.clone().addScaledVector(back, 0.26).setY(0.16), yawTo(VB, V), gs); goal.userData.net.position.z = -0.16 - 0.14 * bulge;
      if (c < 0.3) approach(_, c);
      else if (c < 0.42) { const k = smooth(seg(c, 0.3, 0.42)); m.position.copy(P).addScaledVector(dir, -0.12 * k); m.rotation.set(-0.4 * k * J, yawV, 0); face(m, { ...lookAt(m, up(V, 0.3)), open: 0.45, mouth: "flat", noBlink: true }); }
      else if (c < 0.54) { const k = sin(seg(c, 0.42, 0.54) * PI); m.position.copy(P).addScaledVector(dir, -0.12 + 0.3 * clamp(k)); m.rotation.set(0.6 * clamp(k) * J, yawV, 0); squash(m, -0.15 * clamp(k)); face(m, { open: 1.2, mouth: "o", noBlink: true }); }
      else if (c < 0.82) { const t2 = (c - 0.54) * D; idleAt(_, P, c > tG ? { open: 0.3, mouth: "o", mouthSize: 1.5, noBlink: true } : { ...lookAt(m, v.position), open: 1.2 }); m.position.y += abs(sin(t2 * 9)) * 0.07 * J * (c > tG ? 1 : 0.15); }
      else if (c < 0.9) hopTo(_, c, 0.82, 0.9, P, V); else celebrate(_, c, 0.9);
      if (c < tK) scared(_, c, 0.34); else if (c < tG) flyHome(_, c, V, tK, tG, { height: 1.15, spinX: 6, spinZ: 0 }); else dizzyHome(_, c, tG);
      hitFx(_, c, tK, locKey("¡Pum!"));
      const tg = (c - tG) * D;
      if (tg >= 0) { FX.text(locKey("¡Goool!"), "#ffd23f", up(VB, 1.15), tg, { life: 1.8, size: 1.2 }); FX.confetti(up(VB, 0.4), tg, { count: 50, power: 0.7, seed: 21 }); }

    },
    tirachinas(_, c) {
      const { mover: m, victim: v, V, P, VB, yawV, D, J, col } = _, L = dirTo(V, VB), yawL = Math.atan2(L.x, L.z), Bm = V.clone().addScaledVector(L, -0.3), tP = 0.44, tR = 0.66, tH = 0.86;
      cue("pop", 0.31); cue("stretch", tP); cue("stretch", 0.54); cue("snap", tR); cue("whoosh", tR + 0.01); cue("land", tH);
      const fs2 = backOut(seg(c, 0.3, 0.38)) * (1 - smooth(seg(c, 0.74, 0.82)));
      show(fork, V.clone().setY(0.16), yawL, fs2); fork.updateMatrixWorld(true);
      const tips = [-1, 1].map((sx) => fork.localToWorld(new V3(sx * 0.13, 0.41, 0)));
      const pull = c < tP ? 0 : c < tR ? easeOut(seg(c, tP, tR - 0.04)) : 0, tense = c > 0.58 && c < tR ? sin(now() * 70) * 0.006 : 0;
      const vp = V.clone().addScaledVector(L, -0.5 * pull + tense);
      if (c < 0.3) approach(_, c);
      else if (c < tP) { hopArc(m, P, Bm, seg(c, 0.34, tP), 0.2); m.rotation.set(0, lerpAngle(yawV, yawL, seg(c, 0.34, tP)), 0); face(m, { open: 1.1, mouth: "smile", noBlink: true }); }
      else if (c < tR) { m.position.copy(Bm).addScaledVector(L, -0.5 * pull + tense); m.rotation.set(-0.35 * pull * J, yawL, 0); face(m, { open: 0.35, mouth: "flat", noBlink: true }); pull > 0.6 && sweat(m.position, c * D, 2); }
      else if (c < 0.78) { const t2 = (c - tR) * D; m.position.copy(Bm).addScaledVector(L, -0.5); m.rotation.set(-1.4 * easeOut(t2 / 0.2), yawL, 0); settle(m, t2, 0.8); face(m, { open: 1.2, mouth: "o", noBlink: true }); }
      else if (c < 0.9) { const w = seg(c, 0.78, 0.9); hopArc(m, Bm.clone().addScaledVector(L, -0.5), V, w, 0.3 * J + 0.05); m.rotation.set(-1.4 * (1 - easeOut(w * 2)), lerpAngle(yawL, yawV, w), 0); face(m, { open: 1.1, mouth: "o", noBlink: true }); }
      else landPose(m, c, 0.9, V, yawV);
      if (c < tP) scared(_, c, 0.34);
      else if (c < tR) { v.position.copy(vp); v.rotation.set(-0.3 * pull, yawL, 0); v.scale.set(1 - 0.12 * pull, 1 - 0.05 * pull, 1 + 0.3 * pull); face(v, { open: 1.4, size: 1.2, pupil: 0.45, mouth: "o", noBlink: true }); }
      else if (c < tH) flyHome(_, c, V.clone().addScaledVector(L, -0.5), tR, tH, { height: 0.9, spinX: 5, spinZ: 0 });
      else dizzyHome(_, c, tH);
      if (c > 0.36 && c < tR + 0.03) { const mid = c < tR ? up(v.position, 0.2) : tips[0].clone().lerp(tips[1], 0.5).addScaledVector(L, 0.12 * sin((c - tR) * D * 60)); tips.forEach((tp, k) => rod(k, tp, mid, 0.008, "#c0392b")); }
      const tr2 = (c - tR) * D;
      if (tr2 >= 0) { FX.text(locKey("¡Fiuuu!"), "#ffd23f", up(V, 1.05), tr2, { life: 1.1, size: 0.95 }); FX.burst(up(V, 0.4), tr2, { count: 8, radius: 0.5, color: "#ffffff" }); tr2 < 0.4 && (Re += 0.05 * J * Math.exp(-tr2 * 10)); }
      FX.ring(V, (c - 0.9) * D, col);

    },
    aspiradora(_, c) {
      const { mover: m, victim: v, V, P, VB, yawV, D, J, col } = _, toV = dirTo(VB, V), M2 = VB.clone().addScaledVector(toV, 0.55).setY(0.16), yawM = yawTo(M2, V), S = M2.clone().addScaledVector(toV, 0.2).setY(0.36), Nz = V.clone().addScaledVector(toV, -0.24).setY(0.46);
      const tS = 0.46, tI = 0.58, tT = 0.72, tO = 0.8, tL = 0.9;
      cue("pop", 0.31); cue("suck", tS); cue("gulp", tI); cue("rumble", tT); cue("spit", tO); cue("land", tL);
      const vs = backOut(seg(c, 0.3, 0.38)) * (1 - smooth(seg(c, 0.92, 1))), bulge = pulse(c, tT - 0.02, tO + 0.02), run = c > tS && c < tO ? sin(now() * 50) * 0.004 : 0;
      show(vacuum, M2.clone().add(new V3(run, 0, run)), yawM, vs); vacuum.userData.body.scale.set(1 + 0.3 * bulge, 1 + 0.35 * bulge, 1 + 0.2 * bulge);
      const ext = c < tO ? easeOut(seg(c, 0.36, 0.45)) : 1 - smooth(seg(c, tO, 0.9)), end = S.clone().lerp(Nz, ext);
      if (ext > 0.02 && vs > 0.5) { rod(0, S, end, 0.03, "#5d5560"); rod(1, end, end.clone().addScaledVector(toV, 0.07 * ext).setY(end.y - 0.05), 0.05, "#c9d3de"); }
      if (c < tS) scared(_, c, 0.36);
      else if (c < tI) { const w = seg(c, tS, tI), k = easeIn(w); v.position.copy(V).lerp(Nz.clone().setY(Nz.y - 0.2), k); v.rotation.set(0, _.yawP + w * PI * 5, 0.3 * sin(w * 20)); v.scale.set(Math.max(0.02, 1 - 0.85 * k), Math.max(0.02, (1 + 0.5 * sin(w * PI)) * (1 - 0.8 * k)), Math.max(0.02, 1 - 0.85 * k)); face(v, { open: 1.4, size: 1.2, pupil: 0.4, mouth: "o", noBlink: true }); for (let q = 0; q < 5; q++) { const s2 = (now() * 2 + q / 5) % 1, ang = q * 1.26 + now() * 4; FX.puff(V.clone().lerp(Nz, s2).add(new V3(cos(ang) * 0.14 * (1 - s2), 0.2 + sin(ang) * 0.1 * (1 - s2), sin(ang) * 0.14 * (1 - s2))), 0.05 * (1 - s2) + 0.02, 0.5); } }
      else if (c < tO) { v.visible = false; if (c < tT) hand(0, Nz.clone().lerp(S, seg(c, tI, tT)), colorOf(v), 2.1); }
      else if (c < tL) { const w = seg(c, tO, tL); hopArc(v, up(M2, 0.3), VB, w, 0.5); v.rotation.set(w * PI * 4, 0, 0); v.scale.setScalar(0.3 + 0.7 * easeOut(w)); tint(v, "#9a94a3", 0.6); face(v, { open: 1.3, mouth: "o", noBlink: true }); }
      else { dizzyHome(_, c, tL); tint(v, "#9a94a3", 0.6 * (1 - smooth(((c - tL) * D) / 0.8))); }
      if (c < 0.3) approach(_, c);
      else if (c < 0.62) idleAt(_, P, c > tS ? { ...lookAt(m, v.visible ? up(v.position, 0.2) : S), open: 1.3, mouth: "o", noBlink: true } : { ...lookAt(m, M2), open: 1.2 });
      else if (c < 0.7) hopTo(_, c, 0.62, 0.7, P, V); else celebrate(_, c, 0.7);
      const ts = (c - tS) * D, to = (c - tO) * D;
      FX.text(locKey("¡Fuuup!"), "#bfefff", up(V, 1.05), ts, { life: 1.1, size: 0.9 });
      if (to >= 0) { FX.text(locKey("¡Ptu!"), "#c9c3d6", up(M2, 0.9), to, { life: 0.9, size: 0.7 }); FX.dust(up(M2, 0.3), to, { count: 10, size: 0.16, spread: 0.45, color: "#c9c3d6", seed: 61 }); }
      flash(V, ts, col);

    },
    abduccion(_, c) {
      const { mover: m, victim: v, V, P, VB, yawV, D, J, col } = _, HY = 1.3, tA = 0.26, tB = 0.38, tU = 0.56, tM = 0.6, tV = 0.74, tD = 0.88;
      cue("ufo", tA); cue("ufo", tB); cue("pop", tU); cue("whoosh", tM); cue("ufo", tV); cue("land", tD); cue("whoosh", tD + 0.01);
      const air = (pos) => pos.clone().setY(HY);
      let up2;
      if (c < tB) { up2 = air(V); up2.y += 3.2 * (1 - easeOut(seg(c, tA, tB))); }
      else if (c < tM) up2 = air(V);
      else if (c < tV) up2 = air(V).lerp(air(VB), easeIO(seg(c, tM, tV)));
      else if (c < tD) up2 = air(VB);
      else { const w = easeIn(seg(c, tD, 0.98)); up2 = air(VB); up2.y += 4 * w; up2.x += 2.5 * w; }
      const beamOn = (c > tB && c < tU + 0.02) || (c > tV && c < tD);
      show(ufo, up2.add(new V3(sin(now() * 2) * 0.03, sin(now() * 3.1) * 0.02, 0)), now() * 2.5, c > tA ? 1 : 0, 0, sin(now() * 2.3) * 0.08 + (c > tM && c < tV ? -0.25 * sin(seg(c, tM, tV) * PI) : 0));
      ufo.userData.beam.visible = beamOn; beamMat.opacity = 0.3 + 0.1 * sin(now() * 18);
      if (c < tB) scared(_, c, 0.3);
      else if (c < tU) { const w = seg(c, tB, tU); park(v, V, _.yawP + w * PI * 3); v.position.y += (HY - 0.45) * easeIO(w); v.rotation.z = sin(now() * 6) * 0.2; v.scale.setScalar(1 - 0.7 * easeIn(w)); face(v, { open: 1.4, size: 1.2, pupil: 0.45, mouth: "o", ly: 0.6, noBlink: true }); tint(v, "#b6ffbf", 0.35); }
      else if (c < tV) v.visible = false;
      else if (c < tD) { const w = seg(c, tV, tD); park(v, VB, w * PI * 3); v.position.y += (HY - 0.45) * (1 - easeIO(w)); v.scale.setScalar(0.3 + 0.7 * easeOut(w)); face(v, { open: 1.3, pupil: 0.5, mouth: "o", noBlink: true }); tint(v, "#b6ffbf", 0.35 * (1 - w)); }
      else dizzyHome(_, c, tD);
      if (c < 0.3) approach(_, c);
      else if (c < 0.62) { idleAt(_, P, { ...lookAt(m, ufo.position), open: 1.35, size: 1.1, mouth: "o", noBlink: true }); m.rotation.x = -0.2 * J; }
      else if (c < 0.7) hopTo(_, c, 0.62, 0.7, P, V); else landPose(m, c, 0.7, V, yawV);
      if (c >= 0.7) face(m, { ...lookAt(m, ufo.position), open: 1.2, mouth: "o" });
      if (beamOn) for (let q = 0; q < 4; q++) { const s2 = (now() * 1.2 + q / 4) % 1, ang = q * 1.6 + now() * 3, base2 = c < tM ? V : VB; FX.star(base2.clone().add(new V3(cos(ang) * 0.15, 0.1 + s2 * 0.9, sin(ang) * 0.15)), 0.06, ang, 1 - s2, "#b6ffbf"); }
      FX.text(locKey("¡Abducida!"), "#b6ffbf", up(V, 1.75), (c - tB - 0.04) * D, { life: 1.2, size: 0.85 });
      FX.ring(V, (c - tB) * D, "#b6ffbf", { max: 4 }); FX.ring(VB, (c - tV) * D, "#b6ffbf", { max: 4 }); flash(V, (c - tB) * D, col);

    },
    estornudo(_, c) {
      const { mover: m, victim: v, V, P, VB, yawV, dir, D, J, col } = _, inh = [0.3, 0.37, 0.44], tZ = 0.52, tH = 0.8;
      inh.forEach((tm) => cue("stretch", tm)); cue("achu", tZ); cue("land", tH);
      if (c < 0.3) approach(_, c);
      else if (c < tZ) { let k = 0, amt = 0; inh.forEach((tm, q) => { if (c >= tm) { k = q + 1; amt = sin(seg(c, tm, tm + 0.07) * PI * 0.5); } }); const big = (k - 1 + amt) / 3; park(m, P, yawV); m.rotation.x = -0.45 * big * J; m.scale.setScalar(1 + 0.25 * big * J); face(m, { open: 0.5 - 0.3 * big, ly: 0.7, mouth: "o", mouthSize: 0.6 + 1.6 * big, noBlink: true }); }
      else if (c < 0.6) { const t2 = (c - tZ) * D, k = Math.exp(-t2 * 5); m.position.copy(P).addScaledVector(dir, 0.1 * k); m.rotation.set(0.75 * k * J, yawV, 0); squash(m, 0.25 * k); face(m, { open: 0.05, mouth: "o", mouthSize: 2.2, noBlink: true }); }
      else if (c < 0.82) { const t2 = (c - 0.6) * D; idleAt(_, P, { lx: -0.8, open: 0.7, mouth: "flat" }); m.position.y += abs(sin(t2 * 7)) * 0.012; hand(0, onPawn(m, 0.03 + 0.03 * sin(t2 * 12), 0.3, 0.14), colorOf(m), 0.8); FX.text(locKey("snif"), "#ffffff", up(P, 0.8), t2 - 0.1, { life: 1, size: 0.4 }); }
      else if (c < 0.9) hopTo(_, c, 0.82, 0.9, P, V); else celebrate(_, c, 0.9);
      inh.forEach((tm, q) => FX.text([locKey("a…"), locKey("aa…"), locKey("¡AAA…")][q], "#ffffff", up(P, 0.85 + q * 0.08), (c - tm) * D, { life: 0.5, size: 0.4 + q * 0.12 }));
      if (c < tZ) scared(_, c, 0.44); else if (c < tH) flyHome(_, c, V, tZ + 0.01, tH, { height: 0.6, spinX: 3, spinZ: 3 }); else dizzyHome(_, c, tH);
      const tz = (c - tZ) * D;
      if (tz >= 0) {
        FX.text(locKey("¡ACHÚ!"), "#8dff8a", up(P, 1.15), tz, { life: 1.2, size: 1.15 }); tz < 0.6 && (Re += 0.11 * J * Math.exp(-tz * 8));
        if (tz < 0.7) for (let q = 0; q < 14; q++) { const s2 = tz / 0.7, sp = rnd(q * 3.7) - 0.5, hh = rnd(q * 9.1); FX.puff(up(P, 0.3).addScaledVector(dir, 0.15 + s2 * (0.9 + hh * 0.9)).add(new V3(sp * s2 * 0.9 * dir.z, hh * 0.3 * s2, -sp * s2 * 0.9 * dir.x)), 0.06 + s2 * 0.12, (1 - s2) * 0.7, q % 3 ? "#ffffff" : "#c9ffb5"); }
        FX.ring(V, tz - 0.03, col, { max: 5 }); flash(V, tz, col);
      }
      FX.text(locKey("¡Salud!"), "#ffffff", up(VB, 0.95), (c - tH - 0.03) * D, { life: 1.1, size: 0.5 });

    },
    pastel(_, c) {
      const { mover: m, victim: v, V, P, VB, yawV, dir, D, J, col } = _, tT = 0.46, tS = 0.52, tW = 0.64, tH = 0.93, yawHome = yawTo(V, VB);
      cue("pop", 0.31); cue("whoosh", tT); cue("splat", tS); for (let q = 0; q < 7; q++) cue("tap", tW + ((tH - tW) * (q + 0.5)) / 7); cue("sad", tW - 0.03);
      const hold = up(P, 0.5);
      if (c > 0.3 && c < tS) { const fly2 = seg(c, tT, tS), target = up(V, 0.31).addScaledVector(dir, -0.1), at = fly2 > 0 ? hold.clone().lerp(target, fly2) : hold.clone(); at.y += arc(fly2) * 0.2 - (fly2 > 0 ? 0 : 0.06 * smooth(seg(c, 0.4, tT))); show(cake, at, yawV, elastic(seg(c, 0.3, 0.42)), fly2 > 0 ? PI / 2 * fly2 : 0); }
      if (c < 0.3) approach(_, c);
      else if (c < tT) { const w = smooth(seg(c, 0.4, tT)); idleAt(_, P, { ...lookAt(m, up(V, 0.3)), open: 0.4, mouth: "smile", mouthSize: 1.3, noBlink: true }); m.rotation.x = -0.3 * w * J; }
      else if (c < tS) { idleAt(_, P, { open: 1.2, mouth: "o", noBlink: true }); m.rotation.x = 0.45 * sin(seg(c, tT, tS) * PI) * J; }
      else if (c < 0.74) { const t2 = (c - tS) * D; idleAt(_, P, { open: 0.2, mouth: "o", mouthSize: 1.5, noBlink: true }); m.position.y += abs(sin(t2 * 10)) * 0.05 * J; m.rotation.z = sin(t2 * 10) * 0.1; FX.text(locKey("jajaja"), "#fff36b", up(P, 0.9), t2 - 0.1, { life: 1.2, size: 0.5, tilt: 0.12 }); }
      else if (c < 0.82) hopTo(_, c, 0.74, 0.82, P, V); else celebrate(_, c, 0.82);
      if (c < tS) scared(_, c, 0.42);
      else {
        const walking = c >= tW && c < tH, w = seg(c, tW, tH), t2 = (c - tS) * D;
        if (c < tW) { park(v, V, _.yawP); squash(v, 0.25 * Math.exp(-t2 * 6) * cos(t2 * 20)); v.rotation.x = -0.25 * Math.exp(-t2 * 4); }
        else if (walking) { park(v, V.clone().lerp(VB, w), lerpAngle(_.yawP, yawHome, smooth(seg(c, tW, tW + 0.04)))); v.position.y += abs(sin(w * PI * 7)) * 0.045; v.rotation.x = 0.18; v.rotation.z = sin(w * PI * 7) * 0.06; }
        else { park(v, VB, lerpAngle(yawHome, camYaw(VB), smooth(seg(c, tH, 0.98)))); v.rotation.x = 0.12; }
        face(v, { open: 0.08, mouth: "sad", noBlink: true });
        show(splat, onPawn(v, 0, 0.31, 0.09), v.rotation.y, 1 + 0.25 * Math.exp(-t2 * 6), v.rotation.x);
        for (let q = 0; q < 3; q++) { const s2 = (t2 * 1.1 + q / 3) % 1; FX.puff(onPawn(v, (q - 1) * 0.05, 0.26 - s2 * 0.24, 0.12), 0.035, 0.95 * (1 - s2), "#fffaf0"); }
        if (walking) for (let q = 1; q <= 5; q++) { const s2 = w - q * 0.07; s2 > 0 && FX.puff(V.clone().lerp(VB, s2).setY(0.2), 0.05, 0.7 - q * 0.1, "#fffaf0"); }
      }
      const ts = (c - tS) * D;
      if (ts >= 0) { FX.text(locKey("¡PLAF!"), "#ff9ec4", up(V, 1.05), ts, { life: 1.1, size: 1 }); FX.dust(up(V, 0.3), ts, { count: 12, size: 0.14, spread: 0.5, color: "#fffaf0", seed: 71 }); FX.burst(up(V, 0.35), ts, { count: 8, radius: 0.5, color: "#ff9ec4" }); flash(V, ts, col); ts < 0.4 && (Re += 0.05 * J * Math.exp(-ts * 10)); }

    },

    
    drama(_, c) {
      const { mover: m, victim: v, V, P, VB, yawV, dir, D, J, col } = _, tH = 0.44, tF = 0.62, tD = 0.72, tG = 0.78, tE = 0.94, yc = camYaw(V);
      cue("sad", 0.52); cue("land", tD); cue("wii", tG); cue("land", tE);
      if (c < 0.52) bonk(_, c, tH);
      else if (c < 0.82) { idleAt(_, P, c > tF ? { lx: 0.2, ly: 0.1, open: 0.45, mouth: "flat", noBlink: true } : { ...lookAt(m, up(V, 0.4)), open: 1.1, mouth: "flat" }); if (c > tF) m.rotation.y = lerpAngle(yawV, camYaw(P), smooth(seg(c, tF, tF + 0.05))); }
      else if (c < 0.9) hopTo(_, c, 0.82, 0.9, P, V); else landPose(m, c, 0.9, V, yawV);
      FX.text(locKey("¿En serio?"), "#ffffff", up(P, 0.9), (c - tF - 0.04) * D, { life: 1.4, size: 0.5 });
      const lit = smooth(seg(c, 0.48, 0.54)) * (1 - smooth(seg(c, tG, tG + 0.06)));
      if (lit > 0.01) spotOn(V, lit);
      if (c < tH) scared(_, c, 0.36);
      else if (c < 0.5) { const t2 = (c - tH) * D; park(v, V.clone().addScaledVector(dir, 0.05 * easeOut(t2 / 0.15)), _.yawP); squash(v, 0.2 * Math.exp(-t2 * 7) * cos(t2 * 20)); face(v, { open: 1.4, size: 1.2, pupil: 0.5, mouth: "o", noBlink: true }); }
      else if (c < tF) { const w = seg(c, 0.5, tF); park(v, V.clone().addScaledVector(dir, 0.05), lerpAngle(_.yawP, yc, smooth(w * 1.5))); v.rotation.x = -0.3 * smooth(w) * J; v.rotation.z = sin(w * PI * 2) * 0.12; face(v, { open: 0.3, ly: 0.8, mouth: "o", mouthSize: 1.3, noBlink: true }); hand(0, onPawn(v, 0.06, 0.4, 0.085), colorOf(v), smooth(w * 4)); }
      else if (c < tD) { const w = easeIn(seg(c, tF, tD)); park(v, V.clone().addScaledVector(dir, 0.05), yc); v.rotation.x = -0.3 - 1.2 * w; face(v, { open: 0.15, mouth: "o", noBlink: true }); hand(0, onPawn(v, 0.06, 0.4, 0.085), colorOf(v), 1 - w); }
      else if (c < tG) { const t2 = (c - tD) * D; park(v, V.clone().addScaledVector(dir, 0.05), yc); v.rotation.x = -1.5; settle(v, t2, 0.8); const peek = t2 > 0.2 && sin(t2 * 9) > 0.3; face(v, { open: peek ? 0.6 : 0.06, lx: peek ? 0.9 : 0, mouth: "flat", noBlink: true }); FX.dust(V, t2, { count: 8, size: 0.14, seed: 73 }); }
      else if (c < tE) { const w = seg(c, tG, tE), at = V.clone().addScaledVector(dir, 0.05).lerp(VB, smooth(w)); at.y += arc(w) * (1.1 * J + 0.3); park(v, at, yc + w * PI * 2); v.rotation.x = -1.5; face(v, { open: 0.06, mouth: "o", noBlink: true }); for (let q = 1; q <= 5; q++) FX.star(up(at, 0.1 - q * 0.04).add(new V3(sin(now() * 5 + q) * 0.1, 0, cos(now() * 4 + q) * 0.1)), 0.08, now() * 3 + q, 1 - q / 6, "#ffffff"); }
      else { const t2 = (c - tE) * D; park(v, VB, camYaw(VB)); v.rotation.x = -1.5; settle(v, t2, 0.8); face(v, { open: sin(t2 * 6) > 0.6 ? 0.5 : 0.06, mouth: "flat", noBlink: true }); FX.dust(VB, t2, { count: 8, size: 0.14, seed: 75 }); }
      hitFx(_, c, tH, locKey("toc"), "#ffffff");
      FX.text(locKey("¡Ay de mí!"), "#ff8fd0", up(V, 1.1), (c - 0.52) * D, { life: 1.3, size: 0.85 });
      FX.text(locKey("¡Me muero!"), "#ff8fd0", up(V, 0.9), (c - tF - 0.02) * D, { life: 1.1, size: 0.6 });

    },
    venganza(_, c) {
      const { mover: m, victim: v, V, P, VB, yawV, D, J, col } = _, tH = 0.44, tL = 0.62, yawBack = yawTo(VB, V);
      cue("land", tL); cue("rumble", 0.72); cue("zap", 0.8); cue("gulp", 0.86);
      const evil = smooth(seg(c, 0.7, 0.82));
      if (c < 0.5) bonk(_, c, tH); else if (c < 0.58) hopTo(_, c, 0.5, 0.58, P, V); else if (c < 0.72) celebrate(_, c, 0.58);
      else { const t2 = (c - 0.72) * D, k = smooth(t2 / 0.4); park(m, V, lerpAngle(yawV, yawTo(V, VB), k)); m.position.x += sin(now() * 70) * 0.004 * evil * J; m.scale.set(1 - 0.04 * evil, 1 + 0.06 * evil, 1 - 0.04 * evil); face(m, { ...lookAt(m, up(VB, 0.3)), open: 1.4, size: 1.1, pupil: 0.45, mouth: "flat", noBlink: true }); sweat(V, t2, 2); FX.text(locKey("glup"), "#a9c1ff", up(V, 0.9), t2 - 0.5, { life: 1.2, size: 0.5 }); }
      if (c < tH) scared(_, c, 0.36);
      else if (c < tL) flyHome(_, c, V, tH, tL);
      else {
        const t2 = (c - tL) * D; park(v, VB, lerpAngle(camYaw(VB), yawBack, smooth(seg(c, 0.66, 0.78)))); settle(v, t2, 1.6);
        v.scale.multiplyScalar(1 + 0.12 * evil); tint(v, "#c2121f", 0.55 * evil * (0.85 + 0.15 * sin(now() * 14)));
        face(v, { ...lookAt(v, up(V, 0.3)), open: 0.38, pupil: 0.6, mouth: "flat", noBlink: true });
        FX.dust(VB, t2, { count: 8, size: 0.14, seed: 77 });
        if (evil > 0.1) for (const sx of [-1, 1]) for (let q = 0; q < 3; q++) { const s2 = (now() * 2.4 + q / 3 + (sx > 0 ? 0.17 : 0)) % 1; FX.star(onPawn(v, sx * 0.045 + sin(s2 * 9 + q) * 0.012, 0.325 + s2 * 0.13, 0.115), (0.09 - s2 * 0.05) * evil, s2 * 5 + q, 1 - s2, q % 2 ? "#ffd23f" : "#ff5a1f"); }
      }
      dim(evil * 0.9);
      hitFx(_, c, tH, locKey("¡Toma!"));
      FX.text(locKey("Ya verás…"), "#ff3b30", up(VB, 1.1), (c - 0.78) * D, { hold: true, size: 0.9 });
      c > 0.78 && (Re += 0.012 * J * evil);

    },
    fantasmita(_, c) {
      const { mover: m, victim: v, V, P, VB, yawV, D, J, col } = _, tH = 0.44, tL = 0.64, tF = 0.94;
      cue("land", tL); cue("wii", tH + 0.02); cue("pop", 0.68);
      if (c < tH) scared(_, c, 0.36); else if (c < tL) flyHome(_, c, V, tH, tL); else dizzyHome(_, c, tL);
      const tg = (c - tH) * D, alive = c >= tH && c < tF;
      if (alive) {
        const fade = Math.min(1, tg / 0.15) * (1 - smooth(seg(c, 0.8, tF)));
        ghostMat.opacity = 0.8 * fade; ghostEye.opacity = fade;
        const gp = V.clone().add(new V3(sin(now() * 2.5) * 0.06, 0.05 + 0.75 * easeOut(seg(c, tH, tF)), 0));
        show(ghost, gp, camYaw(gp), 1 + 0.1 * sin(now() * 4), 0, sin(now() * 3) * 0.18);
        if (tg > 0.25) hand(0, onPawn(ghost, 0.15, 0.3 + 0.03 * sin(now() * 12), 0.02), "#ffffff", 0.9 * fade);
        FX.text(locKey("buuu…"), "#ffffff", up(gp, 0.6), tg - 0.25, { life: 1.3, size: 0.55, tilt: 0.12 });
        FX.text(locKey("adiós"), "#ffffff", up(gp, 0.6), (c - 0.78) * D, { life: 0.9, size: 0.4, tilt: -0.1 });
      }
      if (c < 0.54) bonk(_, c, tH);
      else if (c < 0.62) hopTo(_, c, 0.54, 0.62, P, V);
      else if (c < 0.68) landPose(m, c, 0.62, V, yawV);
      else if (c < tF) { const t2 = (c - 0.68) * D, jump = t2 < 0.3 ? arc(t2 / 0.3) * 0.25 * J : 0; park(m, V, yawV); m.position.y += jump; m.position.x += sin(now() * 70) * 0.004 * J; m.scale.set(0.92, 1.12, 0.92); face(m, { ...lookAt(m, ghost.position.clone().setY(ghost.position.y + 0.3)), open: 1.5, size: 1.2, pupil: 0.4, mouth: "o", noBlink: true }); FX.text(locKey("¡!"), "#ff5a3c", up(V, 0.85), t2, { life: 0.7, size: 0.55, tilt: 0 }); }
      else { park(m, V, yawV); face(m, { open: 0.5, mouth: "o", mouthSize: 0.7 }); FX.text(locKey("fiu"), "#ffffff", up(V, 0.85), (c - tF) * D, { life: 0.8, size: 0.4 }); }
      hitFx(_, c, tH, locKey("¡Zas!"));

    },
  });


  

  const link = (parent, from, to, th, mat) => { const d = to.clone().sub(from), m = part(parent, new THREE.CylinderGeometry(th, th, d.length(), 5), mat); m.position.copy(from).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(UP, d.clone().normalize()); m.castShadow = false; return m; };
  const balloons = prop((g) => { const str = std("#ffffff"); [["#ff4b4b", -0.09, 0.5], ["#ffc629", 0.09, 0.53], ["#3d7bf2", 0, 0.62]].forEach(([col, bx, by]) => { part(g, new THREE.SphereGeometry(0.085, 14, 10), std(col, { roughness: 0.2, clearcoat: 1 }), bx, by, 0).scale.y = 1.2; link(g, new V3(0, 0, 0), new V3(bx, by - 0.09, 0), 0.003, str); }); });
  const slide = prop((g) => { const ramp = part(g, new THREE.BoxGeometry(0.3, 0.02, 0.92), std("#ffc629"), 0, 0.22, 0); ramp.rotation.x = 0.45; for (const sx of [-1, 1]) { part(g, new THREE.BoxGeometry(0.02, 0.06, 0.92), std("#e8443a"), sx * 0.15, 0.25, 0).rotation.x = 0.45; part(g, new THREE.CylinderGeometry(0.012, 0.012, 0.42, 6), std("#e8443a"), sx * 0.13, 0.21, -0.42); } });
  const box = prop((g) => { part(g, new THREE.BoxGeometry(0.34, 0.46, 0.34), std("#b98a5e", { roughness: 0.9, clearcoat: 0 }), 0, 0.23, 0); part(g, new THREE.PlaneGeometry(0.2, 0.035), new THREE.MeshBasicMaterial({ color: DARK }), 0, 0.31, 0.1705).castShadow = false; });
  const suitcase = prop((g) => { part(g, new RoundedBoxGeometry(0.15, 0.11, 0.06, 2, 0.012), std("#8a5a34"), 0, 0.055, 0); part(g, new THREE.TorusGeometry(0.025, 0.006, 6, 12, PI), std(DARK), 0, 0.11, 0); for (const sx of [-1, 1]) part(g, new THREE.BoxGeometry(0.012, 0.112, 0.062), std("#ffc93c"), sx * 0.045, 0.055, 0); });
  const door = prop((g) => { const w = std(WOOD); for (const sx of [-1, 1]) part(g, new THREE.BoxGeometry(0.03, 0.5, 0.03), w, sx * 0.17, 0.25, 0); part(g, new THREE.BoxGeometry(0.37, 0.03, 0.03), w, 0, 0.515, 0); const leaf = new THREE.Group(); leaf.position.set(-0.155, 0, 0); g.add(leaf); part(leaf, new THREE.BoxGeometry(0.31, 0.49, 0.018), std("#c6553b"), 0.155, 0.245, 0); part(leaf, new THREE.SphereGeometry(0.014, 8, 6), std("#ffc93c"), 0.27, 0.24, 0.016); g.userData.leaf = leaf; });
  const wheel = prop((g) => { const w = new THREE.Group(); w.position.y = 0.118; g.add(w); g.userData.w = w; part(w, new THREE.TorusGeometry(0.1, 0.018, 8, 24), std(DARK), 0, 0, 0).rotation.y = PI / 2; for (let k = 0; k < 3; k++) part(w, new THREE.CylinderGeometry(0.004, 0.004, 0.2, 4), std("#c9d3de"), 0, 0, 0).rotation.x = (k * PI) / 3; part(g, new THREE.CylinderGeometry(0.008, 0.008, 0.1, 6), std("#c9d3de"), 0, 0.17, 0); });
  const antenna = prop((g) => { part(g, new THREE.CylinderGeometry(0.004, 0.004, 0.1, 5), std("#c9d3de"), 0, 0.05, 0); part(g, new THREE.SphereGeometry(0.016, 8, 6), new THREE.MeshBasicMaterial({ color: "#ff3b30" }), 0, 0.105, 0); });
  const shell = prop((g) => { part(g, new THREE.SphereGeometry(0.13, 16, 12), std("#c98a4a"), 0, 0, 0).scale.set(0.75, 1, 1); for (const sx of [-1, 1]) { part(g, new THREE.TorusGeometry(0.07, 0.012, 6, 18), std("#7a4a26"), sx * 0.095, 0, 0).rotation.y = PI / 2; part(g, new THREE.TorusGeometry(0.035, 0.01, 6, 14), std("#7a4a26"), sx * 0.1, 0, 0).rotation.y = PI / 2; } });
  const bush = prop((g) => { const m = std("#3f9a4a", { roughness: 0.9, clearcoat: 0 }); [[0, 0.14, 0, 0.2], [0.13, 0.12, 0.05, 0.15], [-0.13, 0.12, -0.03, 0.15], [0, 0.33, 0, 0.17], [0.08, 0.3, -0.08, 0.13], [-0.07, 0.28, 0.09, 0.13]].forEach(([bx, by, bz, rr]) => part(g, new THREE.SphereGeometry(rr, 12, 10), m, bx, by, bz)); });
  const magnet = prop((g) => { part(g, new THREE.TorusGeometry(0.1, 0.035, 8, 16, PI), std("#e8443a"), 0, 0, 0); for (const sx of [-1, 1]) part(g, new THREE.CylinderGeometry(0.035, 0.035, 0.05, 10), std("#c9d3de", { metalness: 0.7 }), sx * 0.1, -0.025, 0); });
  const kite = prop((g) => { part(g, new THREE.PlaneGeometry(0.26, 0.26), new THREE.MeshStandardMaterial({ color: "#ffc629", side: THREE.DoubleSide }), 0, 0, 0).rotation.z = PI / 4; part(g, new THREE.PlaneGeometry(0.13, 0.13), new THREE.MeshStandardMaterial({ color: "#3d7bf2", side: THREE.DoubleSide }), 0, 0, 0.002).rotation.z = PI / 4; g.userData.tail = [0, 1, 2].map((k) => part(g, new THREE.PlaneGeometry(0.045, 0.045), new THREE.MeshStandardMaterial({ color: ["#ff4b4b", "#3d7bf2", "#ffc629"][k], side: THREE.DoubleSide }), 0, -0.24 - k * 0.08, 0)); });
  const planks = pool(2, (g) => { part(g, new THREE.BoxGeometry(0.15, 0.02, 0.14), std("#d9a46b"), 0, 0, 0); });
  const board = prop((g) => { part(g, new THREE.SphereGeometry(1, 16, 10), std("#2ad1b2", { roughness: 0.2, clearcoat: 1 }), 0, 0, 0).scale.set(0.085, 0.014, 0.3); part(g, new THREE.BoxGeometry(0.012, 0.004, 0.5), std(CREAM), 0, 0.014, 0); });
  const horse = prop((g) => { const m = std("#b07a4a"); part(g, new THREE.SphereGeometry(0.06, 12, 10), m, 0, 0, 0.03).scale.set(0.8, 1, 1.5); for (const sx of [-1, 1]) { part(g, new THREE.ConeGeometry(0.018, 0.05, 6), m, sx * 0.03, 0.065, -0.01); part(g, new THREE.SphereGeometry(0.01, 6, 6), std(DARK), sx * 0.035, 0.02, 0.07); } part(g, new THREE.BoxGeometry(0.012, 0.1, 0.1), std(DARK), 0, 0.03, -0.06); });

  const exitOf = (x) => { const p = x.mover, b = cell(x.seat, -1, x.piece), T = cell(x.seat, 0); x.busy.add(p); return { p, b, T, yaw: yawTo(b, T), dir: dirTo(b, T) }; };
  const landed = (x, p, T, yaw, c, tL, word = locKey("¡Salgo!")) => { const t2 = (c - tL) * x.D; cue("land", tL); if (t2 < 0) return; park(p, T, yaw); settle(p, t2, 2); face(p, { open: t2 < 0.25 ? 0.35 : 1, noBlink: t2 < 0.25 }); FX.dust(T, t2, { count: 10, size: 0.18, spread: 0.4, seed: 9 }); FX.ring(T, t2, x.col); flash(T, t2, x.col); FX.text(word, x.col, up(T, 0.95), t2, { life: 1.3, size: 0.75 }); };
  const moveOf = (x, start, minN = 3) => { const N = Math.max(minN, x.steps), path = cells(x.seat, start, N); x.busy.add(x.mover); return { p: x.mover, N, path, end: path[N] }; };
  const ride = (p, path, w) => { const N = path.length - 1; park(p, pathAt(path, w), pathYaw(path, Math.min(Math.max(w, 0), N - 0.01))); return p.rotation.y; };
  const stepFx = (x, path, w) => { const k = Math.floor(w); k > 0 && k < path.length && flash(path[k], (w - k) * 0.5, x.col); };
  const arrive = (x, p, end, yaw, c, tL, word) => { const t2 = (c - tL) * x.D; if (t2 < 0) return; park(p, end, yaw); settle(p, t2, 1.8); face(p, { open: t2 < 0.25 ? 0.35 : 1, noBlink: t2 < 0.25 }); FX.dust(end, t2, { count: 9, size: 0.16, seed: 5 }); FX.ring(end, t2, x.col); flash(end, t2, x.col); word && FX.text(word, x.col, up(end, 0.95), t2 - 0.05, { life: 1.3, size: 0.7 }); };
  const WOW = { open: 1.3, mouth: "o", noBlink: true };
  const hole = (k, pos, sc) => { const h = ua[k]; h.visible = sc > 0.01; h.position.copy(pos).setY(k ? 0.152 : 0.2); h.scale.setScalar(Math.max(0.01, sc)); };

  Object.assign(actions, {
    
    trampolin(x, c) {
      const { p, b, T, yaw } = exitOf(x), { D, J } = x, tB = 0.36, tL = 0.76; cue("pop", 0.05); cue("boing", tB);
      let k = 0; if (c >= 0.05) { if (c < 0.26) k = 0.7 * backOut(seg(c, 0.05, 0.13)); else if (c < tB) k = MathLerp(0.7, 0.25, easeIn(seg(c, 0.26, tB))); else { const t2 = (c - tB) * D; k = Math.max(0, 1.6 + 0.6 * Math.exp(-t2 * 4) * cos(t2 * 25) - Math.max(0, t2 - 0.7) * 3); } }
      Hi.visible = ir.visible = k > 0.01; Hi.position.copy(b).setY(0.19); Hi.scale.set(1, Math.max(0.01, k), 1); ir.position.copy(b).setY(0.2 + 0.25 * k);
      if (c < tB) { park(p, b, yaw); p.position.y += 0.25 * k + 0.01; squash(p, c > 0.26 ? 0.3 * seg(c, 0.26, tB) * J : 0); face(p, { open: c > 0.26 ? 0.4 : 1.3, mouth: "o", noBlink: true }); }
      else if (c < tL) { const v = seg(c, tB, tL); hopArc(p, up(b, 0.4), T, v, 1.5 * J + 0.3); p.rotation.set(PI * 4 * easeIO(v), yaw, 0); p.scale.set(0.9, 1.15, 0.9); face(p, WOW); }
      landed(x, p, T, yaw, c, tL); FX.text(locKey("¡BOING!"), "#ff5a8a", up(b, 1.1), (c - tB) * D, { life: 1, size: 0.95 });

    },
    globos(x, c) {
      const { p, b, T, yaw } = exitOf(x), { D, J } = x, tP = 0.68, tL = 0.8; cue("inflate", 0.03); [tP, tP + 0.03, tP + 0.06].forEach((tm) => cue("pop", tm)); cue("wii", 0.2);
      const liftK = smooth(seg(c, 0.12, 0.3)), v = smooth(seg(c, 0.28, tP)), drop = easeIn(seg(c, tP + 0.04, tL)), h = 0.95 * liftK * (1 - drop);
      if (c < tL) { park(p, b.clone().lerp(T, v), lerpAngle(camYaw(b), yaw, liftK)); p.position.y += h + sin(now() * 2.5) * 0.03 * liftK; p.rotation.z = sin(now() * 2) * 0.15 * liftK * J; p.position.addScaledVector(rightOf(yaw), sin(v * PI * 2) * 0.12); face(p, c > tP ? { ...WOW, ly: -0.8 } : { open: 1.1, ly: -0.5, mouth: liftK > 0.5 ? "o" : "smile" }); }
      if (c < tP + 0.06) show(balloons, onPawn(p, 0, 0.42, 0), camYaw(p.position), elastic(seg(c, 0.02, 0.14)) * (c > tP ? 0.7 : 1), 0, sin(now() * 1.7) * 0.1);
      landed(x, p, T, yaw, c, tL); const t2 = (c - tP) * D; FX.burst(up(p.position, 1), t2, { count: 12, radius: 0.5, multi: true }); FX.text(locKey("¡Pop!"), "#ff4b4b", up(T, 1.7), t2, { life: 0.8, size: 0.8 });

    },
    tobogan(x, c) {
      const { p, b, T, yaw, dir } = exitOf(x), { D, J } = x, tL = 0.74, mid = b.clone().lerp(T, 0.42).setY(0.17); cue("pop", 0.03); cue("hop", 0.1); cue("wii", 0.28); cue("slip", 0.56);
      show(slide, mid, yaw, 0.85 * backOut(seg(c, 0.02, 0.1)) * (1 - smooth(seg(c, 0.82, 0.92)))); slide.updateMatrixWorld(true);
      const top = slide.localToWorld(new V3(0, 0.44, -0.4)), bot = slide.localToWorld(new V3(0, 0.05, 0.42));
      if (c < 0.1) { park(p, b, yaw); face(p, WOW); }
      else if (c < 0.26) { hopArc(p, b, top, seg(c, 0.1, 0.24), 0.25); p.rotation.set(0, yaw, 0); face(p, WOW); }
      else if (c < 0.56) { const v = easeIn(seg(c, 0.26, 0.56)); p.position.copy(top).lerp(bot, v); p.rotation.set(-0.5, yaw, 0); face(p, { open: 1.3, mouth: "o", mouthSize: 1.5, noBlink: true }); FX.puff(up(p.position.clone().addScaledVector(dir, -0.15), 0.2), 0.08, 0.4); }
      else if (c < tL) { const v = easeOut(seg(c, 0.56, tL)); p.position.copy(bot).lerp(T, v); p.rotation.set(-0.5 * (1 - v), yaw, 0); face(p, WOW); FX.dust(p.position, (c - 0.56) * D, { count: 6, size: 0.12, seed: 3 }); }
      landed(x, p, T, yaw, c, tL); FX.text(locKey("¡Wiii!"), "#ffffff", up(mid, 1.1), (c - 0.28) * D, { life: 1.1, size: 0.8 });

    },
    jetpack(x, c) {
      const { p, b, T, yaw } = exitOf(x), { D, J } = x, tO = 0.66, tL = 0.8; cue("fuse", 0.02); cue("whoosh", 0.14); cue("fart", tO);
      if (c < tL) { const v = smooth(seg(c, 0.14, tO)), fall = easeIn(seg(c, tO, tL)), loop = seg(c, 0.34, 0.5); park(p, b.clone().lerp(T, v), yaw); p.position.y += (0.6 * smooth(seg(c, 0.1, 0.24)) + sin(c * 40) * 0.05) * (1 - fall); p.position.addScaledVector(rightOf(yaw), sin(v * PI * 3) * 0.2 * J); p.rotation.x = 0.3 + PI * 2 * easeIO(loop); p.position.x += c < 0.14 ? sin(now() * 70) * 0.005 : 0; face(p, c > tO ? { open: 1.4, pupil: 0.5, mouth: "o", ly: -0.8, noBlink: true } : { open: 0.6, mouth: "smile", noBlink: true });
        if (c < tO) for (let k = 0; k < 5; k++) { const s2 = (now() * 3 + k / 5) % 1; FX.puff(onPawn(p, 0, -0.03 - s2 * 0.25, -0.05), 0.09 * (1 - s2) + 0.03, 1 - s2, k % 2 ? "#ffb347" : "#ff5a1f"); } else steam(p.position.clone().setY(p.position.y - 0.4), c * D, 3, "#5d5560"); }
      landed(x, p, T, yaw, c, tL); FX.text(locKey("pff…"), "#c9c3d6", up(T, 1.4), (c - tO) * D, { life: 0.8, size: 0.6 });

    },
    topo(x, c) {
      const { p, b, T, yaw } = exitOf(x), { D, J, col } = x, tL = 0.8; cue("dig", 0.08); cue("dig", 0.4); cue("boing", 0.64);
      hole(0, b, c > 0.06 ? (c < 0.7 ? backOut(seg(c, 0.06, 0.12)) : 1 - smooth(seg(c, 0.7, 0.78))) : 0); hole(1, T, c > 0.6 ? (c < 0.9 ? backOut(seg(c, 0.6, 0.66)) : 1 - smooth(seg(c, 0.9, 0.97))) : 0);
      if (c < 0.08) { park(p, b, yaw); face(p, { open: 0.5, mouth: "flat", noBlink: true }); }
      else if (c < 0.22) { const v = seg(c, 0.08, 0.22); park(p, b, yaw + v * PI * 8); p.position.y -= 0.75 * easeIn(v); p.scale.set(0.85, 1.1, 0.85); face(p, { open: 0.3, mouth: "o", noBlink: true }); for (let k = 0; k < 5; k++) { const s2 = (c * D * 2 + k / 5) % 1, ang = k * 1.26 + c * 30; FX.puff(b.clone().add(new V3(cos(ang) * 0.12 * (1 + s2), 0.05 + s2 * 0.3 - s2 * s2 * 0.25, sin(ang) * 0.12 * (1 + s2))), 0.06, (1 - s2) * 0.8, "#8a5a34"); } }
      else if (c < 0.64) { p.visible = false; const at = b.clone().lerp(T, smooth(seg(c, 0.22, 0.62))), wb = sin(now() * 30) * 0.05; Ei.visible = true; Ei.position.copy(at).setY(0.17); Ei.scale.set(1 + wb, 0.8 - wb, 1 - wb); Ei.rotation.y = now() * 3; FX.puff(at.clone().lerp(b, 0.12).setY(0.22), 0.09, 0.5, "#a97a50"); }
      else if (c < tL) { const v = seg(c, 0.64, tL), h = v < 0.5 ? -0.6 + (0.6 + 0.5 * J) * easeOut(v / 0.5) : 0.5 * J * (1 - easeIn((v - 0.5) / 0.5)); park(p, T, yaw + PI * 4 * easeOut(v)); p.position.y += h; p.scale.set(0.88, 1.15, 0.88); face(p, WOW); FX.dust(T, (c - 0.64) * D, { count: 12, size: 0.17, color: "#b98a5e", seed: 37 }); }
      landed(x, p, T, yaw, c, tL, locKey("¡Salí!"));

    },
    puntapie(x, c) {
      const { p, b, T, yaw, dir } = exitOf(x), { D, J } = x, tK = 0.38, tF = 0.66, tL = 0.9, mate = x.team.find((q) => q !== p), mb = mate.position.clone(), behind = b.clone().addScaledVector(dir, -0.24), F = T.clone().addScaledVector(dir, -0.14);
      x.busy.add(mate); cue("hop", 0.12); cue("whoosh", tK - 0.03); cue("bonk", tK); cue("slip", tF); cue("boing", 0.8);
      if (c < tK) { park(p, b, camYaw(b) + sin(c * D * 14) * 0.5); p.scale.set(1.05, 0.94, 1.05); face(p, { open: 0.3, mouth: "flat", noBlink: true }); }
      else if (c < tF) { const v = seg(c, tK, tF); hopArc(p, b, F, v, 0.8 * J + 0.2); p.rotation.set(-PI * 2 * v, yaw, sin(v * 20) * 0.3); face(p, { open: 1.4, size: 1.2, pupil: 0.5, mouth: "o", noBlink: true }); }
      else if (c < 0.8) { const t2 = (c - tF) * D; park(p, F.clone().lerp(T, easeOut(t2 / 0.3)), yaw); p.rotation.x = 1.5; settle(p, t2, 0.8); FX.dust(p.position, t2, { count: 9, size: 0.15, seed: 4 }); orbitStars(T.clone().addScaledVector(dir, 0.3), 0.14, 0.13); }
      else if (c < tL) { const v = seg(c, 0.8, tL); park(p, T, lerpAngle(yaw, yawTo(T, b), smooth(v))); p.position.y += arc(v) * 0.15; p.rotation.x = 1.5 * (1 - easeOut(v * 2)); tint(p, "#ff3b30", 0.35 * v); face(p, { open: 0.5, mouth: "flat", pupil: 0.7, noBlink: true }); }
      else { park(p, T, yawTo(T, b)); tint(p, "#ff3b30", 0.35); face(p, { ...lookAt(p, up(mb, 0.3)), open: 0.5, mouth: "flat", noBlink: true }); steam(T, c * D, 3); FX.text(locKey("¡Oye!"), "#ff5a3c", up(T, 0.95), (c - tL) * D, { life: 1, size: 0.6 }); }
      if (c < 0.3) { hopArc(mate, mb, behind, seg(c, 0.12, 0.3), 0.2); mate.rotation.set(0, yawTo(mb, b), 0); face(mate, { open: 0.5, mouth: "smile", noBlink: true }); }
      else if (c < 0.46) { const k = pulse(c, 0.3, 0.46); park(mate, behind.clone().addScaledVector(dir, 0.12 * k), yaw); mate.rotation.x = (c < tK ? -0.4 : 0.6) * k * J; face(mate, { open: 0.4, mouth: "flat", noBlink: true }); }
      else { hopArc(mate, behind, mb, seg(c, 0.5, 0.64), 0.2); mate.rotation.set(0, lerpAngle(yaw, camYaw(mb), seg(c, 0.5, 0.64)), 0); face(mate, { open: 0.3, mouth: "smile", mouthSize: 1.3, noBlink: true }); }
      FX.text(locKey("¡No quiero!"), "#ffffff", up(b, 0.95), (c - 0.06) * D, { life: 1.2, size: 0.6 }); FX.text(locKey("¡Fuera!"), "#ffd23f", up(b, 1.1), (c - tK) * D, { life: 0.9, size: 0.9 }); FX.burst(up(b, 0.3), (c - tK) * D, { count: 8, radius: 0.5 });

    },
    magica(x, c) {
      const { p, b, T, yaw } = exitOf(x), { D, J } = x, tL = 0.82; cue("wii", 0.1); cue("whoosh", 0.74);
      const v = smooth(seg(c, 0.16, 0.7)), lift = smooth(seg(c, 0.06, 0.18)) * (1 - smooth(seg(c, 0.7, 0.8))), at = b.clone().lerp(T, v).addScaledVector(rightOf(yaw), sin(v * PI * 2) * 0.25), away = easeIn(seg(c, 0.8, 0.95));
      at.y += 0.4 * lift + sin(now() * 4) * 0.02 * lift;
      const f = fwdOf(yaw), rs = backOut(seg(c, 0.02, 0.1)) * (1 - away);
      carpet.visible = rs > 0.01; carpet.position.copy(at).addScaledVector(f, -0.22 + 1.5 * away).setY(at.y - 0.02 + 1.2 * away); carpet.rotation.set(sin(now() * 6) * 0.08, yaw, sin(now() * 5) * 0.1); carpet.scale.set(rs, 1, 0.44 * rs);
      if (c < tL) { park(p, at, yaw); p.rotation.z = -sin(v * PI * 2 + 0.5) * 0.2 * J * lift; p.scale.set(1, 1 - 0.15 * lift, 1); face(p, { open: 0.3 + 0.9 * (1 - lift), mouth: "smile", noBlink: true }); for (let k = 0; k < 4; k++) FX.star(at.clone().addScaledVector(f, -0.25 - k * 0.12).add(new V3(0, sin(now() * 6 + k) * 0.04, 0)), 0.08 - k * 0.012, now() * 4 + k, lift * (1 - k / 5), "#fff36b"); }
      landed(x, p, T, yaw, c, tL);

    },
    taxi(x, c) {
      const { p, b, T, yaw } = exitOf(x), { D, J } = x, HY = 1.25, tL = 0.82; cue("ufo", 0.02); cue("ufo", 0.14); cue("whoosh", 0.36); cue("ufo", 0.62);
      const air = (pos) => pos.clone().setY(HY); let u2;
      if (c < 0.12) { u2 = air(b); u2.y += 3 * (1 - easeOut(c / 0.12)); } else if (c < 0.36) u2 = air(b); else if (c < 0.62) u2 = air(b).lerp(air(T), easeIO(seg(c, 0.36, 0.62))); else if (c < tL) u2 = air(T); else { const w = easeIn(seg(c, tL, 0.96)); u2 = air(T); u2.y += 4 * w; u2.z -= 2 * w; }
      show(ufo, u2, now() * 2.5, 1, 0, sin(now() * 2.3) * 0.08); const beam = (c > 0.14 && c < 0.36) || (c > 0.62 && c < tL); ufo.userData.beam.visible = beam; beamMat.opacity = 0.3 + 0.1 * sin(now() * 18);
      if (c < 0.14) { park(p, b, camYaw(b)); face(p, { ...lookAt(p, ufo.position), ...WOW }); p.rotation.x = -0.2; }
      else if (c < 0.36) { const w = seg(c, 0.14, 0.34); park(p, b, w * PI * 3); p.position.y += (HY - 0.45) * easeIO(w); p.scale.setScalar(1 - 0.7 * easeIn(w)); face(p, WOW); }
      else if (c < 0.62) p.visible = false;
      else if (c < tL) { const w = seg(c, 0.62, tL); park(p, T, yaw + (1 - w) * PI * 3); p.position.y += (HY - 0.45) * (1 - easeIO(w)); p.scale.setScalar(0.3 + 0.7 * easeOut(w)); face(p, WOW); }
      landed(x, p, T, yaw, c, tL, locKey("¡Gracias!")); FX.text(locKey("¡Taxi!"), "#b6ffbf", up(b, 1.1), (c - 0.03) * D, { life: 1.1, size: 0.8 });

    },
    voltereta(x, c) {
      const { p, b, T, yaw } = exitOf(x), { D, J, col } = x, tL = 0.72; [0.2, 0.36, 0.52].forEach((tm) => cue("hop", tm)); cue("tada", 0.76);
      if (c < 0.1) { park(p, b, yaw); squash(p, smooth(c / 0.1) * 0.3); face(p, { open: 0.4, mouth: "flat", noBlink: true }); }
      else if (c < tL) { const v = seg(c, 0.1, tL), ang = PI * 2 * 3 * v; park(p, b.clone().lerp(T, v), yaw + PI / 2); p.rotation.z = -ang; p.position.y += 0.2 * (1 - cos(ang)); face(p, { open: 0.3, mouth: "o", noBlink: true }); FX.puff(p.position.clone().setY(0.22), 0.07, 0.4); }
      else { const t2 = (c - tL) * D; park(p, T, lerpAngle(yaw + PI / 2, camYaw(T), smooth(t2 / 0.2))); settle(p, t2, 1.5); p.scale.y *= 1.08; face(p, { open: 0.3, noBlink: true }); for (const sx of [-1, 1]) hand(sx > 0 ? 1 : 0, onPawn(p, sx * 0.13, 0.5, 0), colorOf(p), smooth(t2 / 0.15)); FX.ring(T, t2, col); flash(T, t2, col); [10, 10, 9].forEach((n, k) => FX.badge(n, ["#ffc93c", "#2ad1b2", "#ff8a3d"][k], up(T, 1).addScaledVector(rightOf(camYaw(T)), (k - 1) * 0.36), t2 - 0.2 - k * 0.12, { hold: true, size: 0.3 })); }

    },
    caja(x, c) {
      const { p, b, T, yaw } = exitOf(x), { D, J } = x, moves = [[0.14, 0.3], [0.42, 0.58], [0.68, 0.8]], tL = 0.86; cue("land", 0.1); moves.forEach(([a2]) => { cue("tap", a2 + 0.02); cue("tap", a2 + 0.07); cue("tap", a2 + 0.12); }); cue("pop", tL);
      let w = 0, moving = false; moves.forEach(([a2, b2], k) => { if (c >= a2) { w = (k + smooth(seg(c, a2, b2))) / 3; moving = c < b2; } });
      const at = b.clone().lerp(T, w), bob = moving ? abs(sin(c * D * 22)) * 0.03 : 0, off = easeOut(seg(c, tL, 0.94));
      if (c < 0.94) show(box, at.clone().setY(0.17 + bob + 1.6 * (1 - easeIn(seg(c, 0.02, 0.1))) + off * 0.7).addScaledVector(rightOf(yaw), off * 0.6), yaw, 1, off * 2, moving ? sin(c * D * 22) * 0.05 : 0);
      park(p, at, yaw); if (c < tL) { p.scale.setScalar(c > 0.1 ? 0.7 : 1); face(p, { open: 0.5, lx: sin(now() * 3) }); } else { const t2 = (c - tL) * D; settle(p, t2, 1.6); face(p, { open: 0.3, noBlink: true }); FX.text(locKey("¡Ta-da!"), x.col, up(T, 0.95), t2, { life: 1.3, size: 0.8 }); FX.ring(T, t2, x.col); flash(T, t2, x.col); }
      const sus = !moving && c > 0.3 && c < 0.68; for (const q of pawns) if (q.userData.seat !== x.seat) face(q, sus ? { ...lookAt(q, up(at, 0.3)), open: 0.6, mouth: "flat" } : { lx: -0.8, ly: 0.4 });
      FX.text(locKey("¿?"), "#ffffff", up(at, 1.3), (c - 0.31) * D, { life: 0.9, size: 0.5 }); FX.text(locKey("¿?"), "#ffffff", up(at, 1.3), (c - 0.59) * D, { life: 0.8, size: 0.5 }); FX.text(locKey("…"), "#c9c3d6", up(at, 0.75), (c - 0.33) * D, { life: 0.8, size: 0.4 });

    },
    maleta(x, c) {
      const { p, b, T, yaw, dir } = exitOf(x), { D, J } = x, tW = 0.24, tA = 0.64, tX = 0.8; cue("hop", 0.08); for (let k = 0; k < 6; k++) cue("tap", tW + ((tA - tW) * (k + 0.5)) / 6); cue("pop", tX); cue("sad", tX + 0.03);
      const w = smooth(seg(c, tW, tA)), at = b.clone().lerp(T, w);
      if (c < tW) { park(p, b, lerpAngle(camYaw(b), yaw, smooth(seg(c, 0.16, tW)))); p.position.y += arc(seg(c, 0.06, 0.16)) * 0.15 * J; face(p, { open: 0.3, noBlink: true }); }
      else if (c < tA) { park(p, at, yaw); p.position.y += abs(sin(w * PI * 6)) * 0.035; p.rotation.x = 0.14; p.rotation.z = sin(w * PI * 6) * 0.06; face(p, { open: 0.6, mouth: "o", mouthSize: 0.7, noBlink: true }); sweat(at, c * D, 2); }
      else { const t2 = (c - tA) * D; park(p, T, lerpAngle(yaw, yawTo(T, b), smooth(seg(c, 0.68, 0.76)))); settle(p, t2); face(p, c > tX ? { ...WOW, ly: -0.6 } : { open: 0.4, mouth: "smile", noBlink: true }); flash(T, t2, x.col); FX.ring(T, t2, x.col); }
      const sp = (c < tW ? b : at).clone().addScaledVector(dir, c < tW ? 0 : -0.2).addScaledVector(rightOf(yaw), c < tW ? 0.16 : 0.03).setY(0.2);
      if (c < tX) show(suitcase, sp, yaw + PI / 2, backOut(seg(c, 0.01, 0.08)), 0, c > tW && c < tA ? 0.25 + sin(w * PI * 12) * 0.08 : 0);
      else { const t2 = (c - tX) * D; FX.confetti(up(sp, 0.1), t2, { count: 30, power: 0.45, seed: 77 }); FX.burst(up(sp, 0.15), t2, { count: 8, radius: 0.4, multi: true }); FX.text(locKey("¡Mis medias!"), "#ffffff", up(T, 1), t2, { life: 1.4, size: 0.6 }); }
      for (const q of x.team) if (q !== p) face(q, { ...lookAt(q, up(p.position, 0.3)), mouth: c > tX ? "o" : "smile" }); FX.text(locKey("¡Me mudo!"), x.col, up(b, 0.95), (c - 0.06) * D, { life: 1.1, size: 0.65 });

    },
    despertador(x, c) {
      const { p, b, T, yaw } = exitOf(x), { D, J } = x, tR = 0.3, tJ = 0.46, tL = 0.8; cue("ring", tR); cue("ring", tR + 0.07); cue("pop", tJ); cue("whoosh", 0.54);
      const cy = camYaw(b), ap = b.clone().addScaledVector(rightOf(cy), 0.26).setY(0.3), ringing = c > tR && c < 0.52;
      show(watches[0], ap.clone().add(new V3(ringing ? sin(now() * 80) * 0.012 : 0, ringing ? abs(sin(now() * 40)) * 0.03 : 0, 0)), cy, 2.3 * (1 - smooth(seg(c, 0.56, 0.64))), 0, ringing ? sin(now() * 60) * 0.2 : 0);
      if (c < tJ) { const br = sin(now() * 1.6) * 0.5 + 0.5, k = c < tR ? 1 : 0; park(p, b, cy); p.rotation.x = 0.26 * k; p.scale.set(1.03, 0.94 - 0.02 * br, 1.03); face(p, k ? { open: 0.06, mouth: "o", mouthSize: 1 + 0.5 * br, noBlink: true } : { open: 0.5, lx: 0.9, mouth: "flat", noBlink: true }); if (k) for (let q = 0; q < 2; q++) { const v = (now() * 0.5 + q * 0.5) % 1; FX.text(q ? locKey("Z") : locKey("z"), "#ffffff", b.clone().add(new V3(0.1 + v * 0.18, 0.5 + v * 0.5, 0)), v * 1.4, { life: 1.4, size: 0.25 + v * 0.2, tilt: 0.2 }); } }
      else if (c < 0.54) { const v = seg(c, tJ, 0.54); park(p, b, lerpAngle(cy, yaw, v)); p.position.y += arc(v) * 0.3 * J; p.scale.set(0.9, 1.15, 0.9); face(p, { open: 1.5, size: 1.2, pupil: 0.4, mouth: "o", noBlink: true }); }
      else if (c < tL) { const v = seg(c, 0.54, tL); park(p, b.clone().lerp(T, v), yaw); p.position.y += abs(sin(v * PI * 9)) * 0.06; p.rotation.x = 0.35; face(p, { open: 1.3, pupil: 0.5, mouth: "o", noBlink: true }); for (let k = 1; k <= 3; k++) FX.puff(b.clone().lerp(T, Math.max(0, v - k * 0.06)).setY(0.25), 0.09 - k * 0.02, 0.4 - k * 0.1); sweat(p.position, c * D, 2); }
      landed(x, p, T, yaw, c, tL, locKey("¡Llegué!")); FX.text(locKey("¡RIIING!"), "#ffd23f", up(ap, 0.5), (c - tR) * D, { life: 1.2, size: 0.85 }); FX.text(locKey("¡Me quedé dormida!"), "#ffffff", up(b, 1.05), (c - tJ) * D, { life: 1.2, size: 0.55 });

    },
    multitud(x, c) {
      const { p, b, T, yaw } = exitOf(x), { D, J } = x, mates = x.team.filter((q) => q !== p).sort((q1, q2) => q2.position.distanceTo(T) - q1.position.distanceTo(T)).slice(1), h1 = up(mates[0].position, 0.44), h2 = up(mates[1].position, 0.44), tL = 0.78;
      cue("hop", 0.06); cue("hop", 0.3); cue("boing", 0.52); cue("tada", 0.8);
      const lie = smooth(seg(c, 0.14, 0.22)); let carrier = -1;
      if (c < 0.06) { park(p, b, yaw); face(p, WOW); }
      else if (c < 0.2) { hopArc(p, b, h1, seg(c, 0.06, 0.2), 0.3); p.rotation.set(-1.45 * lie, yaw, 0); face(p, WOW); }
      else if (c < 0.3) { park(p, h1, yaw); p.rotation.x = -1.45; p.position.y += abs(sin(c * D * 10)) * 0.03; face(p, { open: 0.3, mouth: "smile", noBlink: true }); carrier = 0; }
      else if (c < 0.44) { hopArc(p, h1, h2, seg(c, 0.3, 0.44), 0.25); p.rotation.set(-1.45, yaw + PI * 2 * seg(c, 0.3, 0.44), 0); face(p, WOW); }
      else if (c < 0.52) { park(p, h2, yaw); p.rotation.x = -1.45; p.position.y += abs(sin(c * D * 10)) * 0.03 - 0.05 * seg(c, 0.48, 0.52); face(p, { open: 0.3, mouth: "smile", noBlink: true }); carrier = 1; }
      else if (c < tL) { const v = seg(c, 0.52, tL); hopArc(p, h2, T, v, 0.7 * J + 0.2); p.rotation.set(-1.45 * (1 - easeOut(v)) + PI * 2 * easeIO(v), yaw, 0); face(p, WOW); }
      mates.forEach((q, k) => { x.busy.add(q); const up2 = carrier === k ? 1 : 0, thr = k === 0 ? pulse(c, 0.28, 0.34) : pulse(c, 0.5, 0.56); q.scale.set(1 + 0.1 * up2 - 0.1 * thr, 1 - 0.15 * up2 + 0.2 * thr, 1 + 0.1 * up2 - 0.1 * thr); face(q, up2 || thr ? { ly: 1, open: 0.5, mouth: "flat", noBlink: true } : { ...lookAt(q, up(p.position, 0.2)), mouth: "o" }); });
      landed(x, p, T, yaw, c, tL, locKey("¡Rock!")); FX.text(locKey("¡Eeeh!"), "#ffd23f", up(baseCenter(x.seat), 1.3), (c - 0.2) * D, { life: 1.4, size: 0.8 });

    },
    puerta(x, c) {
      const { p, b, T, yaw, dir } = exitOf(x), { D, J } = x, E = b.clone().lerp(T, 0.5), front = E.clone().addScaledVector(dir, -0.2), tS = 0.74; cue("pop", 0.03); cue("knock", 0.27); cue("knock", 0.33); cue("stretch", 0.4); cue("hop", 0.5); cue("pum", tS);
      const ds = backOut(seg(c, 0.02, 0.1)) * (1 - smooth(seg(c, 0.84, 0.93))), open = c < tS ? smooth(seg(c, 0.38, 0.48)) : 1 - easeOut(seg(c, tS - 0.02, tS));
      show(door, E.clone().setY(0.17), yaw, ds); door.userData.leaf.rotation.y = 1.7 * open;
      if (c < 0.24) { hopArc(p, b, front, seg(c, 0.1, 0.24), 0.2); p.rotation.set(0, yaw, 0); face(p, { open: 1.1 }); }
      else if (c < 0.38) { const k = Math.max(pulse(c, 0.24, 0.3), pulse(c, 0.3, 0.36)); park(p, front.clone().addScaledVector(dir, 0.06 * k), yaw); p.rotation.x = 0.35 * k; face(p, { open: 1, mouth: "smile" }); }
      else if (c < 0.5) { park(p, front, yaw); face(p, { open: 1.2, mouth: "o" }); }
      else if (c < 0.7) { hopArc(p, front, T, seg(c, 0.5, 0.7), 0.25 * J + 0.05); p.rotation.set(0, yaw, 0); face(p, { open: 0.4, noBlink: true }); }
      else { const t2 = (c - tS) * D; park(p, T, t2 > 0 ? lerpAngle(yaw, yawTo(T, E), smooth(t2 / 0.2)) : yaw); settle(p, (c - 0.7) * D); if (t2 > 0) { p.position.y += t2 < 0.3 ? arc(t2 / 0.3) * 0.25 * J : 0; face(p, { open: 1.5, size: 1.2, pupil: 0.4, mouth: "o", noBlink: true }); t2 < 0.5 && (Re += 0.08 * J * Math.exp(-t2 * 9)); } flash(T, (c - 0.7) * D, x.col); }
      FX.text(locKey("toc toc"), "#ffffff", up(front, 0.9), (c - 0.27) * D, { life: 0.9, size: 0.5 }); FX.text(locKey("¡PAM!"), "#ff5a3c", up(E, 1), (c - tS) * D, { life: 1, size: 1 }); FX.dust(E, (c - tS) * D, { count: 10, size: 0.16, seed: 6 });

    },
    burbuja(x, c) {
      const { p, b, T, yaw } = exitOf(x), { D, J } = x, tP = 0.7, tL = 0.8; cue("inflate", 0.02); cue("plop", tP);
      const v = smooth(seg(c, 0.16, 0.66)), lift = smooth(seg(c, 0.1, 0.24)), at = b.clone().lerp(T, v); at.y += 0.4 * lift + sin(now() * 2.2) * 0.04 * lift;
      if (c < tP) { park(p, at, lerpAngle(camYaw(b), yaw, lift) + sin(now() * 1.5) * 0.3 * lift); p.rotation.z = sin(now() * 1.8) * 0.2 * lift; face(p, { open: 1.2, mouth: "smile", lx: sin(now() * 2) }); bubble.visible = true; bubble.position.copy(up(at, 0.22)); bubble.scale.setScalar(Math.max(0.01, elastic(seg(c, 0.02, 0.2)) * (1 + 0.04 * sin(now() * 5)))); for (let k = 0; k < 3; k++) { const s2 = (now() * 0.7 + k / 3) % 1; FX.puff(at.clone().add(new V3(sin(k * 2 + s2 * 4) * 0.25, 0.1 + s2 * 0.6, cos(k * 3) * 0.25)), 0.05, (1 - s2) * 0.5, "#bfefff"); } }
      else if (c < tL) { const w = seg(c, tP, tL); park(p, T, yaw); p.position.y += 0.4 * (1 - easeIn(w)); face(p, { ...WOW, ly: -0.8 }); }
      landed(x, p, T, yaw, c, tL); const t2 = (c - tP) * D; FX.text(locKey("¡Plop!"), "#7fd7ff", up(T, 1.2), t2, { life: 0.9, size: 0.85 }); FX.burst(up(T, 0.6), t2, { count: 12, radius: 0.5, color: "#bfefff" });

    },

    
    pogo(x, c) {
      const { p, N, path, end } = moveOf(x, 6), { D, J } = x, t0 = 0.08, t1 = 0.86, w = N * seg(c, t0, t1), k = Math.min(N - 1, Math.floor(w)), fr = w - k;
      for (let q = 0; q < N; q++) cue("boing", t0 + ((t1 - t0) * q) / N);
      if (c < t1) { const yaw = ride(p, path, k + easeIO(fr)), comp = fr < 0.12 ? sin((fr / 0.12) * PI) : 0, h = 0.14 + arc(fr) * (0.55 * J + 0.1) - 0.08 * comp; p.position.y += c < t0 ? 0.14 * smooth(c / t0) : h; p.rotation.x = 0.12; p.rotation.z = sin(w * PI) * 0.1; squash(p, 0.25 * comp); face(p, { open: 1.1, mouth: fr > 0.3 && fr < 0.7 ? "o" : "smile", noBlink: true }); const foot = p.position.clone(); foot.y -= c < t0 ? 0.14 * smooth(c / t0) : 0.14 - 0.08 * comp; rod(0, foot, p.position.clone(), 0.012, "#e8443a"); if (fr < 0.2 && c > t0) FX.dust(pathAt(path, k), fr * 0.5, { count: 5, size: 0.1, seed: k }); stepFx(x, path, w); }
      else if (c < 0.93) { const v = seg(c, t1, 0.93), sp = up(end, 0.1 + v).addScaledVector(rightOf(p.rotation.y), v * 0.6); rod(0, sp, up(sp, 0.25), 0.012, "#e8443a"); }
      arrive(x, p, end, pathYaw(path, N - 0.01), c, t1, locKey("¡Boing, boing!"));

    },
    monociclo(x, c) {
      const { p, N, path, end } = moveOf(x, 8), { D, J } = x, t0 = 0.12, t1 = 0.78, w = N * smooth(seg(c, t0, t1)); cue("pop", 0.03); cue("whoosh", t0); cue("slip", t1); cue("land", 0.88);
      const yaw = ride(p, path, w), wob = sin(now() * 6) * 0.14 * J * (c > t0 && c < t1 ? 1 : 0.3), off = c > t1 ? seg(c, t1, 0.88) : 0, away = easeOut(seg(c, t1, 0.98));
      if (c < 0.88) { p.position.y += 0.22 * backOut(seg(c, 0.03, t0)) * (1 - easeIn(off)) + arc(off) * 0.2; p.rotation.z = wob; p.position.addScaledVector(rightOf(yaw), wob * 0.2); p.rotation.x = 0.08; face(p, { open: 1.2, ly: -0.6, mouth: abs(wob) > 0.08 ? "o" : "flat", noBlink: true }); for (const sx of [-1, 1]) hand(sx > 0 ? 1 : 0, onPawn(p, sx * 0.2, 0.25 + sx * wob * 0.6, 0), colorOf(p), 0.9); }
      const wp = pathAt(path, w).addScaledVector(fwdOf(yaw), away * 0.9).setY(0.17); show(wheel, wp, yaw, backOut(seg(c, 0.02, 0.1)) * (1 - smooth(seg(c, 0.92, 1))), 0, c > t1 ? wob + 1.4 * easeIn(seg(c, 0.86, 0.96)) : wob * 0.6); wheel.userData.w.rotation.x = (w + away * 0.9) * 3.6;
      stepFx(x, path, w); arrive(x, p, end, yaw, c, 0.88, locKey("¡Equilibrio!"));

    },
    cangrejo(x, c) {
      const { p, N, path, end } = moveOf(x, 10), { D, J } = x, t0 = 0.1, t1 = 0.84, w = N * seg(c, t0, t1), st = w * 4; for (let q = 0; q < N * 2; q++) cue("click", t0 + ((t1 - t0) * (q + 0.5)) / (N * 2));
      if (c < t1) { const yaw = ride(p, path, w) + (c > 0.04 ? PI / 2 * smooth(seg(c, 0.04, t0)) : 0); p.rotation.y = yaw; const low = smooth(seg(c, 0.02, t0)); p.scale.set(1 + 0.18 * low, 1 - 0.22 * low, 1 + 0.18 * low); p.position.y += abs(sin(st * PI)) * 0.02; p.rotation.z = sin(st * PI) * 0.08 * J; face(p, { lx: -0.9, open: 0.9, mouth: "flat" }); for (const sx of [-1, 1]) { const snap = abs(sin(now() * 9 + sx)); hand(sx > 0 ? 1 : 0, onPawn(p, sx * 0.19, 0.3 + snap * 0.05, 0.03), "#ff4b4b", (0.8 + 0.5 * snap) * low); } stepFx(x, path, w); const v = (now() * 1.4) % 1; FX.text(locKey("clac"), "#ffffff", up(p.position, 0.6 + v * 0.2), v * 0.6, { life: 0.6, size: 0.3, tilt: 0.15 }); }
      arrive(x, p, end, pathYaw(path, N - 0.01), c, t1, locKey("¡Clac, clac!"));

    },
    gusano(x, c) {
      const { p, N, path, end } = moveOf(x, 12), { D, J } = x, t0 = 0.06, t1 = 0.88, w = N * seg(c, t0, t1), k = Math.min(N - 1, Math.floor(w)), fr = w - k; for (let q = 0; q < N; q++) cue("stretch", t0 + ((t1 - t0) * q) / N);
      if (c < t1) { const ctr = k + (fr < 0.5 ? 0.5 * smooth(fr * 2) : 0.5 + 0.5 * smooth((fr - 0.5) * 2)), st = fr < 0.5 ? sin(fr * 2 * PI) : 0, ar = fr >= 0.5 ? sin((fr - 0.5) * 2 * PI) : 0; ride(p, path, ctr); p.scale.set(1 - 0.1 * st + 0.08 * ar, 1 - 0.35 * st * J + 0.3 * ar * J, 1 + 0.9 * st * J - 0.2 * ar); face(p, { open: 0.5 + 0.5 * ar, mouth: st > 0.3 ? "flat" : "o", mouthSize: 0.7, noBlink: true }); stepFx(x, path, w); }
      arrive(x, p, end, pathYaw(path, N - 0.01), c, t1);

    },
    ballet(x, c) {
      const { p, N, path, end } = moveOf(x, 14), { D, J, col } = x, t0 = 0.08, t1 = 0.78, w = N * seg(c, t0, t1), k = Math.min(N - 1, Math.floor(w)), fr = w - k; for (let q = 0; q < N; q++) { cue("hop", t0 + ((t1 - t0) * q) / N); cue("pop", t0 + ((t1 - t0) * (q + 0.8)) / N); }
      const yawE = pathYaw(path, N - 0.01);
      if (c < t1) { const yaw = ride(p, path, k + easeIO(fr)); p.rotation.y = yaw + PI * 4 * smooth(fr); p.position.y += 0.03 + arc(fr) * 0.22 * J; p.scale.set(0.88, 1.16, 0.88); face(p, { open: 0.25, noBlink: true }); for (let q = 1; q <= 4; q++) FX.star(up(pathAt(path, k + easeIO(fr) - q * 0.12), 0.15 + 0.05 * sin(q + now() * 6)), 0.08 - q * 0.012, now() * 3 + q, 0.9 - q * 0.18, q % 2 ? "#ff8fd0" : "#ffffff"); stepFx(x, path, w); }
      else { const t2 = (c - t1) * D, bow = pulse(c, 0.84, 0.97); park(p, end, lerpAngle(yawE, camYaw(end), smooth(t2 / 0.25))); p.rotation.x = 0.6 * bow; settle(p, t2, 1); face(p, { open: 0.25, noBlink: true }); FX.text(locKey("¡Bravo!"), "#ff8fd0", up(end, 1.05), t2 - 0.1, { hold: true, size: 0.8 }); FX.confetti(up(end, 1.2), t2 - 0.1, { count: 30, power: 0.4, seed: 12 }); FX.ring(end, t2, col); }
      if (c < 0.97) for (const sx of [-1, 1]) hand(sx > 0 ? 1 : 0, onPawn(p, sx * 0.07, 0.52, 0), colorOf(p), 0.85 * smooth(seg(c, 0.02, t0)));

    },
    karate(x, c) {
      const { p, N, path, end } = moveOf(x, 16), { D, J, col } = x, pre = path.slice(0, N), A = path[N - 1], yaw = yawTo(A, end), mid = A.clone().lerp(end, 0.5).setY(0.42), tC = 0.64; cue("pop", 0.44); cue("whoosh", tC - 0.03); cue("strike", tC); cue("hop", 0.74); cue("land", 0.86);
      if (c < 0.42) hopPath(p, pre, c, 0, 0.42, { seat: x.seat });
      else if (c < tC) { const k = smooth(seg(c, 0.46, tC - 0.04)); park(p, A, yaw); p.rotation.x = -0.25 * k; p.scale.set(1 - 0.04 * k, 1 + 0.08 * k, 1 - 0.04 * k); face(p, { open: 0.12, mouth: "flat", noBlink: true }); }
      else if (c < 0.74) { const t2 = (c - tC) * D; park(p, A, yaw); p.rotation.x = 0.5 * Math.exp(-t2 * 4); face(p, { open: 1.3, mouth: "o", mouthSize: 1.6, noBlink: true }); }
      else if (c < 0.86) { hopArc(p, A, end, seg(c, 0.74, 0.86), 0.25 * J + 0.05); p.rotation.set(0, yaw, 0); face(p, { open: 0.4, noBlink: true }); }
      else { const t2 = (c - 0.86) * D, bow = pulse(c, 0.9, 0.99); park(p, end, yaw); p.rotation.x = 0.55 * bow; settle(p, t2); face(p, { open: 0.25, noBlink: true }); FX.ring(end, t2, col); flash(end, t2, col); }
      const ps = backOut(seg(c, 0.42, 0.5)), tb = (c - tC) * D, side = rightOf(yaw);
      planks.forEach((pl, k) => { const sg = k ? 1 : -1, fall = tb > 0 ? tb : 0; if (fall < 0.8) show(pl, mid.clone().addScaledVector(side, sg * (0.075 + fall * 0.35)).setY(mid.y - Math.min(0.24, 2 * fall * fall)), yaw, ps, 0, sg * fall * -3); });
      if (c > 0.46 && c < 0.7) hand(0, onPawn(p, 0, c < tC ? 0.55 : 0.3, 0.16), colorOf(p), 1.1);
      if (tb >= 0) { FX.text(locKey("¡HIYA!"), "#ff5a3c", up(mid, 0.6), tb, { life: 1, size: 1 }); FX.burst(mid, tb, { count: 10, radius: 0.5, color: "#d9a46b" }); tb < 0.4 && (Re += 0.06 * J * Math.exp(-tb * 10)); }
      FX.text(locKey("…"), "#ffffff", up(A, 0.85), (c - 0.48) * D, { life: 0.8, size: 0.5 });

    },
    mareado(x, c) {
      const { p, N, path, end } = moveOf(x, 18), { D, J } = x, t0 = 0.22, t1 = 0.8, w = N * seg(c, t0, t1); cue("whoosh", 0.02); cue("slip", t1); cue("land", 0.86);
      const yawE = pathYaw(path, N - 0.01);
      if (c < t0) { park(p, path[0], pathYaw(path, 0) + c * c * 400); face(p, { open: 0.3, noBlink: true }); FX.text(locKey("¡Giro, giro!"), "#ffffff", up(path[0], 0.9), c * D, { life: 0.9, size: 0.55 }); }
      else if (c < t1) { const yaw = ride(p, path, w), sw = sin(w * PI * 1.5 + 1) * 0.16 * J; p.position.addScaledVector(rightOf(yaw), sw); p.rotation.y = yaw + sw * 3; p.rotation.z = -sw * 2.4; p.position.y += abs(sin(w * PI * 2)) * 0.03; face(p, { lx: cos(now() * 9), ly: sin(now() * 9), mouth: "o", noBlink: true }); orbitStars(p.position, 0.55, 0.18); stepFx(x, path, w); }
      else if (c < 0.86) { const v = seg(c, t1, 0.86); park(p, end, yawE); p.rotation.x = -1.4 * easeIn(v); face(p, { lx: cos(now() * 9), ly: sin(now() * 9), mouth: "o", noBlink: true }); }
      else { const t2 = (c - 0.86) * D; park(p, end, yawE); p.rotation.x = -1.4; settle(p, t2, 0.8); face(p, { lx: cos(now() * 9), ly: sin(now() * 9), mouth: "o", noBlink: true }); orbitStars(end.clone().addScaledVector(fwdOf(yawE), -0.3), 0.14, 0.13); FX.dust(end, t2, { count: 8, size: 0.14, seed: 2 }); FX.text(locKey("uy…"), "#ffffff", up(end, 0.8), t2, { life: 1.2, size: 0.5 }); flash(end, t2, x.col); }

    },
    robot(x, c) {
      const { p, N, path, end } = moveOf(x, 20), { D, J } = x, t0 = 0.08, t1 = 0.86, w = N * seg(c, t0, t1), k = Math.min(N - 1, Math.floor(w)), fr = w - k; for (let q = 0; q < N; q++) { cue("chug", t0 + ((t1 - t0) * q) / N); cue("beep", t0 + ((t1 - t0) * (q + 0.65)) / N); } cue("tada", 0.9);
      const go = Math.min(1, fr / 0.6), scan = fr > 0.6 ? Math.round(sin(((fr - 0.6) / 0.4) * PI * 2)) : 0;
      if (c < t1) { const yaw = ride(p, path, k + go); p.rotation.y = yaw + scan * 0.9; p.position.y += fr < 0.6 ? (Math.floor(fr * 20) % 2) * 0.008 : 0; p.scale.set(0.96, 1.04, 0.96); face(p, { lx: scan * 0.9, open: 1.1, pupil: 0.5, mouth: "flat", noBlink: true }); if (fr > 0.62 && fr < 0.95) FX.text(k % 2 ? locKey("bup") : locKey("bip"), "#8dff8a", up(p.position, 0.85), (fr - 0.62) * 2, { life: 0.5, size: 0.4, tilt: 0 }); stepFx(x, path, w); }
      else { const t2 = (c - t1) * D; park(p, end, pathYaw(path, N - 0.01)); p.scale.set(0.96, 1.04, 0.96); face(p, { open: 1.1, pupil: 0.5, mouth: "flat", noBlink: true }); FX.text(locKey("DESTINO ALCANZADO"), "#8dff8a", up(end, 1), t2, { hold: true, size: 0.55, tilt: 0 }); FX.ring(end, t2, "#8dff8a"); flash(end, t2, "#8dff8a"); }
      show(antenna, onPawn(p, 0, 0.41, 0), p.rotation.y, elastic(seg(c, 0.01, 0.1)), 0, sin(now() * 20) * 0.1); if (Math.floor(now() * 4) % 2) FX.star(up(antenna.position, 0.12), 0.07, 0, 1, "#ff3b30");

    },
    surf(x, c) {
      const { p, N, path, end } = moveOf(x, 22), { D, J, col } = x, t0 = 0.12, t1 = 0.78, w = N * smooth(seg(c, t0, t1)); cue("splash", 0.04); cue("whoosh", t0); cue("splash", t1); cue("land", 0.88);
      const yaw = ride(p, path, w), on = c < t1 + 0.04, f = fwdOf(yaw), bobY = sin(now() * 5) * 0.03;
      if (on) { p.position.y += 0.1 * smooth(seg(c, 0.04, t0)) + bobY; p.rotation.y = yaw + 0.9; p.rotation.z = sin(now() * 3) * 0.14 * J; face(p, { open: 0.4, mouth: "smile", mouthSize: 1.3, noBlink: true }); show(board, p.position.clone().setY(p.position.y - 0.02), yaw, backOut(seg(c, 0.02, 0.1)), sin(now() * 5) * 0.12, sin(now() * 3) * 0.1);
        for (let q = 0; q < 12; q++) { const s2 = rnd(q * 3.1), ang = rnd(q * 7.7) * PI; FX.puff(p.position.clone().addScaledVector(f, -0.12 - s2 * 0.4).addScaledVector(rightOf(yaw), cos(ang + now()) * 0.25).setY(0.2 + abs(sin(now() * 4 + q)) * 0.16 * (1 - s2)), 0.16 - s2 * 0.08, 0.75 - s2 * 0.4, q % 3 ? "#6ec3ff" : "#ffffff"); } stepFx(x, path, w); }
      else if (c < 0.88) { hopArc(p, up(end, 0.1), end, seg(c, t1 + 0.04, 0.88), 0.2); p.rotation.set(0, yaw, 0); face(p, WOW); }
      arrive(x, p, end, yaw, c, 0.88); const t2 = (c - t1) * D; FX.text(locKey("¡Splash!"), "#6ec3ff", up(end, 1.05), t2, { life: 1.1, size: 0.85 }); FX.dust(end, t2, { count: 14, size: 0.2, spread: 0.7, color: "#6ec3ff", seed: 8 }); FX.text(locKey("¡Cowabunga!"), col, up(path[0], 1), (c - t0) * D, { life: 1, size: 0.65 }); c > 0.88 && sweat(end, c * D, 3);

    },
    globo(x, c) {
      const { p, N, path, end } = moveOf(x, 6, 4), { D, J } = x, tV = 0.46, t1 = 0.84; cue("inflate", 0.02); cue("fart", tV); cue("fart", tV + 0.18); cue("land", t1);
      const yawE = pathYaw(path, N - 0.01);
      if (c < tV) { const big = smooth(seg(c, 0.02, 0.2)), w = N * 0.35 * smooth(seg(c, 0.2, tV)); const yaw = ride(p, path, w); p.position.y += 0.35 * big + sin(now() * 2.5) * 0.03; p.scale.setScalar(1 + 0.7 * big * J); p.rotation.z = sin(now() * 2) * 0.12; face(p, { open: 1.1, mouth: "flat", mouthSize: 0.5, noBlink: true }); }
      else if (c < t1) { const v = seg(c, tV, t1), w = N * (0.35 + 0.65 * v), yaw = ride(p, path, w), wild = (1 - v) * J; p.position.y += 0.35 * (1 - v) + sin(v * 37) * 0.25 * wild; p.position.addScaledVector(rightOf(yaw), sin(v * 29) * 0.3 * wild); p.rotation.set(sin(v * 31) * 1.2 * wild, yaw + sin(v * 23) * 1.5 * wild, sin(v * 41) * 1.2 * wild); p.scale.setScalar(1 + 0.7 * (1 - v) * J); face(p, { open: 1.4, pupil: 0.5, mouth: "o", mouthSize: 0.6, noBlink: true }); for (let q = 0; q < 3; q++) FX.puff(p.position.clone().add(new V3(sin(q * 2 + now() * 9) * 0.08, 0.2, cos(q * 3 + now() * 7) * 0.08)), 0.07, 0.5); stepFx(x, path, w); }
      else { const t2 = (c - t1) * D, flat = Math.max(0, 1 - t2 / 0.5); park(p, end, yawE); p.scale.set(1 + 0.5 * flat, 1 - 0.6 * flat, 1 + 0.5 * flat); if (flat <= 0) settle(p, t2 - 0.5, 1.5); face(p, { open: flat > 0 ? 0.1 : 1, mouth: flat > 0 ? "flat" : "smile", noBlink: true }); FX.dust(end, t2, { count: 8, size: 0.14, seed: 3 }); flash(end, t2, x.col); cue("pop", t1 + 0.5 / D); }
      FX.text(locKey("pfffrrrt"), "#ffffff", up(pathAt(path, N * 0.4), 1.1), (c - tV) * D, { life: 1.2, size: 0.7, tilt: 0.15 });

    },
    caracol(x, c) {
      const { p, N, path, end } = moveOf(x, 24), { D, J } = x, tC = 0.6, tR = 0.7, rv = x.rival; cue("yawn", 0.3); cue("pop", tR); cue("tada", 0.92);
      const w = c < tC ? 1.2 * seg(c, 0.04, tC) : c < tR ? 1.2 : N - 0.6 + 0.6 * seg(c, tR, 0.9), yaw = ride(p, path, w), cr = sin(c * D * 3);
      p.visible = c < tC + 0.03 || c > tR - 0.03; p.scale.set(1 + 0.05 * cr, 1 - 0.1, 1 + 0.2 - 0.12 * cr); face(p, { open: 0.5, ly: -0.2, mouth: "smile" });
      if (p.visible) show(shell, onPawn(p, 0, 0.2, -0.11), yaw, 1, 0.3); for (let q = 1; q <= 6; q++) { const wq = w - q * 0.15; wq > (c < tR ? 0 : N - 0.6) && FX.puff(pathAt(path, wq).setY(0.2), 0.06, 0.5 - q * 0.07, "#b6ffbf"); }
      x.busy.add(rv); const Rp = path[2].clone().addScaledVector(perpTo(path[1], path[3]), 0.42); park(rv, Rp, yawTo(Rp, path[1])); const y = pulse(c, 0.28, 0.44); rv.scale.set(1 - 0.05 * y, 1 + 0.12 * y, 1 - 0.05 * y); face(rv, y > 0.1 ? { open: 1 - 0.85 * y, mouth: "o", mouthSize: 1 + 2 * y, noBlink: true } : { ...lookAt(rv, up(p.position, 0.3)), open: 0.5, mouth: "flat" });
      if (c > tC && c < tR) dim(pulse(c, tC, tR)); FX.text(locKey("…3 horas después…"), "#ffffff", new V3(0, 1.6, 0), (c - tC + 0.02) * D, { life: (tR - tC + 0.04) * D, size: 0.9, tilt: 0 });
      if (c > 0.9) { const t2 = (c - 0.9) * D; FX.text(locKey("¡Llegué!"), x.col, up(end, 0.95), t2, { hold: true, size: 0.75 }); FX.ring(end, t2, x.col); flash(end, t2, x.col); }

    },
    liebre(x, c) {
      const { p, N, path } = moveOf(x, 26), { D, J, col } = x, ext = cells(x.seat, 26, N + 1), end = ext[N], yawE = pathYaw(ext, N + 0.5); cue("whoosh", 0.12); cue("slip", 0.3); for (let q = 0; q < 5; q++) cue("tap", 0.5 + q * 0.05); cue("pop", 0.8);
      if (c < 0.12) { park(p, ext[0], pathYaw(ext, 0)); squash(p, 0.35 * smooth(c / 0.12)); p.rotation.x = 0.3; p.position.x += sin(now() * 60) * 0.004; face(p, { open: 0.4, mouth: "flat", noBlink: true }); }
      else if (c < 0.3) { const w = (N + 0.7) * easeOut(seg(c, 0.12, 0.3)), yaw = ride(p, ext, w); p.rotation.x = 0.5 * J; p.scale.set(0.9, 0.95, 1.3); face(p, { open: 0.5, mouth: "o", noBlink: true }); for (let q = 1; q <= 7; q++) FX.puff(up(pathAt(ext, w - q * 0.35), 0.2), 0.2 - q * 0.02, 0.5 - q * 0.06, q % 2 ? col : "#ffffff"); stepFx(x, ext, w); }
      else if (c < 0.46) { const t2 = (c - 0.3) * D; ride(p, ext, N + 0.7); p.rotation.x = -0.4 * Math.exp(-t2 * 4); face(p, { open: 1.4, pupil: 0.5, mouth: "o", noBlink: true }); FX.dust(p.position, t2, { count: 12, size: 0.2, spread: 0.5, seed: 4 }); FX.text(locKey("¡Me pasé!"), "#ffffff", up(p.position, 0.9), t2 - 0.15, { life: 1, size: 0.6 }); }
      else if (c < 0.78) { const v = seg(c, 0.46, 0.78); ride(p, ext, N + 0.7 - 0.7 * v); p.scale.set(0.9, 1.14, 0.9); p.position.y += abs(sin(v * PI * 5)) * 0.03; face(p, { lx: sin(v * 9), ly: 0.6, open: 0.8, mouth: "o", mouthSize: 0.5, noBlink: true }); FX.text(locKey("la-la"), "#ffffff", onPawn(p, 0.1, 0.5 + ((v * 3) % 1) * 0.2, 0.1), ((v * 3) % 1) * 0.8, { life: 0.8, size: 0.35, tilt: 0.2 }); }
      arrive(x, p, end, yawE, c, 0.78, "je, je");

    },
    pinguino(x, c) {
      const { p, N, path, end } = moveOf(x, 28), { D, J } = x, t0 = 0.2, t1 = 0.76, w = N * easeOut(seg(c, t0, t1)), ICE = "#bfefff"; cue("hop", 0.08); cue("slip", t0); cue("boing", 0.8);
      for (let q = 1; q <= N; q++) flash(path[q], (((c * D - q * 0.07) % 0.5) + 0.5) % 0.5, ICE);
      if (c < 0.08) { park(p, path[0], pathYaw(path, 0)); squash(p, 0.3 * smooth(c / 0.08)); face(p, { open: 0.4, noBlink: true }); }
      else if (c < t0) { const v = seg(c, 0.08, t0); park(p, path[0], pathYaw(path, 0)); p.position.y += arc(v) * 0.25; p.rotation.x = 1.45 * easeIO(v); face(p, WOW); }
      else if (c < t1) { const yaw = ride(p, path, w); p.rotation.x = 1.45; p.rotation.y = yaw + (c - t0) * 6; p.position.y += 0.05; face(p, { open: 0.3, mouth: "smile", mouthSize: 1.3, noBlink: true }); for (let q = 1; q <= 4; q++) FX.puff(pathAt(path, w - q * 0.2).setY(0.22), 0.08, 0.5 - q * 0.1, ICE); }
      else if (c < 0.86) { const v = seg(c, t1, 0.86); park(p, end, pathYaw(path, N - 0.01)); p.position.y += arc(v) * 0.15; p.rotation.x = 1.45 * (1 - easeOut(v)); face(p, WOW); }
      else { const t2 = (c - 0.86) * D; park(p, end, pathYaw(path, N - 0.01)); p.position.x += sin(now() * 70) * 0.006 * J; tint(p, ICE, 0.4); face(p, { open: 0.6, mouth: "o", mouthSize: 0.6, noBlink: true }); FX.text(locKey("brrr"), ICE, up(end, 0.9), t2, { hold: true, size: 0.6 }); FX.ring(end, t2, ICE); }
      FX.text(locKey("¡Yujuuu!"), ICE, up(path[1], 1), (c - t0) * D, { life: 1, size: 0.7 });

    },
    marcha(x, c) {
      const { p, N, path, end } = moveOf(x, 30), { D, J } = x, t0 = 0.08, t1 = 0.82, w = N * seg(c, t0, t1), bt = w * 2; for (let q = 0; q < N * 2; q++) cue(q % 2 ? "tap" : "land", t0 + ((t1 - t0) * q) / (N * 2)); cue("click", 0.88);
      const yaw = ride(p, path, Math.min(N, w)), sw = sin(bt * PI), on = c < t1;
      if (on) { p.position.y += abs(sw) * 0.045 * J; p.rotation.z = sw * 0.07; p.scale.set(0.95, 1.08, 0.95); face(p, { open: 0.9, mouth: "flat", noBlink: true }); for (const sx of [-1, 1]) hand(sx > 0 ? 1 : 0, onPawn(p, sx * 0.14, 0.2 + 0.05 * sx * sw, sx * sw * 0.13), colorOf(p), 0.9); const b2 = Math.floor(bt); FX.text(b2 % 2 ? locKey("¡dos!") : locKey("¡un!"), "#ffffff", up(p.position, 0.85), (bt - b2) * 0.4, { life: 0.4, size: 0.42, tilt: 0 }); stepFx(x, path, w); }
      else { const t2 = (c - t1) * D, s2 = smooth(seg(c, 0.84, 0.88)); park(p, end, yaw); p.scale.set(0.95, 1.08 + 0.06 * Math.exp(-Math.max(0, c - 0.88) * D * 9), 0.95); face(p, { open: 0.9, mouth: "flat", noBlink: true }); hand(0, onPawn(p, 0.105, 0.2 + 0.2 * s2, 0.06), colorOf(p), 0.9); FX.text(locKey("¡Firme!"), x.col, up(end, 0.95), t2 - 0.2, { hold: true, size: 0.7 }); FX.ring(end, t2, x.col); flash(end, t2, x.col); }

    },
    limbo(x, c) {
      const { p, N, path, end } = moveOf(x, 32, 4), { D, J, col } = x, A = path[1], B = path[3], M = path[2], side = perpTo(A, B), yaw = yawTo(A, B), bh = 0.44; cue("pop", 0.2); [0.4, 0.48, 0.56].forEach((tm) => cue("pop", tm)); cue("tada", 0.7);
      const bs = backOut(seg(c, 0.18, 0.28)) * (1 - smooth(seg(c, 0.74, 0.82)));
      if (bs > 0.02) { for (const sx of [-1, 1]) { const ft = M.clone().addScaledVector(side, sx * 0.24).setY(0.16); rod(sx > 0 ? 1 : 0, ft, up(ft, (bh + 0.06) * bs), 0.012, "#ffc629"); } rod(2, M.clone().addScaledVector(side, -0.26).setY(0.16 + bh * bs), M.clone().addScaledVector(side, 0.26).setY(0.16 + bh * bs), 0.01, "#ff4b4b"); }
      if (c < 0.3) hopPath(p, path.slice(0, 2), c, 0, 0.26, { seat: x.seat });
      else if (c < 0.66) { const v = seg(c, 0.34, 0.62), lean = smooth(seg(c, 0.3, 0.36)) * (1 - smooth(seg(c, 0.62, 0.66))); park(p, A.clone().lerp(B, v), yaw); p.rotation.x = -1.15 * lean; p.position.y += abs(sin(v * PI * 6)) * 0.02 - 0.03 * lean; p.rotation.z = sin(v * PI * 6) * 0.08 * J; face(p, { ly: 0.9, open: 0.5, mouth: "flat", noBlink: true }); v > 0.3 && v < 0.7 && sweat(p.position, c * D, 2); stepFx(x, path, 1 + 2 * v); }
      else if (c < 0.74) { const v = seg(c, 0.66, 0.74); park(p, B, yaw + PI * 2 * easeIO(v)); p.position.y += arc(v) * 0.25 * J; face(p, { open: 0.3, noBlink: true }); }
      else if (N > 3) hopPath(p, path.slice(3), c, 0.74, 0.95, { seat: x.seat, startYaw: yaw, numbers: false }); else arrive(x, p, end, yaw, c, 0.74);
      FX.text(locKey("¡Limbo!"), "#ffd23f", up(M, 1.1), (c - 0.24) * D, { life: 1.2, size: 0.85 }); FX.text(locKey("¡Eeeso!"), col, up(B, 1), (c - 0.67) * D, { life: 0.9, size: 0.65 }); FX.burst(up(B, 0.6), (c - 0.67) * D, { count: 8, radius: 0.4, multi: true });

    },
    equilibrista(x, c) {
      const { p, N, path, end } = moveOf(x, 34), { D, J, col } = x, HH = 0.5, t0 = 0.14, t1 = 0.8, A = path[0], v = seg(c, t0, t1), yaw = yawTo(A, end); cue("pop", 0.02); cue("hop", 0.05); cue("stretch", 0.44); cue("hop", t1); cue("land", 0.9); cue("tada", 0.92);
      const rs = backOut(seg(c, 0.01, 0.08)) * (1 - smooth(seg(c, 0.9, 0.98))), at = A.clone().lerp(end, v), sag = c > 0.1 && c < t1 + 0.02 ? 0.07 : 0;
      if (rs > 0.02) { const a2 = up(A, HH * rs), b2 = up(end, HH * rs), mid2 = up(at, HH * rs - sag); rod(0, a2, mid2, 0.005, CREAM); rod(1, mid2, b2, 0.005, CREAM); rod(2, A.clone().setY(0.16), a2, 0.012, WOOD); rod(3, end.clone().setY(0.16), b2, 0.012, WOOD); }
      const scare = pulse(c, 0.42, 0.56), wob = (sin(now() * 5) * 0.12 + scare * sin(now() * 13) * 0.4) * J;
      if (c < t0) { hopArc(p, A, up(A, HH - sag), seg(c, 0.05, t0), 0.3); p.rotation.set(0, yaw, 0); face(p, WOW); }
      else if (c < t1) { park(p, up(at, HH - sag), yaw); p.rotation.z = wob; p.position.y += abs(sin(v * PI * N * 2)) * 0.012; face(p, scare > 0.2 ? { open: 1.4, size: 1.15, pupil: 0.5, mouth: "o", noBlink: true } : { ly: -0.7, open: 1.05, mouth: "flat" }); const bar = rightOf(yaw), mid2 = up(p.position, 0.2); for (const sx of [-1, 1]) hand(sx > 0 ? 1 : 0, mid2.clone().addScaledVector(bar, sx * 0.3).add(new V3(0, -sx * wob * 0.5, 0)), colorOf(p), 0.8); stepFx(x, path, N * v); }
      else if (c < 0.9) { hopArc(p, up(end, HH), end, seg(c, t1, 0.9), 0.2); p.rotation.set(PI * 2 * easeIO(seg(c, t1, 0.9)), yaw, 0); face(p, WOW); }
      arrive(x, p, end, yaw, c, 0.9, locKey("¡Sin red!")); FX.text(locKey("¡Uy uy uy!"), "#ffd23f", up(at, 1.3), (c - 0.43) * D, { life: 0.9, size: 0.65 });

    },
    palo(x, c) {
      const { p, N, path, end } = moveOf(x, 36), { D, J } = x, t0 = 0.1, t1 = 0.8, w = N * seg(c, t0, t1), g = w * 2; for (let q = 0; q < N * 2; q++) { cue("tap", t0 + ((t1 - t0) * q) / (N * 2)); cue("tap", t0 + ((t1 - t0) * (q + 0.25)) / (N * 2)); } cue("wii", 0.03); cue("land", 0.9);
      const yaw = ride(p, path, w), rear = pulse(c, t1, 0.92), gal = c > t0 && c < t1 ? abs(sin(g * PI)) : 0;
      p.position.y += 0.05 + gal * 0.1 * J + rear * 0.08; p.rotation.x = (c > t0 && c < t1 ? sin(g * PI * 2) * 0.18 : 0) - 0.6 * rear; face(p, { open: 0.5, mouth: "smile", mouthSize: 1.3, noBlink: true });
      const f = fwdOf(yaw), tail = p.position.clone().addScaledVector(f, -0.2).setY(0.19), nose = p.position.clone().addScaledVector(f, 0.2).setY(p.position.y + 0.2 + rear * 0.15), ss = backOut(seg(c, 0.02, 0.1)) * (1 - smooth(seg(c, 0.93, 1)));
      if (ss > 0.05) { rod(0, tail, nose, 0.012, WOOD); show(horse, nose, yaw, ss, -0.4 - rear * 0.5); }
      if (gal > 0.8) FX.puff(tail, 0.08, 0.4); stepFx(x, path, w); const v = (now() * 1.3) % 1; c > t0 && c < t1 && FX.text(locKey("tucutún"), "#ffffff", up(p.position, 0.7 + v * 0.15), v * 0.7, { life: 0.7, size: 0.32, tilt: 0.12 });
      FX.text(locKey("¡Arre!"), x.col, up(path[0], 1), (c - 0.04) * D, { life: 1, size: 0.75 }); FX.text(locKey("¡Hiiii!"), "#ffffff", up(end, 1.05), (c - t1) * D, { life: 1, size: 0.6 }); c > 0.92 && arrive(x, p, end, yaw, c, 0.92);

    },
    arbusto(x, c) {
      const { p, N, path, end } = moveOf(x, 38), { D, J } = x, rv = x.rival, dash = [[0.14, 0.26], [0.42, 0.54], [0.7, 0.8]], tL = 0.86; cue("pop", 0.03); dash.forEach(([a2]) => cue("whoosh", a2)); cue("pop", tL); cue("tada", tL + 0.02);
      let w = 0, moving = false; dash.forEach(([a2, b2], k) => { if (c >= a2) { w = (N * (k + smooth(seg(c, a2, b2)))) / 3; moving = c < b2; } });
      const yaw = ride(p, path, w), off = easeOut(seg(c, tL, 0.95));
      x.busy.add(rv); const Rp = pathAt(path, N * 0.5).addScaledVector(perpTo(path[0], path[N]), 0.5), looking = !moving && c > 0.26 && c < 0.7; park(rv, Rp, lerpAngle(yawTo(Rp, path[0]) + PI, yawTo(Rp, p.position), looking ? 1 : 0)); face(rv, looking ? { ...lookAt(rv, up(p.position, 0.3)), open: 0.55, mouth: "flat" } : { lx: 0.5, ly: 0.5, mouth: "o", mouthSize: 0.5 });
      if (c < 0.95) show(bush, p.position.clone().setY(0.17 + (moving ? abs(sin(c * D * 24)) * 0.04 : 0) + off * 0.9).addScaledVector(rightOf(yaw), off * 0.7), yaw + (moving ? sin(c * D * 24) * 0.15 : 0), backOut(seg(c, 0.02, 0.1)) * (1 - off * 0.6), off * 3);
      if (c < tL) { p.scale.setScalar(0.72); face(p, { lx: sin(now() * 4), open: 1 }); if (looking) for (const sx of [-1, 1]) FX.star(up(p.position, 0.52).addScaledVector(rightOf(camYaw(p.position)), sx * 0.05), 0.045, 0, 1, "#ffffff"); stepFx(x, path, w); }
      else { const t2 = (c - tL) * D; park(p, end, camYaw(end)); settle(p, t2, 1.6); p.position.y += t2 < 0.3 ? arc(t2 / 0.3) * 0.2 * J : 0; face(p, { open: 0.3, mouth: "o", mouthSize: 1.4, noBlink: true }); FX.text(locKey("¡Sorpresa!"), x.col, up(end, 1), t2, { hold: true, size: 0.8 }); FX.ring(end, t2, x.col); flash(end, t2, x.col); face(rv, { ...lookAt(rv, up(end, 0.3)), ...WOW }); }
      FX.text(locKey("¿Y ese arbusto?"), "#ffffff", up(Rp, 0.9), (c - 0.3) * D, { life: 1.3, size: 0.45 });

    },
    avioncito(x, c) {
      const { p, N, path, end } = moveOf(x, 40), { D, J } = x, t0 = 0.12, t1 = 0.8, w = N * smooth(seg(c, t0, t1)), v = seg(c, t0, t1); cue("whoosh", t0); cue("wii", 0.42); cue("slip", t1);
      const yaw = ride(p, path, w), fly2 = smooth(seg(c, 0.06, 0.18)) * (1 - smooth(seg(c, t1 - 0.06, t1 + 0.02))), bank = sin(v * PI * 3) * fly2, loop = seg(c, 0.42, 0.56);
      p.position.y += 0.32 * fly2 + sin(loop * PI) * 0.3; p.position.addScaledVector(rightOf(yaw), bank * 0.2); p.rotation.z = -bank * 0.7 * J; p.rotation.x = 0.5 * fly2 - PI * 2 * easeIO(loop); face(p, { open: 0.5, mouth: "o", mouthSize: 0.8, noBlink: true });
      if (c < 0.9) for (const sx of [-1, 1]) hand(sx > 0 ? 1 : 0, onPawn(p, sx * 0.22, 0.22, 0), colorOf(p), 0.9 * smooth(seg(c, 0.02, 0.1)) * (1 - smooth(seg(c, 0.84, 0.9))));
      if (fly2 > 0.3) for (let q = 1; q <= 6; q++) FX.puff(up(pathAt(path, w - q * 0.18), 0.3 * fly2 + 0.15), 0.05 + q * 0.012, 0.5 - q * 0.07);
      stepFx(x, path, w); const vv = (now() * 1.2) % 1; fly2 > 0.5 && FX.text(locKey("brrrum"), "#ffffff", up(p.position, 0.6), vv * 0.7, { life: 0.7, size: 0.32, tilt: 0.1 });
      if (c > t1 + 0.02) { const t2 = (c - t1 - 0.02) * D; FX.dust(end, t2, { count: 9, size: 0.15, seed: 7 }); settle(p, t2, 1.5); FX.ring(end, t2, x.col); FX.text(locKey("Aterrizaje perfecto"), x.col, up(end, 0.95), t2 - 0.1, { hold: true, size: 0.55 }); }

    },
    ventarron(x, c) {
      const { p, N, path, end } = moveOf(x, 6), { D, J } = x, t0 = 0.24, t1 = 0.76, w = c < t0 ? 0.3 * seg(c, 0.06, t0) : 0.3 + (N - 0.3) * easeIn(seg(c, t0, t1)); cue("blow", 0.02); cue("whoosh", t0); cue("blow", 0.4); cue("land", t1);
      const yaw = ride(p, path, w), f = fwdOf(yaw);
      if (c < t0) { p.rotation.x = -0.5 * smooth(seg(c, 0.04, 0.12)) * J; p.position.x += sin(now() * 50) * 0.004; face(p, { open: 0.3, mouth: "flat", noBlink: true }); FX.dust(p.position.clone().addScaledVector(f, 0.1), ((c * D * 2) % 0.5), { count: 4, size: 0.1, seed: 3 }); }
      else if (c < t1) { const v = seg(c, t0, t1); p.position.y += 0.15 + abs(sin(v * PI * 3)) * 0.25 * J; p.rotation.set(v * 26, yaw, v * 17); face(p, { open: 1.4, pupil: 0.5, mouth: "o", noBlink: true }); stepFx(x, path, w); }
      else { const t2 = (c - t1) * D; park(p, end, pathYaw(path, N - 0.01)); settle(p, t2, 2); p.rotation.z = sin(now() * 5) * 0.12 * Math.max(0, 1 - t2); face(p, { lx: cos(now() * 9), ly: sin(now() * 9), mouth: "o", noBlink: true }); FX.dust(end, t2, { count: 10, size: 0.17, seed: 5 }); flash(end, t2, x.col); FX.star(onPawn(p, 0.02, 0.44, 0), 0.1, 0.6, 1, "#3f9a4a"); }
      if (c < t1 + 0.05) for (let q = 0; q < 14; q++) { const s2 = (now() * (0.9 + rnd(q) * 0.6) + rnd(q * 3.3)) % 1, at = p.position.clone().addScaledVector(f, -1.2 + s2 * 2.2).addScaledVector(rightOf(yaw), (rnd(q * 5.1) - 0.5) * 0.9); at.y = 0.25 + rnd(q * 7.7) * 0.6 + sin(s2 * 9 + q) * 0.05; q % 3 ? FX.puff(at, 0.05, 0.45 * sin(s2 * PI), "#ffffff") : FX.star(at, 0.07, s2 * 12, sin(s2 * PI), q % 2 ? "#3f9a4a" : "#ff8a3d"); }
      FX.text(locKey("¡Fuuuu!"), "#bfefff", up(path[0], 1.1), (c - 0.03) * D, { life: 1.2, size: 0.8 });

    },
    charcos(x, c) {
      const { p, N, path, end } = moveOf(x, 8), { D, J } = x, t0 = 0.04, t1 = 0.8, w = N * seg(c, t0, t1), k = Math.min(N - 1, Math.floor(w)), fr = w - k, WET = "#6ec3ff";
      for (let q = 1; q <= N; q++) { const tq = t0 + ((t1 - t0) * q) / N, t2 = (c - tq) * D; cue("splash", tq); c < tq && FX.puff(path[q].clone().setY(0.19), 0.3, 0.55, WET); FX.ring(path[q], t2, WET, { max: 4 }); FX.dust(up(path[q], 0.05), t2, { count: 10, size: 0.09, spread: 0.5, color: WET, seed: q * 3 }); FX.text(locKey("¡Chof!"), WET, up(path[q], 0.8), t2, { life: 0.5, size: 0.5 }); }
      if (c < t1) { ride(p, path, k + easeIO(fr)); p.position.y += arc(fr) * (0.3 * J + 0.05); squash(p, fr < 0.15 ? 0.3 * sin((fr / 0.15) * PI) : -0.12 * sin(fr * PI)); tint(p, WET, 0.35 * (w / N)); face(p, { open: 0.3, mouth: "o", mouthSize: 1.4, noBlink: true }); }
      else { const t2 = (c - t1) * D, shake = t2 > 0.25 && t2 < 0.9 ? 1 : 0; park(p, end, pathYaw(path, N - 0.01) + shake * sin(t2 * 40) * 0.6); settle(p, t2); tint(p, WET, 0.35 * (1 - smooth((t2 - 0.25) / 0.6))); face(p, { open: shake ? 0.1 : 1, mouth: "smile", noBlink: !!shake }); if (shake) for (let q = 0; q < 8; q++) { const s2 = ((t2 - 0.25) * 2 + q / 8) % 1, ang = q * 0.8 + t2 * 6; FX.puff(up(end, 0.3).add(new V3(cos(ang) * 0.45 * s2, 0.1 * sin(s2 * PI), sin(ang) * 0.45 * s2)), 0.04, 1 - s2, WET); } }

    },
    cuenta(x, c) {
      const { p, N, path, end } = moveOf(x, 10, 4), { D, J, col } = x, S = path[N - 2], Bk = path[N - 3], yaw = yawTo(Bk, S); cue("pop", 0.36); cue("hop", 0.5); cue("land", 0.58); cue("tada", 0.94);
      if (c < 0.32) hopPath(p, path.slice(0, N - 1), c, 0, 0.32, { seat: x.seat });
      else if (c < 0.5) { const t2 = (c - 0.32) * D; park(p, S, yaw + sin(t2 * 3) * 0.5); face(p, { lx: sin(t2 * 3), ly: 0.6, open: 0.9, mouth: "flat" }); hand(0, onPawn(p, 0.07 + 0.02 * sin(t2 * 14), 0.44, 0.02), colorOf(p), 0.9); FX.text(loc('¿{a}… o {b}?',{a:N-2,b:N-1}), "#ffffff", up(S, 0.95), t2 - 0.1, { life: 1.3, size: 0.6 }); }
      else if (c < 0.6) { const v = seg(c, 0.5, 0.58); hopArc(p, S, Bk, v, 0.2); p.rotation.set(0, yaw, 0); face(p, { open: 0.6, mouth: "flat", noBlink: true }); FX.text(locKey("Otra vez…"), "#c9c3d6", up(Bk, 0.9), (c - 0.5) * D, { life: 1, size: 0.5 }); }
      else { const r2 = hopPath(p, path.slice(N - 3), c, 0.62, 0.92, { seat: x.seat, startYaw: yaw, numbers: false }); for (let q = 0; q < 3; q++) FX.text(String(N - 2 + q), col, up(path[N - 2 + q], 0.72), (c - (0.62 + ((q + 0.8) / 3) * 0.3)) * D, { life: 0.7, size: 0.5, tilt: 0 }); if (c > r2.landT) FX.text(loc('¡{count}! Ahora sí',{count:N}), col, up(end, 1.05), (c - r2.landT) * D - 0.15, { hold: true, size: 0.65 }); }

    },
    hipo(x, c) {
      const { p, N, path, end } = moveOf(x, 12), { D, J } = x, t0 = 0.04, t1 = 0.84, w = N * seg(c, t0, t1), k = Math.min(N - 1, Math.floor(w)), fr = w - k; for (let q = 0; q < N; q++) { cue("hop", t0 + ((t1 - t0) * q) / N); cue("pop", t0 + ((t1 - t0) * (q + 0.7)) / N); }
      const last = k === N - 1, hop = Math.min(1, fr / 0.5), hic = pulse(fr, 0.62, 0.86), yawE = pathYaw(path, N - 0.01);
      if (c < t1) { ride(p, path, k + easeIO(hop)); p.position.y += arc(hop) * 0.18 * J + hic * (last ? 0.9 : 0.14) * J; p.scale.set(1 - 0.12 * hic, 1 + 0.2 * hic, 1 - 0.12 * hic); p.rotation.x = last ? PI * 2 * smooth(seg(fr, 0.62, 0.86)) : 0; face(p, hic > 0.1 ? { open: 1.4, size: 1.15, pupil: 0.5, mouth: "o", mouthSize: 0.6, noBlink: true } : { open: 0.9, mouth: "flat" }); fr > 0.62 && FX.text(last ? locKey("¡HIP!") : locKey("¡hip!"), "#ffffff", up(pathAt(path, k + 1), 0.85), (fr - 0.62) * 1.2, { life: 0.45, size: last ? 0.8 : 0.45, tilt: 0.15 }); stepFx(x, path, w); }
      else { const t2 = (c - t1) * D; park(p, end, yawE); settle(p, t2, 2); face(p, { lx: -0.7, open: 1.1, mouth: "flat" }); hand(0, onPawn(p, 0.01, 0.265, 0.13), colorOf(p), 1); FX.dust(end, t2, { count: 9, size: 0.15, seed: 6 }); FX.ring(end, t2, x.col); FX.text(locKey("perdón"), "#ffffff", up(end, 0.9), t2 - 0.3, { life: 1.2, size: 0.45 }); }

    },
    iman(x, c) {
      const { p, N, path, end } = moveOf(x, 14), { D, J } = x, t0 = 0.16, tC = 0.7, yawE = pathYaw(path, N - 0.01), fE = fwdOf(yawE), mp = end.clone().addScaledVector(fE, 0.34).setY(0.42), w = (N - 0.25) * easeIn(seg(c, t0, tC)); cue("pop", 0.03); cue("rumble", t0); cue("zap", 0.4); cue("clap", tC); cue("bonk", tC); cue("pop", 0.84); cue("land", 0.92);
      const ms = backOut(seg(c, 0.02, 0.1)) * (1 - smooth(seg(c, 0.82, 0.88)));
      show(magnet, mp.clone().add(new V3(0, sin(now() * 40) * 0.006 * (c > t0 && c < tC ? 1 : 0), 0)), yawE, ms, PI / 2);
      if (c < tC) { const yaw = ride(p, path, w), pull = smooth(seg(c, t0, t0 + 0.08)); p.rotation.x = -0.45 * pull * J; p.position.y += 0.1 * smooth(seg(c, 0.4, tC)); face(p, pull > 0.3 ? { open: 1.4, pupil: 0.5, mouth: "o", noBlink: true } : { ...lookAt(p, mp), open: 1.1 }); if (pull > 0.3) { FX.puff(p.position.clone().addScaledVector(fwdOf(yaw), -0.1).setY(0.22), 0.07, 0.4); for (let q = 0; q < 3; q++) { const s2 = (now() * 2 + q / 3) % 1; FX.star(up(p.position, 0.25).lerp(mp, s2), 0.06, now() * 9 + q, 1 - s2, "#fff36b"); } } stepFx(x, path, w); }
      else if (c < 0.84) { const t2 = (c - tC) * D; park(p, mp.clone().addScaledVector(fE, -0.14).setY(0.3), yawE); p.scale.set(1.25, 1 + 0.1 * Math.exp(-t2 * 6), 0.6 + 0.25 * (1 - Math.exp(-t2 * 5))); face(p, { open: 0.1, mouth: "flat", noBlink: true }); t2 < 0.5 && (Re += 0.08 * J * Math.exp(-t2 * 9)); }
      else if (c < 0.92) { hopArc(p, mp.clone().addScaledVector(fE, -0.14).setY(0.3), end, seg(c, 0.84, 0.92), 0.1); p.rotation.set(0, yawE, 0); face(p, WOW); }
      arrive(x, p, end, yawE, c, 0.92); FX.text(locKey("¡CLANK!"), "#c9d3de", up(mp, 0.5), (c - tC) * D, { life: 1, size: 1 }); FX.burst(mp, (c - tC) * D, { count: 8, radius: 0.5, color: "#fff36b" }); FX.text(locKey("bzzzt"), "#fff36b", up(pathAt(path, N / 2), 0.9), (c - 0.4) * D, { life: 0.9, size: 0.5, tilt: 0.15 });

    },
    papagayo(x, c) {
      const { p, N, path, end } = moveOf(x, 16), { D, J } = x, t0 = 0.14, t1 = 0.8, w = N * smooth(seg(c, t0, t1)), yaw = ride(p, path, w), f = fwdOf(yaw); cue("pop", 0.03); cue("whoosh", t0); cue("wii", 0.3); cue("land", 0.9);
      const lift = smooth(seg(c, 0.1, 0.22)) * (1 - smooth(seg(c, t1, 0.9))), gone = easeIn(seg(c, t1, 0.98));
      const kp = p.position.clone().addScaledVector(f, 0.9 + gone * 2).addScaledVector(rightOf(yaw), sin(now() * 1.7) * 0.25); kp.y = 1.5 + sin(now() * 2.3) * 0.1 + gone * 3;
      show(kite, kp, yaw + PI, backOut(seg(c, 0.02, 0.12)), -0.5, sin(now() * 2) * 0.25); kite.userData.tail.forEach((tl, k) => { tl.position.x = sin(now() * 5 - k * 0.9) * 0.05 * (k + 1); tl.rotation.z = PI / 4 + sin(now() * 6 + k) * 0.5; });
      p.position.y += 0.3 * lift + sin(now() * 4) * 0.04 * lift; p.rotation.x = 0.55 * lift * J; p.rotation.z = sin(now() * 3) * 0.2 * lift; face(p, lift > 0.3 ? { open: 1.3, mouth: "o", ly: 0.6, noBlink: true } : { ...lookAt(p, kp), open: 1.1 });
      if (c < t1 + 0.02) { rod(0, onPawn(p, 0, 0.42, 0.05), kp, 0.003, "#ffffff"); hand(0, onPawn(p, 0, 0.46, 0.06), colorOf(p), 0.8); }
      stepFx(x, path, w); c > 0.9 && arrive(x, p, end, yaw, c, 0.9); FX.text(locKey("¡Papagayo!"), x.col, up(path[0], 1.1), (c - 0.05) * D, { life: 1.2, size: 0.75 }); FX.text(locKey("¡Adiós, papagayo!"), "#ffffff", up(end, 1.05), (c - t1 - 0.04) * D, { life: 1.3, size: 0.5 });

    },
  });


  function MathLerp(a2, b2, v) { return a2 + (b2 - a2) * v; }

  


  return {actions, avatar, reset(){Re=0;for(const p of props)p.visible=false;}, props};
}

