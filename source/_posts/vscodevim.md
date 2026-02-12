---
title: vscodevim
date: 2026-02-12 22:12:21
categories:
- 技术笔记
tags:
- VSCode
- Vim
cover: run.png
---


ctrl+shift+p
搜索open user settings(json)
粘贴优化配置信息

```json
{
    // --- Vim 核心基础设置 ---
    "vim.useSystemClipboard": true,      // 允许 Vim 使用系统剪贴板 (y 直接复制到系统)
    "vim.hlsearch": true,               // 高亮搜索结果
    "vim.incsearch": true,              // 输入搜索内容时实时跳转
    "vim.easymotion": true,             // 开启快速跳转插件功能
    "vim.useCtrlKeys": true,            // 允许插件接管 Ctrl 组合键 (接近原生 Vim 体验)

    // --- 模式切换优化 ---
    "vim.insertModeKeyBindings": [
        {
            "before": ["j", "j"],       // 连按 jj 快速退出插入模式，手不用去够 Esc 键
            "after": ["<Esc>"]
        }
    ],

    // --- 解决 Cursor AI 冲突 (关键) ---
    // 告诉 Vim 插件不要拦截以下快捷键，交给 Cursor 系统处理
    "vim.handleKeys": {
        "<C-k>": false,                 // 保留 Cursor AI 代码生成窗口 (Ctrl/Cmd + K)
        "<C-l>": false,                 // 保留 Cursor AI Chat 侧边栏 (Ctrl/Cmd + L)
        "<C-p>": false,                 // 保留文件快速搜索
        "<C-f>": false,                 // 保留全局搜索
        "<C-z>": false                  // 保留系统撤销
    },

    // --- 视觉优化 ---
    "vim.cursorStylePerMode.insert": "line",    // 插入模式下光标线状
    "vim.cursorStylePerMode.normal": "block",   // 普通模式下光标块状
    "vim.cursorStylePerMode.visual": "block",   // 可视模式下光标块状
    
    // 保证在 Vim 模式下 AI 的 Tab 补全依然有效
    "editor.tabCompletion": "on"
}
```

与vimtutor的区别：

* jj替代Esc
* 粘贴板打通，普通模式下yy可以复制行
* 保留了AI补全（ctrl-k）和AI聊天（ctrl-l）
* Tab补全在插入模式下可用
