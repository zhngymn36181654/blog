# CLAUDE.md

## Rule
1. think before coding: state assumptions, don't guess. the model can't read your mind, stop hoping it will

2. simplicity first: minimum code, no speculative abstractions. the moment you let Claude add "for future flexibility," you've added 200 lines you'll delete next quarter

3. surgical changes: touch only what you must. don't let it improve adjacent code, that's how PRs blow up

4. goal-driven execution: define success criteria upfront, loop until verified. without them Claude either loops forever or stops too early

5. use the model only for judgment calls: classification, drafting, summarization, extraction. NOT routing, retries, status-code handling, deterministic transforms. if code can answer, code answers

6. token budgets are not advisory: per-task 4000, per-session 30000. by message 40 of a long debug, Claude is re-suggesting fixes you rejected at message 5

7. surface conflicts, don't average them: two patterns in the codebase? pick one. Claude blending them is how errors get swallowed twice

8. read before you write: read exports, callers, shared utilities. Claude will happily add a duplicate function next to an identical one it never read

9. tests verify intent, not just behavior: a test that can't fail when business logic changes is wrong. all 12 of Claude's tests can pass while the function returns a constant

10. checkpoint every significant step: Claude finished steps 5 and 6 on top of a broken state from step 4. nobody noticed for an hour

11. match the codebase conventions: class components? don't fork to hooks silently. testing patterns assumed componentDidMount, hooks broke them without surfacing

12. fail loud: "completed successfully" with 14% of records silently skipped is the worst class of bug. surface uncertainty, don't hide it


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
| `themes/gstyle/source/js/` | Interactive features (archive.js, nav.js) |
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
| `archive.js` | Client-side DOM filtering with URL params, disabled options logic |
| `nav.js` | Navigation: mobile menu toggle, facehash avatar |

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
