# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Hexo static site generator blog** with a custom **Apple Newsroom-inspired theme** called "gstyle". The blog converts Markdown files into static HTML pages with a minimalist, Apple-style design.

**Author:** Zheng Yiming (郑一鸣) | **Site:** https://lostround.xyz/ | **Language:** zh-CN

## Development Environment

**Conda Virtual Environment:** `blog` - Activate before running commands:
```bash
conda activate blog
```

## Development Commands

### Common Test Command
```bash
hexo clean && hexo g && hexo s
# Equivalent to: clean cache → generate static files → start server
# Access at: http://localhost:4000
```



## Architecture Overview

### Content Flow
```
Markdown Posts (source/_posts/*.md)
  → Hexo Processor (parses front-matter & markdown)
  → EJS Templates (themes/gstyle/layout/)
  → Static HTML (public/)
```

### Template System
- **Engine:** EJS (Embedded JavaScript)
- **Layout inheritance:** Uses `layout.ejs` as master wrapper with `<%- partial() %>` for components
- **Page-specific layouts:** `index.ejs`, `post.ejs`, `archive.ejs`, `about.ejs`, `category.ejs`, `tag.ejs`
- **Body classes:** Different page types get specific body classes (`.page-home`, `.page-post`, `.page-archive`, `.page-about`)

### Key Directories

| Directory | Purpose |
|-----------|---------|
| `source/_posts/` | Blog posts in Markdown with front-matter |
| `themes/gstyle/layout/` | EJS page templates |
| `themes/gstyle/layout/partials/` | Reusable components (head, nav, footer, pagination, comments) |
| `themes/gstyle/source/css/` | Stylesheets (main.css, archive.css, about.css, highlight.css, typora-toc.css) |
| `themes/gstyle/source/js/` | Interactive features (main.js, archive.js, typora-toc.js, newsroom-nav.js, about.js) |
| `scaffolds/` | Post templates (post.md, page.md, draft.md) |
| `public/` | Generated static site (DO NOT edit directly) |

### Configuration Files

**Root `_config.yml`** - Main Hexo configuration:
- Site metadata, URL structure, permalinks
- Theme selection (`theme: gstyle`)
- Post asset folder enabled (`post_asset_folder: true`)
- Pagination settings (10 posts per page)
- Syntax highlighting with highlight.js

**Theme `themes/gstyle/_config.yml`** - Theme-specific settings:
- Navigation menu items
- Newsroom homepage settings (hero card count, default cover)
- Archive filtering (enable_filter, card_layout, group_by, thumbnail_field)
- Pagination style

## Post Front-Matter

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

## Design System

### CSS Architecture
- **CSS Variables:** Defined in `:root` for colors, fonts, spacing (see main.css)
- **Design Language:** Apple-inspired with SF Pro fonts, backdrop blur, subtle animations
- **Responsive Breakpoints:** Mobile (≤734px), Tablet (735px-1023px), Desktop (≥1024px)
- **Grid System:** 6-column grid for homepage cards

### JavaScript Architecture
- **Vanilla JS:** No frameworks, all custom implementations
- **IIFE Pattern:** Modules wrapped in immediately-invoked functions
- **Event Delegation:** Efficient event handling for dynamic content

## Key Features

### Homepage (Apple Newsroom Style)
- Card-based layout with three types: hero (large), secondary (medium), standard (small)
- `hero_count` in theme config controls number of hero cards
- Cards determined by `hero_image` front-matter field


### Archive Page
- Filterable by category/year/month with URL parameters
- Card layout (left image, right text)
- Grouped by month (configurable to year)

### Mobile Navigation
- Full-screen overlay menu
- Animated chevron (SVG SMIL animations)
- Staggered link reveal animations

## Styling Notes

- **Navigation:** Sticky on homepage and post pages, NOT sticky on archive page
- **Code highlighting:** Flat, minimalist design using highlight.js (GitHub Light theme colors)
- **Typography:** Optimized for Chinese character support with proper line heights
- **Apple design details:** SF Pro font stack, card-based layouts with shadows, hover animations


