/**
 * watchface.js — Apple Watch "Liquid Menu" (Debug Lv.2)
 *
 * Faithful 1:1 port of the reference (ics-ikeda 250909_apple_watch_modoki).
 * The math below is copied verbatim from the original; only the DOM/pointer
 * glue is adapted. Do not "simplify" the curves — they are what make the
 * fisheye look right.
 *
 * Pipeline per frame (see original W().iconMapRefresh):
 *   1. axial position from cube hex coords (+ pan offset)
 *   2. polar (radius, radian)
 *   3. warp radius outward + per-icon depth (both shrink with radius)
 *   4. position from warped radius
 *   5. round + vertical stretch ×1.15
 *   6. rectangular scale falloff (inner full → outer 0.2×depth)
 *   7. edge position push
 *   8. translate + scale
 */
(function () {
  'use strict';

  var screenEl = document.getElementById('watchScreen');
  var iconsEl = document.getElementById('watchIcons');
  if (!screenEl || !iconsEl) return;

  // ── Constants (verbatim from the reference) ─────────────────────────────
  var SIZE_W = 360, SIZE_H = 400;
  var SPACING = 55;        // hex spacing
  var DEPTH_R = 150;       // radius at which depth normalises
  var D = 24;              // falloff margin
  var RINGS = 10;          // cube rings 0..9 → 271 cells
  var Y_STRETCH = 1.15;
  var PAN_MAX_X = 360 * 1.3;   // ±468
  var PAN_MAX_Y = 400;         // ±400
  var EASE = 0.1;
  var HALF = 35;               // half of 70px icon
  var REDUCED = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Easings (verbatim) ──────────────────────────────────────────────────
  function I(s) { return -0.5 * (Math.cos(Math.PI * s) - 1); }     // easeInOutSine
  function C(s) { return s < 0.5 ? 4 * s * s * s : 1 - Math.pow(-2 * s + 2, 3) / 2; } // easeInOutCubic
  function E(s) { return 1 - Math.cos(s * Math.PI / 2); }          // 1-cos
  function D_(s) { return Math.sin(s * Math.PI / 2); }             // easeOutSine ($)
  function g(fn, n, c, o, a) { return o * fn(n / a) + c; }

  // ── Generate cube hex coordinates (rings 0..RINGS-1) ────────────────────
  var cubes = [];
  for (var u = 0; u < RINGS; u++) {
    for (var r = -u; r <= u; r++) {
      for (var i = -u; i <= u; i++) {
        for (var l = -u; l <= u; l++) {
          if (Math.abs(r) + Math.abs(i) + Math.abs(l) === u * 2 && r + i + l === 0) {
            cubes.push([r, i, l]);
          }
        }
      }
    }
  }

  // Static axial base position per icon (offset added per frame).
  var SQRT3_2 = Math.sqrt(3) / 2;
  var base = cubes.map(function (c) {
    return {
      bx: (c[1] + c[0] / 2) * SPACING,
      by: SQRT3_2 * c[0] * SPACING
    };
  });

  // ── Build icon elements (70px black circles) ────────────────────────────
  var icons = [];
  for (var e = 0; e < base.length; e++) {
    var el = document.createElement('div');
    el.className = 'watchface__icon';
    iconsEl.appendChild(el);
    icons.push(el);
  }

  // ── State ───────────────────────────────────────────────────────────────
  var target = { x: 0, y: 0 };
  var current = { x: 0, y: 0 };
  var dragging = false;
  var dragStart = { x: 0, y: 0 };
  var offStart = { x: 0, y: 0 };
  var rafId = null;

  // ── Render every icon for a given (design-space) pan offset ─────────────
  var hw = SIZE_W / 2, hh = SIZE_H / 2, PI2 = Math.PI / 2;
  function render(ox, oy) {
    for (var e = 0; e < icons.length; e++) {
      // 1. axial + offset
      var x = base[e].bx + ox;
      var y = base[e].by + oy;
      // 2. polar
      var radius = Math.sqrt(x * x + y * y);
      var radian = Math.atan2(y, x);
      // 3. warp radius + depth
      var M = radius / DEPTH_R;
      var v, depth;
      if (M < PI2) {
        v = radius * g(I, M / PI2, 1.5, -0.5, 1);
        depth = g(C, M / PI2, 1, -0.5, 1);
      } else {
        v = radius;
        depth = g(C, 1, 1, -0.5, 1);
      }
      // 4. position from warped radius
      x = v * Math.cos(radian);
      y = v * Math.sin(radian);
      // 5. round + vertical stretch
      x = Math.round(x * 10) / 10;
      y = Math.round(y * 10) / 10 * Y_STRETCH;
      // 6. rectangular scale falloff (uses pre-push position)
      var ax = Math.abs(x), ay = Math.abs(y);
      var scale;
      if (ax > hw - D || ay > hh - D) {
        scale = depth * 0.2;
      } else if (ax > hw - 2 * D && ay > hh - 2 * D) {
        scale = Math.min(depth * g(I, hw - ax - D, 0.4, 0.6, D),
                         depth * g(I, hh - ay - D, 0.3, 0.7, D));
      } else if (ax > hw - 2 * D) {
        scale = depth * g(D_, hw - ax - D, 0.4, 0.6, D);
      } else if (ay > hh - 2 * D) {
        scale = depth * g(D_, hh - ay - D, 0.4, 0.6, D);
      } else {
        scale = depth;
      }
      // 7. edge push
      if (x < -hw + 2 * D) x += g(E, hw - Math.abs(x) - 2 * D, 0, 6, 2 * D);
      else if (x > hw - 2 * D) x += g(E, hw - Math.abs(x) - 2 * D, 0, -6, 2 * D);
      if (y < -hh + 2 * D) y += g(E, hh - Math.abs(y) - 2 * D, 0, 8, 2 * D);
      else if (y > hh - 2 * D) y += g(E, hh - Math.abs(y) - 2 * D, 0, -8, 2 * D);
      // 8. translate (top-left = center + pos − half) + scale
      var tlx = x + hw - HALF;
      var tly = y + hh - HALF;
      icons[e].style.transform =
        'translate(' + tlx + 'px,' + tly + 'px) scale(' + Math.round(scale * 1000) / 1000 + ')';
    }
  }

  // ── Loop: ease current → target; stop when settled ──────────────────────
  function tick() {
    var ease = REDUCED ? 1 : EASE;
    current.x += (target.x - current.x) * ease;
    current.y += (target.y - current.y) * ease;
    render(current.x, current.y);
    var settling =
      Math.abs(target.x - current.x) > 0.3 || Math.abs(target.y - current.y) > 0.3;
    if (dragging || settling) {
      rafId = window.requestAnimationFrame(tick);
    } else {
      current.x = target.x; current.y = target.y;
      render(current.x, current.y);
      rafId = null;
    }
  }
  function kick() { if (rafId === null) rafId = window.requestAnimationFrame(tick); }

  // ── Pointer → design-space coords (robust to the CSS scale) ─────────────
  function clamp(v, mx) { return v < -mx ? -mx : (v > mx ? mx : v); }
  function designPoint(clientX, clientY) {
    var rect = screenEl.getBoundingClientRect();
    var sx = rect.width ? SIZE_W / rect.width : 1;
    var sy = rect.height ? SIZE_H / rect.height : 1;
    return { x: (clientX - rect.left) * sx, y: (clientY - rect.top) * sy };
  }

  // ── Drag (down on screen; move/up on window) ────────────────────────────
  screenEl.addEventListener('pointerdown', function (e) {
    dragging = true;
    screenEl.classList.add('is-dragging');
    var p = designPoint(e.clientX, e.clientY);
    dragStart.x = p.x; dragStart.y = p.y;
    offStart.x = target.x; offStart.y = target.y;
    kick();
  });
  window.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    var p = designPoint(e.clientX, e.clientY);
    target.x = clamp(p.x - dragStart.x + offStart.x, PAN_MAX_X);
    target.y = clamp(p.y - dragStart.y + offStart.y, PAN_MAX_Y);
    kick();
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    screenEl.classList.remove('is-dragging');
    kick();
  }
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  // ── Responsive fit: scale the 360×400 design to the column width ────────
  function fit() {
    var section = screenEl.parentNode.parentNode; // .watchface__wrap -> .watchface
    var avail = section.clientWidth;
    var s = Math.min(1, avail / SIZE_W);
    screenEl.style.transform = 'scale(' + s + ')';
    // reserve the scaled height so layout below isn't overlapped
    screenEl.parentNode.style.height = (SIZE_H * s) + 'px';
  }
  var resizeTimer = null;
  window.addEventListener('resize', function () {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fit, 120);
  });

  // ── Init ────────────────────────────────────────────────────────────────
  fit();
  render(0, 0);
})();
