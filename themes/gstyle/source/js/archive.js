// 定义当前页面的筛选状态
let currentFilters = {
    category: 'all',
    year: 'all',
    month: 'all'
};

// 初始化（从 URL 读取参数回填 UI）
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    if(params.has('category')) updateSelectUI('select-category', params.get('category'));
    if(params.has('year')) updateSelectUI('select-year', params.get('year'));
    if(params.has('month')) updateSelectUI('select-month', params.get('month'));
});

// 通用点击事件委托
document.addEventListener('click', function(e) {
    // 1. 点击 Trigger：切换开关
    const trigger = e.target.closest('.select-trigger');
    if (trigger) {
        const parent = trigger.parentElement;
        // 关闭其他所有打开的菜单
        document.querySelectorAll('.custom-select.open').forEach(el => {
            if (el !== parent) el.classList.remove('open');
        });
        // 切换当前菜单
        parent.classList.toggle('open');
        e.stopPropagation();
        return;
    }

    // 2. 点击 Option：选中并跳转
    const option = e.target.closest('.option-item');
    if (option) {
        const selectContainer = option.closest('.custom-select');
        const value = option.dataset.value;
        const typeId = selectContainer.id; // e.g., 'select-category'
        
        // 更新 UI 文字
        selectContainer.querySelector('.trigger-text').textContent = option.textContent;
        
        // 更新选中状态样式
        selectContainer.querySelectorAll('.option-item').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        
        // 关闭菜单
        selectContainer.classList.remove('open');

        // 执行跳转逻辑
        handleFilterChange(typeId, value);
        return;
    }

    // 3. 点击空白处：关闭所有
    if (!e.target.closest('.custom-select')) {
        document.querySelectorAll('.custom-select.open').forEach(el => el.classList.remove('open'));
    }
});

// 辅助函数：根据 URL 参数回填 UI
function updateSelectUI(id, value) {
    const container = document.getElementById(id);
    if(!container) return;
    const targetOption = [...container.querySelectorAll('.option-item')].find(o => o.dataset.value === value);
    if (targetOption) {
        container.querySelector('.trigger-text').textContent = targetOption.textContent;
        container.querySelectorAll('.option-item').forEach(o => o.classList.remove('selected'));
        targetOption.classList.add('selected');
    }
}

// 核心跳转逻辑
function handleFilterChange(typeId, value) {
    // 更新内存中的状态
    if (typeId === 'select-category') currentFilters.category = value;
    if (typeId === 'select-year') currentFilters.year = value;
    if (typeId === 'select-month') currentFilters.month = value;

    // 拼接 URL
    let url = "/archive/"; // 基础路径
    let query = [];
    
    // 读取当前 DOM 中的最新值（双重保险）
    const c = getVal('select-category');
    const y = getVal('select-year');
    const m = getVal('select-month');

    if (c !== "all") query.push("category=" + c);
    if (y !== "all") query.push("year=" + y);
    if (m !== "all") query.push("month=" + m);

    if (query.length) url += "?" + query.join("&");
    window.location.href = url;
}

function getVal(id) {
    // 查找当前选中的 option 的 value
    const el = document.getElementById(id).querySelector('.option-item.selected');
    return el ? el.dataset.value : 'all';
}

function changeFilter() {
    const c = document.getElementById('filter-category').value;
    const y = document.getElementById('filter-year').value;
    const m = document.getElementById('filter-month').value;

    let url = "/archive/";
    let query = [];

    if (c !== "all") query.push("category=" + c);
    if (y !== "all") query.push("year=" + y);
    if (m !== "all") query.push("month=" + m);

    if (query.length) url += "?" + query.join("&");

    window.location.href = url;
}

/* ===============================
   Mobile Filter Logic
   =============================== */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. 获取元素
    const mobileBtn = document.getElementById('mobile-filter-btn');
    const modal = document.getElementById('mobile-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    const doneBtn = document.getElementById('modal-done-btn');
    
    // 2. 打开/关闭 Modal
    function toggleModal(show) {
        if(show) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // 禁止背景滚动
        } else {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if(mobileBtn) mobileBtn.addEventListener('click', () => toggleModal(true));
    if(closeBtn) closeBtn.addEventListener('click', () => toggleModal(false));
    
    // 点击“完成”按钮 -> 跳转逻辑同桌面端
    if(doneBtn) doneBtn.addEventListener('click', () => {
        // 其实在移动端，用户点击选项时我们不立即跳转，而是先记录
        // 但为了简单和统一，这里我们点击选项时直接跳转，或者点击完成时跳转
        // Apple 的逻辑通常是：选了就打钩，点完成后统一刷新。
        
        // 由于我们的 URL 跳转逻辑是直接刷新页面的，所以点击“完成”其实就是关闭弹窗
        // 如果你希望在点击 Option 时不跳转，而是点完成时才跳转，需要改写 handleFilterChange
        // 目前为了最快实现，我们让“完成”按钮仅仅作为“关闭”按钮使用
        toggleModal(false);
    });

    // 3. 手风琴 (Accordion) 逻辑
    const accHeaders = document.querySelectorAll('.accordion-header');
    accHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            
            // 核心：点击时，如果自己没打开，就关掉别人，打开自己
            // 如果自己已经打开了，就关闭自己（回到折叠状态）
            const isOpen = item.classList.contains('open');

            // 1. 关闭所有
            document.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('open');
            });

            // 2. 如果之前没打开，现在打开
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });

    // 4. 移动端选项点击逻辑
    const mobileOptions = document.querySelectorAll('.mobile-option');
    mobileOptions.forEach(opt => {
        opt.addEventListener('click', function() {
            const type = this.dataset.type; // category, year, month
            const value = this.dataset.value;

            // 视觉选中状态
            const parentContent = this.parentElement;
            parentContent.querySelectorAll('.mobile-option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');

            // 核心跳转 (复用之前的 handleFilterChange)
            // 注意：这里 id 传过去没用，我们需要改造一下 handleFilterChange 
            // 或者简单粗暴：手动更新 currentFilters 全局变量，然后调用跳转
            
            if(type === 'category') currentFilters.category = value;
            if(type === 'year') currentFilters.year = value;
            if(type === 'month') currentFilters.month = value;

            // 触发跳转
            // 为了体验，我们可以加一个小延时，让用户看到勾选动画再跳转
            setTimeout(() => {
                goFilter();
            }, 300);
        });
    });
    
    // 5. 初始化：移动端也要回显选中状态
    const params = new URLSearchParams(window.location.search);
    const cVal = params.get('category') || 'all';
    const yVal = params.get('year') || 'all';
    const mVal = params.get('month') || 'all';
    
    highlightMobileOption('category', cVal);
    highlightMobileOption('year', yVal);
    highlightMobileOption('month', mVal);

    // 更新 Accordion Header 的文字，显示当前选中的值 (Apple 细节)
    updateAccHeader('category', cVal);
    updateAccHeader('year', yVal);
    updateAccHeader('month', mVal);
});

// 辅助：高亮移动端选项
function highlightMobileOption(type, value) {
    const opts = document.querySelectorAll(`.mobile-option[data-type="${type}"]`);
    opts.forEach(o => {
        if(o.dataset.value === value) o.classList.add('selected');
        else o.classList.remove('selected');
    });
}

// 辅助：更新手风琴标题 (e.g., 显示 "2025" 而不是 "全部年份")
function updateAccHeader(type, value) {
    if(value === 'all') return;
    // 找到对应的 header span
    // 这里简单处理：你需要根据结构去找
    // Pro 写法是给 header 里的 span 加个 class，比如 .header-text
    // 这里暂时略过，因为 Apple Newsroom 默认好像不改标题，只是展开里打钩
}

// 改造原有的 handleFilterChange，或者新建一个 goFilter
function goFilter() {
    let url = "/archive/";
    let query = [];
    
    if (currentFilters.category !== "all") query.push("category=" + currentFilters.category);
    if (currentFilters.year !== "all") query.push("year=" + currentFilters.year);
    if (currentFilters.month !== "all") query.push("month=" + currentFilters.month);

    if (query.length) url += "?" + query.join("&");
    window.location.href = url;
}