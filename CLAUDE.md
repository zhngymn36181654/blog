# CLAUDE.md

## Common Commands

```bash
npx hexo clean && npx hexo g && npx hexo s
# Clean cache → Generate static files → Start server
# Access at: http://localhost:4000
```

---

## Project Overview

**Hexo static site generator blog** with a custom **Apple Newsroom-inspired theme** called "gstyle". Converts Markdown to static HTML with minimalist Apple-style design.

**Author:** Zheng Yiming (郑一鸣) | **Site:** https://lostround.xyz/ | **Language:** zh-CN

**Live site:** https://zhngymn36181654.github.io/blog/ (deployed via GitHub Actions to GitHub Pages)

---

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `source/_posts/` | Blog posts (Markdown + front-matter) |
| `themes/gstyle/layout/` | EJS page templates |
| `themes/gstyle/layout/partials/` | Reusable components (head, nav, pagination) |
| `themes/gstyle/source/css/` | Stylesheets (main.css, archive.css, about.css, pagination.css) |
| `themes/gstyle/source/js/` | Interactive features (archive.js, liquid-glass.js, nav.js) |
| `public/` | Generated static site (DO NOT edit directly) |

---

## Post Front-Matter Template

```yaml
---
title: Post Title
date: 2026-01-01
categories: CategoryName
tags: [tag1, tag2]
cover: image.jpg              # Relative to post folder
thumbnail: thumb.jpg          # For archive cards
hero_image: /path/to/hero.jpg # Absolute path for homepage hero cards
badge: FEATURED               # Custom badge (defaults to category name)
---
```

**Note:** With `post_asset_folder: true`, images are stored in `source/_posts/Post-Name/` alongside the markdown file.

---

## Configuration

- **Root `_config.yml`** - Main Hexo config (site metadata, theme selection, pagination, root: /blog/)
- **Theme `themes/gstyle/_config.yml`** - Theme settings (nav menu, homepage cards, archive filtering)

---

## Theme Architecture

### Page Templates
| Template | File | Description |
|----------|------|-------------|
| Homepage | `layout/index.ejs` | 6-column grid: hero (span 6), secondary (span 3), standard (span 2) |
| Archive | `layout/archive.ejs` | Client-side filtered article list with year/month grouping |
| Article | `layout/post.ejs` | Single post with Typora-exported markdown content |
| About | `layout/about.ejs` | About page |

### CSS Files
| File | Scope |
|------|-------|
| `main.css` | Global: nav, homepage cards, article typography, code blocks, footer |
| `archive.css` | Archive page: filter bar, article list, mobile modal |
| `about.css` | About page styles |
| `pagination.css` | Page navigation |

### JS Files
| File | Purpose |
|------|---------|
| `liquid-glass.js` | SVG displacement map Liquid Glass effect (nav bar + archive filter bar) |
| `archive.js` | Client-side DOM filtering with URL params, disabled options logic |
| `nav.js` | Navigation: mobile menu toggle, facehash avatar |

---

## Liquid Glass Effect

Visual effect using SVG displacement maps + `backdrop-filter: url()` for Apple-style glass refraction.

**Applied to:**
- Navigation bar (`.ac-ln-shell`) — params: strength=30, depth=6, radius=26
- Archive filter bar (`.archive-filter`) — params: strength=25, depth=5, radius=20

**NOT applied to:**
- Dropdown menus (deliberately excluded — "反人类的设计")
- Safari/Firefox/mobile (gracefully skipped, no fallback)

**Browser detection:** `supportsBackdropFilterUrl()` in `liquid-glass.js` checks Chrome/Edge support. Only activates on desktop width >= 768px.

**Key file:** `themes/gstyle/source/js/liquid-glass.js`

---

## Archive Filtering

Client-side DOM filtering (no server processing). All posts loaded via `site.posts.sort('date', -1)`.

**Features:**
- 3 dropdown filters: category, year, month
- Cross-filtering with disabled options (grayed out if selecting would yield zero results)
- URL search params for shareable state (`?category=x&year=y`)
- Reset button (绝对定位，不挤压筛选栏)
- Empty state message when no posts match
- Mobile: full-screen modal with accordion UI

**Key files:** `archive.ejs`, `archive.js`, `archive.css`

---

## Design Decisions

- Apple Newsroom-inspired: clean typography, subtle shadows, rounded corners
- No hover opacity tricks on images (caused blur/flicker) — pure scale transform instead
- Hero card uses `object-fit: contain`; secondary/standard cards use `object-fit: cover` with 16:9 aspect ratio
- Archive nav is `position: relative` (not sticky) on archive page — `body.page-archive .ac-ln-shell { position: relative !important; }`
- Content width: 980px with 22px side padding throughout
