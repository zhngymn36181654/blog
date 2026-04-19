/**
 * Liquid Glass Effect — Navigation Bar
 *
 * Applies Apple-style Liquid Glass refraction to the .ac-ln-shell nav bar
 * using SVG displacement maps + backdrop-filter: url().
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
    // Chrome and Edge support backdrop-filter: url() with SVG filters.
    // Safari supports backdrop-filter but NOT with url() referencing SVG filters.
    // Firefox has limited/partial support.
    // We test by creating an element and checking computed style behavior.
    try {
      var el = document.createElement('div');
      el.style.backdropFilter = "url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22></svg>#f')";
      document.body.appendChild(el);
      var cs = getComputedStyle(el).backdropFilter;
      document.body.removeChild(el);
      // If the browser keeps the url() value it likely supports it
      return cs && cs.indexOf('url') !== -1;
    } catch (e) {
      return false;
    }
  }

  // ── Displacement map generation ────────────────────────────
  // Generates an SVG displacement map as a data URI.
  // The map uses R/G channels to indicate X/Y displacement at edges.
  // Interior is neutral gray (#808080) = zero displacement.
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
  // Creates a complete SVG filter definition and returns it as a data URI
  // with a fragment identifier pointing to the filter element.
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

  // ── Init ───────────────────────────────────────────────────
  function initLiquidGlass() {
    // Skip mobile
    if (window.innerWidth < 768) return;

    // Skip unsupported browsers
    if (!supportsBackdropFilterUrl()) return;

    var nav = document.querySelector('.ac-ln-shell');
    if (!nav) return;

    var filterId = 'liquid-glass-nav';
    var filterUri = null;

    function applyFilter() {
      var rect = nav.getBoundingClientRect();
      var w = Math.round(rect.width);
      var h = Math.round(rect.height);
      if (w < 1 || h < 1) return;

      // Nav params: subtle effect, height=52px, radius ≈ half height
      var radius = 26;
      var depth = 6;
      var strength = 30;

      filterUri = getDisplacementFilter(filterId, w, h, radius, depth, strength);

      // Apply: keep blur for glassmorphism base, add refraction filter
      nav.style.backdropFilter =
        'url("' + filterUri + '") blur(0.25px) contrast(1.1) brightness(1.05) saturate(1.15)';
      nav.style.webkitBackdropFilter = nav.style.backdropFilter;
      nav.classList.add('liquid-glass-active');
    }

    // Initial application
    applyFilter();

    // Re-apply on resize
    var resizeTimeout;
    var resizeObserver = new ResizeObserver(function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(applyFilter, 100);
    });
    resizeObserver.observe(nav);
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLiquidGlass);
  } else {
    initLiquidGlass();
  }
})();
