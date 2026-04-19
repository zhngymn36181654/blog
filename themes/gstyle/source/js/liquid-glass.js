/**
 * Liquid Glass Effect — Navigation Bar + Archive Page
 *
 * Applies Apple-style Liquid Glass refraction using SVG displacement maps
 * + backdrop-filter: url().
 *
 * Only activates on desktop Chrome/Edge. Safari/Firefox/mobile get no effect.
 *
 * Based on techniques from:
 *   - https://kube.io/blog/liquid-glass-css-svg/
 *   - https://github.com/nikdelvin/liquid-glass
 */
(function () {
  'use strict';

  // ── Browser detection ──────────────────────────────────────
  function supportsBackdropFilterUrl() {
    try {
      var el = document.createElement('div');
      el.style.backdropFilter = "url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22></svg>#f')";
      document.body.appendChild(el);
      var cs = getComputedStyle(el).backdropFilter;
      document.body.removeChild(el);
      return cs && cs.indexOf('url') !== -1;
    } catch (e) {
      return false;
    }
  }

  // ── Displacement map generation ────────────────────────────
  function getDisplacementMap(width, height, radius, depth) {
    var svg =
      '<svg height="' + height + '" width="' + width + '" ' +
      'viewBox="0 0 ' + width + ' ' + height + '" ' +
      'xmlns="http://www.w3.org/2000/svg">' +
      '<style>.mix{mix-blend-mode:screen;}</style>' +
      '<defs>' +
        '<linearGradient id="Y" x1="0" x2="0" ' +
          'y1="' + Math.ceil((radius / height) * 15) + '%" ' +
          'y2="' + Math.floor(100 - (radius / height) * 15) + '%">' +
          '<stop offset="0%" stop-color="#0F0"/>' +
          '<stop offset="100%" stop-color="#000"/>' +
        '</linearGradient>' +
        '<linearGradient id="X" x1="' + Math.ceil((radius / width) * 15) + '%" ' +
          'x2="' + Math.floor(100 - (radius / width) * 15) + '%" y1="0" y2="0">' +
          '<stop offset="0%" stop-color="#F00"/>' +
          '<stop offset="100%" stop-color="#000"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<rect x="0" y="0" height="' + height + '" width="' + width + '" fill="#808080"/>' +
      '<g filter="blur(2px)">' +
        '<rect x="0" y="0" height="' + height + '" width="' + width + '" fill="#000080"/>' +
        '<rect x="0" y="0" height="' + height + '" width="' + width + '" fill="url(#Y)" class="mix"/>' +
        '<rect x="0" y="0" height="' + height + '" width="' + width + '" fill="url(#X)" class="mix"/>' +
        '<rect x="' + depth + '" y="' + depth + '" ' +
          'height="' + (height - 2 * depth) + '" width="' + (width - 2 * depth) + '" ' +
          'fill="#808080" rx="' + radius + '" ry="' + radius + '" ' +
          'filter="blur(' + depth + 'px)"/>' +
      '</g>' +
      '</svg>';
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  // ── SVG filter generation ──────────────────────────────────
  function getDisplacementFilter(filterId, width, height, radius, depth, strength) {
    var mapHref = getDisplacementMap(width, height, radius, depth);
    var svg =
      '<svg height="' + height + '" width="' + width + '" ' +
      'viewBox="0 0 ' + width + ' ' + height + '" ' +
      'xmlns="http://www.w3.org/2000/svg">' +
      '<defs>' +
        '<filter id="' + filterId + '" color-interpolation-filters="sRGB" ' +
          'filterUnits="userSpaceOnUse" x="0" y="0" ' +
          'width="' + width + '" height="' + height + '">' +
          '<feImage width="' + width + '" height="' + height + '" ' +
            'href="' + mapHref + '" result="displacementMap"/>' +
          '<feDisplacementMap in="SourceGraphic" in2="displacementMap" ' +
            'scale="' + strength + '" ' +
            'xChannelSelector="R" yChannelSelector="G"/>' +
        '</filter>' +
      '</defs>' +
      '</svg>';
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg) + '#' + filterId;
  }

  // ── Generic: apply liquid glass to an element ──────────────
  function applyToElement(el, filterId, radius, depth, strength) {
    var rect = el.getBoundingClientRect();
    var w = Math.round(rect.width);
    var h = Math.round(rect.height);
    if (w < 1 || h < 1) return;

    var filterUri = getDisplacementFilter(filterId, w, h, radius, depth, strength);

    el.style.backdropFilter =
      'url("' + filterUri + '") blur(0.25px) contrast(1.1) brightness(1.05) saturate(1.15)';
    el.style.webkitBackdropFilter = el.style.backdropFilter;
    el.classList.add('liquid-glass-active');
  }

  // ── 1. Navigation Bar ──────────────────────────────────────
  function initNav() {
    var nav = document.querySelector('.ac-ln-shell');
    if (!nav) return;

    var filterId = 'liquid-glass-nav';

    function apply() {
      applyToElement(nav, filterId, 26, 6, 30);
    }

    apply();

    var resizeTimeout;
    new ResizeObserver(function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(apply, 100);
    }).observe(nav);
  }

  // ── 2. Archive Filter Bar ──────────────────────────────────
  function initArchiveFilter() {
    var filter = document.querySelector('.archive-filter');
    if (!filter) return;

    var filterId = 'liquid-glass-archive-filter';

    function apply() {
      applyToElement(filter, filterId, 20, 5, 25);
    }

    apply();

    var resizeTimeout;
    new ResizeObserver(function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(apply, 100);
    }).observe(filter);
  }

  // ── Init everything ────────────────────────────────────────
  function init() {
    if (window.innerWidth < 768) return;
    if (!supportsBackdropFilterUrl()) return;

    initNav();
    initArchiveFilter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
