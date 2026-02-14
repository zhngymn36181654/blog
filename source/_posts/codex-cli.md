---
title: codex-cli
date: 2026-02-14 20:37:12
tags:
- OpenAI
- Codex
categories:
- 技术笔记
cover: codex.png
---



我不想安装在C盘，在D盘新建文件夹`npm-global`,用于存放npm新的全局包。

```
npm config set prefix "D:\npm-global"
```

设置系统环境变量PATH：

```
D:\npm-global
D:\npm-global\node_modules\.bin
```

可以安装啦

```
npm i -g @openai/codex
```

