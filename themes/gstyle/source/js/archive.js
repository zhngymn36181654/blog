/**
 * Archive Page — Client-side Filtering
 *
 * Filters .archive-item elements by category/year/month.
 * Updates URL search params for shareable state.
 * Reset button appears when any filter is active.
 */
(function () {
  'use strict';

  // ── State ──────────────────────────────────────────────────
  var filters = { category: 'all', year: 'all', month: 'all' };

  // ── DOM refs ───────────────────────────────────────────────
  var resetBtn = document.getElementById('filter-reset-btn');

  // ── Init from URL params ───────────────────────────────────
  function initFromURL() {
    var params = new URLSearchParams(window.location.search);

    ['category', 'year', 'month'].forEach(function (key) {
      if (params.has(key)) {
        filters[key] = params.get(key);
        updateSelectUI(key, filters[key]);
      }
    });

    filterPosts();
  }

  // ── Update select dropdown UI ──────────────────────────────
  function updateSelectUI(type, value) {
    var id = 'select-' + type;
    var container = document.getElementById(id);
    if (!container) return;

    var option = container.querySelector('.option-item[data-value="' + value + '"]');
    if (option) {
      container.querySelector('.trigger-text').textContent = option.textContent;
      container.querySelectorAll('.option-item').forEach(function (o) { o.classList.remove('selected'); });
      option.classList.add('selected');
    }
  }

  // ── Core: filter posts ─────────────────────────────────────
  function filterPosts() {
    var items = document.querySelectorAll('.archive-item');
    var visibleCount = 0;

    items.forEach(function (item) {
      var match = true;

      if (filters.category !== 'all' && item.dataset.category !== filters.category) match = false;
      if (filters.year !== 'all' && item.dataset.year !== filters.year) match = false;
      if (filters.month !== 'all' && item.dataset.month !== filters.month) match = false;

      item.style.display = match ? '' : 'none';
      if (match) visibleCount++;
    });

    // Show/hide month blocks and headings based on visible children
    document.querySelectorAll('.archive-month-block').forEach(function (block) {
      var visibleItems = block.querySelectorAll('.archive-item[style=""], .archive-item:not([style])');
      var hasVisible = Array.from(block.querySelectorAll('.archive-item')).some(function (i) {
        return i.style.display !== 'none';
      });
      block.style.display = hasVisible ? '' : 'none';
    });

    // Empty state
    var emptyEl = document.querySelector('.archive-empty');
    if (visibleCount === 0) {
      if (!emptyEl) {
        emptyEl = document.createElement('div');
        emptyEl.className = 'archive-empty';
        emptyEl.textContent = '没有找到匹配的文章';
        var content = document.querySelector('.archive-content');
        if (content) content.appendChild(emptyEl);
      }
      emptyEl.style.display = '';
    } else if (emptyEl) {
      emptyEl.style.display = 'none';
    }

    // Reset button visibility
    var hasFilter = filters.category !== 'all' || filters.year !== 'all' || filters.month !== 'all';
    if (resetBtn) resetBtn.style.display = hasFilter ? '' : 'none';

    // Disable options that would produce zero results
    updateDisabledOptions();

    // Update URL
    updateURL();
  }

  // ── Disable options that would yield zero results ──────────
  function updateDisabledOptions() {
    var items = document.querySelectorAll('.archive-item');

    ['category', 'year', 'month'].forEach(function (type) {
      var selectId = 'select-' + type;
      var container = document.getElementById(selectId);
      if (!container) return;

      container.querySelectorAll('.option-item').forEach(function (option) {
        var val = option.dataset.value;

        // "all" is never disabled
        if (val === 'all') {
          option.classList.remove('disabled');
          return;
        }

        // Temporarily set this option, check if any post matches
        var testFilters = {
          category: filters.category,
          year: filters.year,
          month: filters.month
        };
        testFilters[type] = val;

        var hasMatch = Array.from(items).some(function (item) {
          if (testFilters.category !== 'all' && item.dataset.category !== testFilters.category) return false;
          if (testFilters.year !== 'all' && item.dataset.year !== testFilters.year) return false;
          if (testFilters.month !== 'all' && item.dataset.month !== testFilters.month) return false;
          return true;
        });

        option.classList.toggle('disabled', !hasMatch);
      });
    });
  }

  // ── Update URL search params ───────────────────────────────
  function updateURL() {
    var params = new URLSearchParams();
    if (filters.category !== 'all') params.set('category', filters.category);
    if (filters.year !== 'all') params.set('year', filters.year);
    if (filters.month !== 'all') params.set('month', filters.month);

    var qs = params.toString();
    var newURL = window.location.pathname + (qs ? '?' + qs : '');
    window.history.replaceState(null, '', newURL);
  }

  // ── Reset all filters ──────────────────────────────────────
  function resetFilters() {
    filters = { category: 'all', year: 'all', month: 'all' };
    ['category', 'year', 'month'].forEach(function (key) {
      updateSelectUI(key, 'all');
    });
    filterPosts();
  }

  // ── Desktop dropdown events ────────────────────────────────
  document.addEventListener('click', function (e) {
    // Toggle dropdown
    var trigger = e.target.closest('.select-trigger');
    if (trigger) {
      var parent = trigger.parentElement;
      document.querySelectorAll('.custom-select.open').forEach(function (el) {
        if (el !== parent) el.classList.remove('open');
      });
      parent.classList.toggle('open');
      e.stopPropagation();
      return;
    }

    // Select option
    var option = e.target.closest('.option-item');
    if (option) {
      // Block disabled options
      if (option.classList.contains('disabled')) return;

      var selectContainer = option.closest('.custom-select');
      var value = option.dataset.value;
      var type = selectContainer.id.replace('select-', ''); // category, year, month

      selectContainer.querySelector('.trigger-text').textContent = option.textContent;
      selectContainer.querySelectorAll('.option-item').forEach(function (o) { o.classList.remove('selected'); });
      option.classList.add('selected');
      selectContainer.classList.remove('open');

      filters[type] = value;
      filterPosts();
      return;
    }

    // Click outside — close all dropdowns
    if (!e.target.closest('.custom-select')) {
      document.querySelectorAll('.custom-select.open').forEach(function (el) { el.classList.remove('open'); });
    }
  });

  // Reset button
  if (resetBtn) resetBtn.addEventListener('click', resetFilters);

  // ── Mobile filter logic ────────────────────────────────────
  var mobileBtn = document.getElementById('mobile-filter-btn');
  var modal = document.getElementById('mobile-modal');
  var closeBtn = document.getElementById('modal-close-btn');
  var doneBtn = document.getElementById('modal-done-btn');

  function toggleModal(show) {
    if (!modal) return;
    if (show) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (mobileBtn) mobileBtn.addEventListener('click', function () { toggleModal(true); });
  if (closeBtn) closeBtn.addEventListener('click', function () { toggleModal(false); });
  if (doneBtn) doneBtn.addEventListener('click', function () { toggleModal(false); });

  // Accordion
  document.querySelectorAll('.accordion-header').forEach(function (header) {
    header.addEventListener('click', function () {
      var item = header.parentElement;
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item').forEach(function (i) { i.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
    });
  });

  // Mobile options
  document.querySelectorAll('.mobile-option').forEach(function (opt) {
    opt.addEventListener('click', function () {
      var type = this.dataset.type;
      var value = this.dataset.value;

      var parentContent = this.parentElement;
      parentContent.querySelectorAll('.mobile-option').forEach(function (o) { o.classList.remove('selected'); });
      this.classList.add('selected');

      filters[type] = value;
      updateSelectUI(type, value);

      setTimeout(function () {
        toggleModal(false);
        filterPosts();
      }, 300);
    });
  });

  // ── Run on DOM ready ───────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFromURL);
  } else {
    initFromURL();
  }
})();
