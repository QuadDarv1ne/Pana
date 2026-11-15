import { locKey } from '/engine/i18n.js';
// Capture poses adapted from the supplied Ludo Studio reference.
export function createCaptureLibrary(ctx) {
  const {
    clamp: e,
    smooth: t,
    easeOut: n,
    easeIO: s,
    elastic: r,
    easeIn: $t,
    backOut: oi,
    lookAt: Fe,
    flash: Ge,
    celebrate: It,
    FX: Q,
    face: X,
    tint: en,
    approach: et,
    hopTo: ft,
    flyHome: gt,
    dizzyHome: ht,
    V3: i,
    hemi: j,
    cue: le,
    scared: st,
    cloud: te,
    bump: ce,
    up: ve,
    mallet: T,
    bolt: ae,
    viewCamera: ue,
  } = ctx;
  const fn = { lerp: (a, b, t) => a + (b - a) * t },
    fe = {
      get clock() {
        return ctx.time;
      },
    };
  let Re = 0;
  return {
    stomp(_, c) {
      let {
          mover: v,
          victim: y,
          V: w,
          P: J,
          yawV: K,
          D: z,
          J: R,
          sq: O,
          H: G,
          col: N,
        } = _,
        Y = 0.56,
        $ = 0.68,
        V = 0.92;
      if (
        (le("boing", 0.38),
        le("pum", Y),
        le("boing", $),
        le("land", V),
        c < 0.3)
      )
        et(_, c);
      else if (c < 0.38) {
        let D = Math.sin((e((c - 0.3) / 0.08) * Math.PI) / 2),
          b = D * O * 2 * R;
        (v.position.copy(J),
          v.rotation.set(0, K, 0),
          v.scale.set(1 + b * 0.5, 1 - b, 1 + b * 0.5),
          X(v, {
            ...Fe(v, ve(w, 0.3)),
            open: 0.45,
            mouth: "flat",
            noBlink: !0,
          }));
      } else if (c < Y) {
        let D = (c - 0.38) / (Y - 0.38),
          b = -O * R * Math.sin(D * Math.PI);
        (v.position.copy(J).lerp(w, s(D)),
          (v.position.y += 4 * (G * 2.6 * R + 0.2) * D * (1 - D) + 0.092 * D),
          v.rotation.set(R >= 0.4 ? Math.PI * 2 * t(D) : 0, K, 0),
          v.scale.set(1 + b * 0.5, 1 - b, 1 + b * 0.5),
          X(v, { ly: -0.6, open: 1.2, mouth: "o", noBlink: !0 }));
      }
      if (c < Y) st(_, c, 0.3);
      else if (c < $) {
        let D = (c - Y) * z,
          b =
            fn.lerp(1, 0.22, e(D / 0.05)) +
            0.05 * Math.exp(-D * 8) * Math.sin(D * 40);
        (y.position.copy(w),
          y.rotation.set(0, _.yawP, 0),
          y.scale.set(1 + (1 - b) * 0.7, b, 1 + (1 - b) * 0.7),
          X(y, { open: 0.12, mouth: "flat", noBlink: !0 }));
        let k = O * 1.6 * R * Math.exp(-D * 7) * Math.sin(D * 24);
        (v.position.set(w.x, w.y + 0.42 * b, w.z),
          v.rotation.set(0, K, 0),
          v.scale.set(1 + k * 0.5, 1 - k, 1 + k * 0.5),
          X(v, { open: D < 0.2 ? 0.35 : 1, noBlink: !0 }));
      } else {
        c < V ? gt(_, c, w, $, V) : ht(_, c, V);
        let D = (c - $) * z,
          b = e(D / 0.12);
        D < 0.12
          ? (v.position.set(w.x, w.y + 0.092 * (1 - b * b), w.z),
            v.rotation.set(0, K, 0),
            X(v, {}))
          : It(_, c, $ + 0.12 / z);
      }
      let I = (c - Y) * z;
      return (
        I >= 0 &&
          (Q.text(locKey("¡PUM!"), "#ff5a3c", ve(w, 1), I, { life: 1.2, size: 1 }),
          Q.burst(ve(w, 0.25), I, { count: 12, radius: 0.8 }),
          Q.dust(w, I, {
            count: 14,
            size: 0.24,
            spread: 0.6,
            life: 0.7,
            seed: 51,
          }),
          Q.ring(w, I, N, { max: 5 }),
          Ge(w, I, N),
          I < 0.7 && (Re += 0.1 * R * Math.exp(-I * 8))),
        {}
      );
    },
    bowl(_, c) {
      let {
          mover: v,
          victim: y,
          V: w,
          P: J,
          dir: K,
          yawV: z,
          D: R,
          J: O,
          sq: G,
          col: N,
        } = _,
        Y = 0.47,
        $ = w.clone().addScaledVector(K, 1.25),
        V = 0.7,
        I = 0.92,
        D = J.clone().addScaledVector(K, -0.14),
        b = w.clone().addScaledVector(K, 0.3),
        k = 0.5;
      if (
        (le("whoosh", 0.42),
        le("strike", Y),
        le("land", V),
        le("land", I),
        c < 0.3)
      )
        et(_, c);
      else if (c < 0.42) {
        let pe = t((c - 0.3) / 0.12),
          ge = pe * G * 1.2 * O;
        (v.position.copy(J).lerp(D, pe),
          (v.position.x += Math.sin(fe.clock * 70) * 0.007 * pe * O),
          v.rotation.set(-0.35 * pe * O, z, 0),
          v.scale.set(1 + ge * 0.5, 1 - ge, 1 + ge * 0.5),
          X(v, {
            ...Fe(v, ve(w, 0.3)),
            open: 0.4,
            mouth: "flat",
            noBlink: !0,
          }));
      } else if (c < k) {
        let pe = e((c - 0.42) / (k - 0.42)),
          ge = (De) => D.clone().lerp(b, De * De);
        (v.position.copy(ge(pe)),
          v.rotation.set(0.55 * O, z, 0),
          v.scale.set(0.9, 1.12, 0.9),
          X(v, { open: 1.2, ly: 0.2, mouth: "o", noBlink: !0 }));
        for (let De = 1; De <= 5; De++) {
          let Ce = pe - De * 0.09;
          Ce > 0 &&
            Q.puff(
              ve(ge(Ce), 0.05 + De * 0.01),
              0.09 + De * 0.025,
              0.55 - De * 0.09,
            );
        }
      } else if (c < 0.66) {
        let pe = (c - k) * R,
          ge = n(pe / 0.4);
        (v.position.copy(b).lerp(w, ge),
          v.rotation.set(
            0.55 * O * (1 - ge) - 0.25 * O * Math.sin(ge * Math.PI),
            z,
            0,
          ));
        let De = G * 1.2 * O * Math.exp(-pe * 6) * Math.sin(pe * 20);
        (v.scale.set(1 + De * 0.5, 1 - De, 1 + De * 0.5),
          X(v, { open: 1, mouth: "o" }),
          Q.dust(b, pe, { count: 6, size: 0.12, seed: 81 }));
      } else It(_, c, 0.66);
      if (c < Y) st(_, c, 0.36);
      else if (c < V) {
        let pe = (c - Y) / (V - Y),
          ge = w.clone().lerp($, n(pe));
        ((ge.y += 4 * (0.9 * O + 0.2) * pe * (1 - pe)),
          y.position.copy(ge),
          y.rotation.set(Math.PI * 6 * pe, _.yawP, Math.sin(pe * 9) * 0.5),
          X(y, { open: 1.3, size: 1.2, pupil: 0.5, mouth: "o", noBlink: !0 }));
      } else
        c < I
          ? gt(_, c, $, V, I, { height: 1.1, spinX: 3, spinZ: 1 })
          : ht(_, c, I);
      let re = (c - Y) * R;
      return (
        re >= 0 &&
          (Q.text(locKey("¡STRIKE!"), "#ffd23f", ve(w, 1), re, {
            life: 1.3,
            size: 1.05,
          }),
          Q.burst(ve(w, 0.3), re, { count: 16, radius: 1, multi: !0 }),
          Q.dust(w, re, { count: 12, size: 0.2, spread: 0.5, seed: 52 }),
          Q.ring(w, re, N, { max: 4 }),
          Ge(w, re, N),
          re < 0.6 && (Re += 0.08 * O * Math.exp(-re * 9))),
        Q.dust($, (c - V) * R, { count: 9, size: 0.17, seed: 61 }),
        {}
      );
    },
    gulp(_, c) {
      let {
          mover: v,
          victim: y,
          V: w,
          P: J,
          yawV: K,
          D: z,
          J: R,
          sq: O,
          col: G,
        } = _,
        N = 0.72,
        Y = 0.92,
        $ = 1 + 0.55 * R;
      (le("inflate", 0.3), le("gulp", 0.54), le("spit", N), le("land", Y));
      let V = 1;
      if (c < 0.3) et(_, c);
      else if (c < 0.44) {
        let b = (c - 0.3) / 0.14;
        ((V = 1 + ($ - 1) * r(b)),
          v.position.copy(J),
          v.rotation.set(-0.15 * R, K, 0),
          v.scale.setScalar(V),
          X(v, {
            ...Fe(v, ve(w, 0.3)),
            open: 1.1,
            mouth: "o",
            mouthSize: 1 + 2.4 * R * t(b / 0.6),
            noBlink: !0,
          }));
      } else if (c < 0.54) {
        let b = (c - 0.44) / 0.1;
        ((V = $),
          v.position.copy(J).lerp(w, s(b)),
          (v.position.y += 4 * 0.15 * R * b * (1 - b)),
          v.rotation.set(0.3 * R * Math.sin(b * Math.PI), K, 0),
          v.scale.setScalar(V),
          X(v, { open: 1.2, mouth: "o", mouthSize: 1 + 3 * R, noBlink: !0 }));
      } else if (c < N) {
        let b = (c - 0.54) * z,
          k = Math.sin(b * 22) * R;
        (v.position.copy(w),
          v.rotation.set(0, K, Math.sin(b * 8) * 0.1 * R),
          v.scale.set(
            $ * (1.18 + 0.06 * k),
            $ * (0.92 - 0.06 * k),
            $ * (1.18 + 0.06 * k),
          ),
          X(v, { open: 0.15, mouth: "flat", noBlink: !0 }),
          b > 0.2 &&
            Q.text(
              locKey("ñam ñam"),
              "#ff8fd0",
              ve(w, 0.95 + 0.05 * Math.sin(b * 10)),
              b - 0.2,
              { life: 0.7, size: 0.45, tilt: 0.1 },
            ));
      } else if (c < 0.84) {
        let b = (c - N) * z,
          k = 1 + ($ - 1) * Math.exp(-b * 6) * Math.cos(b * 14);
        (v.position.copy(w),
          v.rotation.set(-0.4 * R * Math.exp(-b * 6), K, 0),
          v.scale.setScalar(k),
          X(v, {
            open: 1,
            mouth: b < 0.25 ? "o" : "smile",
            mouthSize: b < 0.25 ? 2 : 1,
          }));
      } else It(_, c, 0.84);
      if (c < 0.44) st(_, c, 0.32);
      else if (c < 0.54) {
        let b = (c - 0.44) / 0.1,
          k = v.position
            .clone()
            .add(new i(0, 0.27 * $, 0))
            .addScaledVector(_.dir, -0.05),
          re = 1 - $t(b);
        (y.position.copy(w).lerp(k.clone().add(new i(0, -0.2 * re, 0)), $t(b)),
          y.rotation.set(0, _.yawP + b * Math.PI * 3, 0),
          y.scale.set(re * 0.8 + 0.02, re * 1.3 + 0.02, re * 0.8 + 0.02),
          X(y, { open: 1.4, size: 1.3, pupil: 0.4, mouth: "o", noBlink: !0 }));
      } else
        c < N
          ? (y.visible = !1)
          : c < Y
            ? (gt(_, c, ve(w, 0.25), N, Y, {
                height: 1.3,
                spinX: 5,
                spinZ: 1,
                scaleFrom: 0.25,
              }),
              en(y, "#b9ff9e", 1 - t(((c - N) / (Y - N)) * 0.6)))
            : (ht(_, c, Y),
              en(y, "#b9ff9e", 0.4 * (1 - t(((c - Y) * z) / 0.8))));
      let I = (c - 0.54) * z;
      I >= 0 &&
        (Q.text(locKey("¡ÑAM!"), "#ff8fd0", ve(w, 1.05), I, {
          life: 1,
          size: 0.95,
        }),
        Q.burst(ve(w, 0.45), I, { count: 8, radius: 0.5, color: "#ff8fd0" }),
        Ge(w, I, G),
        I < 0.4 && (Re += 0.04 * R * Math.exp(-I * 10)));
      let D = (c - N) * z;
      return (
        D >= 0 &&
          (Q.text(locKey("¡PTUÍ!"), "#8dff8a", ve(w, 1.05), D, {
            life: 1.1,
            size: 0.9,
          }),
          Q.dust(ve(w, 0.3), D, {
            count: 10,
            size: 0.13,
            spread: 0.45,
            color: "#c9ffb5",
            seed: 91,
          })),
        {}
      );
    },
    zap(_, c) {
      let {
          mover: v,
          victim: y,
          V: w,
          P: J,
          yawV: K,
          D: z,
          J: R,
          sq: O,
          col: G,
        } = _,
        N = 0.47,
        Y = 0.66,
        $ = 0.92;
      (le("rumble", 0.33), le("zap", N), le("hop", Y), le("land", $));
      let V = (c - 0.32) * z;
      if (c > 0.32 && c < 0.66) {
        let b = c < 0.6 ? r(V / 0.5) : 1 - t((c - 0.6) / 0.06);
        ((te.visible = b > 0.01),
          te.scale.setScalar(
            Math.max(0.01, b) * (1 + 0.04 * Math.sin(fe.clock * 6)),
          ),
          te.position.set(w.x + Math.sin(fe.clock * 2) * 0.03, 2.05, w.z));
      }
      let I = (c - N) * z;
      if (
        (I >= 0 &&
          I < 0.32 &&
          Math.floor(I * 28) % 3 !== 2 &&
          ((ae.visible = !0),
          ae.position.set(w.x - 0.03, 0.58, w.z),
          ae.rotation.set(
            0,
            Math.atan2(ue.position.x - w.x, ue.position.z - w.z),
            0,
          ),
          ae.scale.set(Math.floor(I * 28) % 2 ? -1.7 : 1.7, 1, 1),
          (j.intensity = 2.5 + 5 * Math.exp(-I * 8))),
        c < 0.3)
      )
        et(_, c);
      else if (c < N) {
        let b = t((c - 0.3) / 0.08),
          k = -O * 0.9 * R * b;
        (v.position.copy(J),
          v.rotation.set(
            -0.3 * b * R,
            K + Math.sin(fe.clock * 14) * 0.12 * b,
            0,
          ),
          v.scale.set(1 + k * 0.5, 1 - k, 1 + k * 0.5),
          X(v, { ly: 0.9, lx: 0.2, open: 1.1, mouth: "o", noBlink: !0 }));
      } else if (c < 0.78) {
        let b = (c - N) * z;
        (v.position.copy(J),
          (v.position.y += Math.abs(Math.sin(b * 18)) * 0.03 * R),
          v.rotation.set(-0.25 * R, K, Math.sin(b * 9) * 0.08 * R),
          X(v, { open: 0.25, mouth: "o", mouthSize: 1.4, noBlink: !0 }),
          b > 0.15 &&
            Q.text(locKey("jajaja"), "#fff36b", ve(J, 0.85), b - 0.15, {
              life: 0.9,
              size: 0.45,
              tilt: 0.12,
            }));
      } else c < 0.86 ? ft(_, c, 0.78, 0.86, J, w) : It(_, c, 0.86);
      let D = (b, k) => {
        for (let re = 0; re < 5; re++) {
          let pe = (k * 0.9 + re * 0.2) % 1;
          Q.puff(
            b
              .clone()
              .add(
                new i(
                  Math.sin(re * 2.1 + pe * 3) * 0.06,
                  0.45 + pe * 0.55,
                  Math.cos(re * 1.7) * 0.05,
                ),
              ),
            0.08 + pe * 0.16,
            (1 - pe) * 0.55,
            "#5d5560",
          );
        }
      };
      if (c < N) st(_, c, 0.34);
      else if (c < Y) {
        (y.position.copy(w), y.rotation.set(0, _.yawP, 0));
        let b = I,
          k = I < 0.32 ? 1 : 0.25;
        ((y.position.x += Math.sin(fe.clock * 95) * 0.012 * k * R),
          y.scale.set(1.03, 0.97 + 0.03 * Math.sin(b * 40) * k, 1.03),
          en(y, "#2e2a33", 1),
          X(y, {
            open: b < 0.32 ? 1.4 : 0.55,
            size: 1.1,
            pupil: b < 0.32 ? 0.3 : 1,
            mouth: "flat",
            noBlink: b < 0.32,
          }),
          D(w, b));
      } else
        c < $
          ? (gt(_, c, w, Y, $, {
              height: 0.45,
              spinX: 0,
              spinZ: 0,
              trail: !1,
              face: { open: 0.5, mouth: "sad", ly: -0.6 },
            }),
            (y.rotation.z = Math.sin(fe.clock * 10) * 0.12),
            en(y, "#2e2a33", 1 - t((c - Y) / ($ - Y)) * 0.5),
            D(y.position, (c - Y) * z))
          : (ht(_, c, $, {
              dizzy: !1,
              face: { open: 0.5, mouth: "sad", ly: -0.5 },
            }),
            en(y, "#2e2a33", 0.5 * (1 - t(((c - $) * z) / 0.9))),
            D(_.VB, (c - $) * z));
      return (
        I >= 0 &&
          (Q.text(
            locKey("¡ZAS!"),
            "#fff36b",
            w.clone().add(new i(0.6, 0.85, 0.45)),
            I,
            { life: 1.1, size: 0.95 },
          ),
          Q.burst(ve(w, 0.35), I, { count: 12, radius: 0.7, color: "#fff36b" }),
          Q.ring(w, I, "#fff36b", { max: 5 }),
          Ge(w, I, "#fff36b"),
          I < 0.5 && (Re += 0.07 * R * Math.exp(-I * 9))),
        {}
      );
    },
    balloon(_, c) {
      let {
          mover: v,
          victim: y,
          V: w,
          P: J,
          yawV: K,
          D: z,
          J: R,
          sq: O,
          col: G,
        } = _,
        N = 0.8,
        Y = 0.84,
        $ = 0.92,
        V = (b) => 1 + 1.3 * R * b;
      if (
        (le("inflate", 0.33),
        le("plop", N),
        le("whoosh", Y),
        le("land", $),
        c < 0.3)
      )
        et(_, c);
      else if (c < 0.62) {
        let b = (c - 0.3) * z,
          k = Math.max(0, Math.sin(b * 11));
        (v.position.copy(J),
          v.rotation.set(0.25 * k * R, K, 0),
          v.scale.set(1 + 0.14 * k * R, 1 - 0.06 * k * R, 1 + 0.14 * k * R),
          X(v, { open: 0.45, mouth: "o", mouthSize: 0.8 + k, noBlink: !0 }),
          k > 0.6 &&
            Q.puff(ve(J.clone().lerp(w, 0.5), 0.3), 0.06 + k * 0.05, 0.35));
      } else if (c < N) {
        let b = (c - 0.62) * z;
        (v.position.copy(J),
          (v.position.y += Math.abs(Math.sin(b * 16)) * 0.025 * R),
          v.rotation.set(0, K, 0),
          X(v, {
            ...Fe(v, ve(y.position, 0.4)),
            open: 0.3,
            mouth: "o",
            noBlink: !0,
          }));
      } else c < 0.88 ? ft(_, c, N, 0.88, J, w) : It(_, c, 0.88);
      if (c < 0.33) st(_, c, 0.31);
      else if (c < N) {
        let b = t((c - 0.33) / 0.27),
          k = V(b),
          re = 0.05 * Math.sin(fe.clock * 9) * b,
          pe = $t((c - 0.55) / 0.25) * 1.7;
        (y.position.copy(w),
          (y.position.y += Math.max(0, pe) + 0.04 * b),
          (y.position.x += Math.sin(fe.clock * 3) * 0.08 * t((c - 0.55) / 0.1)),
          y.rotation.set(0, _.yawP, Math.sin(fe.clock * 2.5) * 0.15 * b),
          y.scale.set(k * 1.12 + re, k * 0.95 - re, k * 1.12 + re),
          X(y, {
            open: 1.3,
            size: 1.05,
            pupil: 0.55,
            mouth: "o",
            ly: c > 0.55 ? -0.8 : 0.2,
            noBlink: !0,
          }),
          c > 0.5 &&
            Q.text(
              locKey("¡Auxilio!"),
              "#ffffff",
              ve(y.position, 0.95 * k),
              (c - 0.5) * z,
              { life: 0.9, size: 0.45, tilt: -0.1 },
            ));
      } else if (c < Y) y.visible = !1;
      else if (c < $) {
        let b = (c - Y) / ($ - Y);
        (y.position.copy(_.VB),
          (y.position.y += 2.4 * (1 - $t(b))),
          y.rotation.set(0, 0, Math.sin(b * 12) * 0.2),
          y.scale.set(0.88, 1.18, 0.88),
          X(y, { open: 1.3, mouth: "o", ly: -0.9, noBlink: !0 }));
      } else ht(_, c, $);
      let I = ve(w, 1.75 + 0.55),
        D = (c - N) * z;
      return (
        D >= 0 &&
          (Q.text(locKey("¡PLOP!"), "#ff8fd0", ve(I, 0.55), D, {
            life: 1.1,
            size: 0.9,
          }),
          Q.burst(I, D, { count: 16, radius: 0.8, multi: !0 }),
          Q.confetti(I, D, { count: 40, power: 0.6, seed: 13 }),
          D < 0.4 && (Re += 0.05 * R * Math.exp(-D * 10))),
        {}
      );
    },
    mallet(_, c) {
      let {
          mover: v,
          victim: y,
          V: w,
          P: J,
          yawV: K,
          D: z,
          J: R,
          sq: O,
          col: G,
        } = _,
        N = 0.5,
        Y = 0.8,
        $ = 0.92;
      if (
        (le("pop", 0.31),
        le("whoosh", 0.46),
        le("bonk", N),
        le("boing", Y),
        c > 0.3 && c < 0.72)
      ) {
        let D = r(((c - 0.3) * z) / 0.4),
          b = 1 - t((c - 0.64) / 0.08),
          k;
        if (c < 0.4) k = -0.35;
        else if (c < 0.47) k = fn.lerp(-0.35, -0.95, n((c - 0.4) / 0.07));
        else if (c < N) k = fn.lerp(-0.95, 0.8, $t((c - 0.47) / (N - 0.47)));
        else {
          let re = (c - N) * z;
          k = 0.8 - 0.12 * Math.exp(-re * 8) * Math.abs(Math.sin(re * 30));
        }
        (c > 0.6 && (k = fn.lerp(k, -0.4, t((c - 0.6) / 0.1))),
          (T.visible = !0),
          T.position.copy(J).add(new i(0, 0.25, 0)),
          (T.rotation.order = "YXZ"),
          T.rotation.set(k, K, 0),
          T.scale.setScalar(Math.max(0.01, D * b)));
      }
      if (c < 0.3) et(_, c);
      else if (c < 0.47) {
        let D = t((c - 0.4) / 0.07);
        (v.position.copy(J), v.rotation.set(-0.3 * D * R, K, 0));
        let b = D * O * R;
        (v.scale.set(1 + b * 0.5, 1 - b, 1 + b * 0.5),
          X(v, {
            ...Fe(v, ve(w, 0.3)),
            open: 0.4 + 0.6 * (1 - D),
            mouth: D > 0.5 ? "flat" : "o",
            noBlink: !0,
          }));
      } else if (c < 0.68) {
        let D = (c - 0.47) * z;
        (v.position.copy(J),
          v.rotation.set(0.35 * R * Math.exp(-D * 4), K, 0),
          X(v, {
            open: c < N ? 1.2 : 0.3,
            mouth: c < N ? "o" : "smile",
            noBlink: !0,
          }));
      } else c < 0.76 ? ft(_, c, 0.68, 0.76, J, w) : It(_, c, 0.76);
      if (c < N) st(_, c, 0.4);
      else if (c < 0.64) {
        let D = (c - N) * z,
          b = e((c - N - 0.03) / 0.1);
        (y.position.copy(w),
          (y.position.y -= 0.6 * $t(b)),
          y.rotation.set(0, _.yawP, 0));
        let k = D < 0.05 ? fn.lerp(1, 0.45, D / 0.05) : 0.45;
        (y.scale.set(1.35, k, 1.35),
          X(y, { open: 0.1, mouth: "flat", noBlink: !0 }),
          b >= 1 && (y.visible = !1));
      } else if (c < Y) y.visible = !1;
      else if (c < $) {
        let D = (c - Y) / ($ - Y);
        (y.position.copy(_.VB),
          (y.position.y += -0.5 * (1 - oi(D))),
          y.rotation.set(0, 0, 0));
        let b = 0.3 * Math.sin(D * Math.PI);
        (y.scale.set(1 - b * 0.4, 1 + b, 1 - b * 0.4),
          X(y, { open: 1.4, size: 1.2, pupil: 0.5, mouth: "o", noBlink: !0 }));
      } else ht(_, c, $);
      c >= Y &&
        (ce.parent !== y && y.add(ce),
        (ce.visible = !0),
        ce.position.set(0.05, 0.4, 0.03),
        ce.scale.setScalar(0.4 + 0.6 * r(((c - Y) * z) / 0.6)));
      let V = (c - N) * z;
      V >= 0 &&
        (Q.text(locKey("¡BONK!"), "#ff5a3c", ve(w, 1.05), V, { life: 1.2, size: 1 }),
        Q.burst(ve(w, 0.45), V, { count: 12, radius: 0.7 }),
        Q.dust(w, V, {
          count: 16,
          size: 0.24,
          spread: 0.6,
          life: 0.75,
          seed: 57,
        }),
        Q.ring(w, V, G, { max: 5 }),
        Ge(w, V, G),
        V < 0.7 && (Re += 0.12 * R * Math.exp(-V * 8)));
      let I = (c - Y) * z;
      return (
        I >= 0 &&
          (Q.dust(_.VB, I, { count: 10, size: 0.17, spread: 0.4, seed: 93 }),
          Q.burst(ve(_.VB, 0.4), I, {
            count: 6,
            radius: 0.35,
            color: "#ffffff",
          })),
        {}
      );
    },
  };
}
