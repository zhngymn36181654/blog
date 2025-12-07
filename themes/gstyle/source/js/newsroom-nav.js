document.addEventListener('DOMContentLoaded', function () {

  const menu = document.querySelector('.ac-ln-menu');
  const chevronWrapper = document.querySelector('.ac-ln-menucta');
  const tray = document.querySelector('.ac-ln-menu-tray');
  const navLinks = document.querySelectorAll('.ac-ln-menu-tray .local-nav-link');

  // --- SVG animate 对象 ---
  const expand = document.getElementById('ac-chevron-expand');
  const collapse = document.getElementById('ac-chevron-collapse');

  let isOpen = false;
  let arrowTimer = null;

  if (!menu || !chevronWrapper) return;

  /* ===============================
     打开菜单
     =============================== */
  function openMenu() {
    if (isOpen) return;
    isOpen = true;

    // 背景 / tray 出现
    menu.classList.add('ac-ln-menu-open');
    document.body.style.overflow = 'hidden';

    // 选项依次 reveal
    navLinks.forEach((link, index) => {
      const delay = 150 + index * 150;
      setTimeout(() => {
        if (isOpen) link.classList.add('revealed');
      }, delay);
    });

    // 清除旧定时器
    if (arrowTimer) clearTimeout(arrowTimer);

    // 延迟触发苹果原版箭头动画
    arrowTimer = setTimeout(() => {
      if (isOpen && expand) expand.beginElement();
    }, 300);
  }

  /* ===============================
     关闭菜单
     =============================== */
  function closeMenu() {
    if (!isOpen) return;
    isOpen = false;

    // tray 消失
    menu.classList.remove('ac-ln-menu-open');
    document.body.style.overflow = '';

    // 链接复位
    navLinks.forEach(link => link.classList.remove('revealed'));

    if (arrowTimer) clearTimeout(arrowTimer);

    // 延迟触发 collapse 动画
    arrowTimer = setTimeout(() => {
      if (!isOpen && collapse) collapse.beginElement();
    }, 150);
  }

  /* ===============================
     切换
     =============================== */
  function toggleMenu() {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // Chevron 点击监听
  chevronWrapper.addEventListener('click', function (e) {
    e.preventDefault();
    toggleMenu();
  });

  // 点击 tray 内容收起菜单
  if (tray) {
    tray.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' || e.target.closest('a')) {
        toggleMenu();
      }
    });
  }

});
