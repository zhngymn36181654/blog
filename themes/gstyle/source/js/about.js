(() => {
    const modal = document.querySelector('.qq-modal');
    const trigger = document.querySelector('[data-qq-trigger]');
    const closeEls = document.querySelectorAll('[data-qq-close]');

    if (!modal || !trigger) return;

    const open = () => {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
    };

    const close = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
    };

    trigger.addEventListener('click', open);
    closeEls.forEach((el) => el.addEventListener('click', close));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });
})();
