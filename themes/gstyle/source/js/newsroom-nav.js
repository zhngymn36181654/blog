document.addEventListener('DOMContentLoaded', function () {

  const menu = document.querySelector('.ac-ln-menu');
  if (!menu) return;

  const openBtn  = document.getElementById('ac-ln-menustate-open');
  const closeBtn = document.getElementById('ac-ln-menustate-close');
  const tray     = document.querySelector('.ac-ln-menu-tray');
  const chevron  = document.querySelector('.ac-ln-menucta');

  // SVG 动画引用
  const svg = document.querySelector('.ac-ln-menucta-chevron svg');
  const expandAnim   = svg?.querySelector('[data-anim="expand"]');
  const collapseAnim = svg?.querySelector('[data-anim="collapse"]');

  let isOpen = false;

  function playExpand() {
    if (expandAnim) expandAnim.beginElement();
  }

  function playCollapse() {
    if (collapseAnim) collapseAnim.beginElement();
  }

  function openMenu() {
  if (isOpen) return;
  isOpen = true;

  menu.classList.add('ac-ln-menu-open');

  openBtn.style.display = 'none';
  closeBtn.style.display = 'flex';

  playExpand();
  }

  function closeMenu() {
  if (!isOpen) return;
  isOpen = false;

  menu.classList.remove('ac-ln-menu-open');

  openBtn.style.display = 'flex';
  closeBtn.style.display = 'none';

  playCollapse();
  }


  function toggleMenu() {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // 小三角点击
  chevron.addEventListener('click', function (e) {
    e.preventDefault();
    toggleMenu();
  });

  // Open 按钮点击
  openBtn.addEventListener('click', function (e) {
    e.preventDefault();
    toggleMenu();
  });

  // Close 按钮点击
  closeBtn.addEventListener('click', function (e) {
    e.preventDefault();
    toggleMenu();
  });

  // 点菜单内的链接自动关闭
  tray.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      closeMenu();
    }
  });

  // 点页面其它地方关闭菜单
  document.addEventListener('click', function (e) {
    if (!isOpen) return;
    if (!menu.contains(e.target)) {
      closeMenu();
    }
  });

});
