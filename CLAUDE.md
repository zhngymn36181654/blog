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

---

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `source/_posts/` | Blog posts (Markdown + front-matter) |
| `themes/gstyle/layout/` | EJS page templates |
| `themes/gstyle/layout/partials/` | Reusable components |
| `themes/gstyle/source/css/` | Stylesheets |
| `themes/gstyle/source/js/` | Interactive features |
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

- **Root `_config.yml`** - Main Hexo config (site metadata, theme selection, pagination)
- **Theme `themes/gstyle/_config.yml`** - Theme settings (nav menu, homepage cards, archive filtering)
