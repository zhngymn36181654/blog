/**
 * Liquid Glass — Navigation Bar
 *
 * 基于 AAVE 公开的 feDisplacementMap 技术，满血实现。
 * 核心：SVG filter pipeline（位移折射 + 色差 + 高光 + 暗角）
 *       通过 backdrop-filter: url(#id) 应用于导航栏背景
 *
 * 浏览器策略：
 *   Chrome/Edge → 完整折射效果
 *   Safari/Firefox/mobile → 优雅降级到标准毛玻璃
 */
(function () {
  'use strict';

  /* ── 参数 ──────────────────────────────────────────── */
  var PARAMS = {
    baseScale: 18,       // 折射强度（像素）— 降低，更自然
    iridescence: 1,      // 色差强度 — 降低，微弱彩色边缘
    depth: 5,            // 边缘厚度（px）— 收窄过渡区
    preBlur: 0.4,        // 预模糊 — 稍增，柔化折射
    brightness: 1.03     // 亮度提升 — 微调
  };

  var CONTAINER_ID = 'lg-svg-container';

  /* ── 浏览器检测 ────────────────────────────────────── */
  function supportsBackdropFilterUrl() {
    var el = document.createElement('div');
    try {
      el.style.backdropFilter = 'url(#lg-detect)';
      return el.style.backdropFilter.indexOf('url') !== -1;
    } catch (_) {
      return false;
    }
  }

  /* ── SVG 工具 ─────────────────────────────────────── */
  function svgToDataUri(svg) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  /* ── 位移图（Displacement Map）────────────────────── */
  function createDisplacementMap(w, h, radius, depth) {
    // 根据圆角调整渐变起止位置
    var gy1 = Math.max(0, Math.min(49, Math.ceil((radius / h) * 15)));
    var gy2 = Math.max(51, Math.min(100, Math.floor(100 - (radius / h) * 15)));
    var gx1 = Math.max(0, Math.min(49, Math.ceil((radius / w) * 15)));
    var gx2 = Math.max(51, Math.min(100, Math.floor(100 - (radius / w) * 15)));

    var innerW = w - 2 * depth;
    var innerH = h - 2 * depth;

    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' +
        '<style>.mix{mix-blend-mode:screen}</style>' +
        '<defs>' +
          '<linearGradient id="gY" x1="0" x2="0" y1="' + gy1 + '%" y2="' + gy2 + '%">' +
            '<stop offset="0%" stop-color="#0F0"/>' +
            '<stop offset="100%" stop-color="#000"/>' +
          '</linearGradient>' +
          '<linearGradient id="gX" x1="' + gx1 + '%" x2="' + gx2 + '%" y1="0" y2="0">' +
            '<stop offset="0%" stop-color="#F00"/>' +
            '<stop offset="100%" stop-color="#000"/>' +
          '</linearGradient>' +
        '</defs>' +
        /* 底层：中性灰 = 零位移 */
        '<rect width="' + w + '" height="' + h + '" fill="#808080"/>' +
        '<g filter="blur(2px)">' +
          '<rect width="' + w + '" height="' + h + '" fill="#000080"/>' +
          '<rect width="' + w + '" height="' + h + '" fill="url(#gY)" class="mix"/>' +
          '<rect width="' + w + '" height="' + h + '" fill="url(#gX)" class="mix"/>' +
          /* 内部中性区：把中心推回零位移，仅边缘保留折射 */
          '<rect x="' + depth + '" y="' + depth + '" width="' + innerW + '" height="' + innerH + '" rx="' + radius + '" ry="' + radius + '" fill="#808080" filter="blur(' + depth + 'px)"/>' +
        '</g>' +
      '</svg>';

    return svgToDataUri(svg);
  }

  /* ── 高光图（Specular Highlight）──────────────────── */
  /* screen 混合：黑色=不变，白色=全白。所以底色必须黑，仅边缘微亮。 */
  function createSpecularMap(w, h, radius) {
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' +
        '<defs>' +
          '<linearGradient id="sH" x1="0" x2="0" y1="0" y2="1">' +
            '<stop offset="0%" stop-color="#555"/>' +      // 顶部边缘：微亮高光
            '<stop offset="15%" stop-color="#000"/>' +     // 快速衰减到黑
            '<stop offset="85%" stop-color="#000"/>' +     // 中心纯黑=不变
            '<stop offset="100%" stop-color="#333"/>' +    // 底部边缘：微亮
          '</linearGradient>' +
        '</defs>' +
        '<rect width="' + w + '" height="' + h + '" fill="#000"/>' +     // 黑底=screen恒等
        '<rect width="' + w + '" height="' + h + '" rx="' + radius + '" ry="' + radius + '" fill="url(#sH)"/>' +
      '</svg>';

    return svgToDataUri(svg);
  }

  /* ── 暗角图（Darkness Map）────────────────────────── */
  /* multiply 混合：白色=恒等（不改变内容）。暂时全白，后续可微调。 */
  function createDarknessMap(w, h, radius) {
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' +
        '<rect width="' + w + '" height="' + h + '" fill="#fff"/>' +
      '</svg>';

    return svgToDataUri(svg);
  }

  /* ── 构建完整 SVG Filter ─────────────────────────── */
  function buildFilter(id, w, h, radius, depth, params) {
    var dispUri  = createDisplacementMap(w, h, radius, depth);
    var specUri  = createSpecularMap(w, h, radius);
    var darkUri  = createDarknessMap(w, h, radius);

    var sR = params.baseScale + params.iridescence;
    var sG = params.baseScale;
    var sB = Math.max(0, params.baseScale - params.iridescence);

    // feColorMatrix 矩阵：分别提取 R / G / B 单通道
    var matR = '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0';
    var matG = '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0';
    var matB = '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0';

    var img = function (uri, result) {
      return '<feImage href="' + uri + '" result="' + result + '" ' +
             'x="0" y="0" width="' + w + '" height="' + h + '" preserveAspectRatio="none"/>';
    };

    var filter =
      '<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden">' +
      '<defs>' +
      '<filter id="' + id + '" filterUnits="userSpaceOnUse" ' +
        'x="0" y="0" width="' + w + '" height="' + h + '" color-interpolation-filters="sRGB">' +

        /* ① 加载位移图 */
        img(dispUri, 'map') +

        /* ② 预模糊源图，使折射更平滑 */
        '<feGaussianBlur in="SourceGraphic" stdDeviation="' + params.preBlur + '" result="preblur"/>' +

        /* ③ 色差 — 红通道（scale 最大 → 边缘偏红） */
        '<feDisplacementMap in="preblur" in2="map" scale="' + sR + '" ' +
          'xChannelSelector="R" yChannelSelector="G" result="dR_raw"/>' +
        '<feColorMatrix in="dR_raw" type="matrix" values="' + matR + '" result="dispR"/>' +

        /* ④ 色差 — 绿通道（scale 基准） */
        '<feDisplacementMap in="preblur" in2="map" scale="' + sG + '" ' +
          'xChannelSelector="R" yChannelSelector="G" result="dG_raw"/>' +
        '<feColorMatrix in="dG_raw" type="matrix" values="' + matG + '" result="dispG"/>' +

        /* ⑤ 色差 — 蓝通道（scale 最小 → 边缘偏蓝） */
        '<feDisplacementMap in="preblur" in2="map" scale="' + sB + '" ' +
          'xChannelSelector="R" yChannelSelector="G" result="dB_raw"/>' +
        '<feColorMatrix in="dB_raw" type="matrix" values="' + matB + '" result="dispB"/>' +

        /* ⑥ screen 混合重组 RGB */
        '<feBlend in="dispR" in2="dispG" mode="screen" result="rg"/>' +
        '<feBlend in="rg" in2="dispB" mode="screen" result="refracted"/>' +

        /* ⑦ 叠加高光 */
        img(specUri, 'specMap') +
        '<feBlend in="refracted" in2="specMap" mode="screen" result="withSpec"/>' +

        /* ⑧ 叠加暗角 */
        img(darkUri, 'darkMap') +
        '<feBlend in="withSpec" in2="darkMap" mode="multiply"/>' +

      '</filter>' +
      '</defs>' +
      '</svg>';

    return filter;
  }

  /* ── 应用 Liquid Glass ───────────────────────────── */
  function applyGlass(nav) {
    var w = Math.round(nav.offsetWidth);
    var h = Math.round(nav.offsetHeight);
    if (w < 1 || h < 1) return;

    // 读取当前 border-radius（浮动药丸态时有圆角）
    var cs = getComputedStyle(nav);
    var br = parseFloat(cs.borderTopLeftRadius) || 0;

    // Safari 缓存规避：每次更新用新的 filter ID
    var id = 'lg-nav-' + Date.now();
    var filterSvg = buildFilter(id, w, h, br, PARAMS.depth, PARAMS);

    // 移除旧 filter 容器
    var old = document.getElementById(CONTAINER_ID);
    if (old) old.remove();

    // 注入新 SVG filter（隐藏元素，不占布局）
    var container = document.createElement('div');
    container.id = CONTAINER_ID;
    container.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;';
    container.innerHTML = filterSvg;
    document.body.appendChild(container);

    // 应用 backdrop-filter（Chrome/Edge 全效果）
    // 不加 blur！透明玻璃 = 只靠 SVG filter 提供折射+色差+高光
    var val = 'url(#' + id + ') brightness(' + PARAMS.brightness + ')';

    nav.style.backdropFilter = val;
    nav.style.webkitBackdropFilter = val;
    nav.classList.add('liquid-glass-active');
  }

  /* ── 初始化 ───────────────────────────────────────── */
  function init() {
    // 浏览器不支持则静默退出
    if (!supportsBackdropFilterUrl()) return;
    // 移动端不应用
    if (window.innerWidth < 768) return;

    var nav = document.querySelector('.ac-ln-shell');
    if (!nav) return;

    // 首次应用
    applyGlass(nav);

    // ResizeObserver：监听浮动药丸态的尺寸/圆角变化
    var resizeTimer;
    var ro = new ResizeObserver(function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        applyGlass(nav);
      }, 100);
    });
    ro.observe(nav);

    // 窗口 resize（debounce）
    var winTimer;
    window.addEventListener('resize', function () {
      clearTimeout(winTimer);
      winTimer = setTimeout(function () {
        if (window.innerWidth >= 768) {
          applyGlass(nav);
        }
      }, 150);
    });
  }

  /* ── 启动 ─────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
