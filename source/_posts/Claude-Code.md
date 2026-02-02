---
title: Claude Code
date: 2026-01-06 22:49:58
tags:
- Claude Code
categories:
- 技术笔记
cover: claudecode.png
---
## 安装Claude Code

环境windows

安装git ，node.js，vscode

打开powershell

```
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned  
```

```
npm install -g @anthropic-ai/claude-code --registry=https://registry.npmmirror.com   
```

```
claude --version
```



配置模型

[安装cc-switch][https://github.com/farion1231/cc-switch/releases]

[购买Zhipu GLM套餐][https://open.bigmodel.cn/]

用cc-swith配置api-key

用记事本打开`C:\Users\你的用户名\.claude.json`

```
{
	"hasCompletedOnboarding":true,
	//...其他配置
}
```

powershell测试

```powershell
claude
```



## 使用Claude Code

### CLAUDE.md

当你在新项目第一次启动Claude，运行

```
/init
```

Claude会扫描你的代码库，理解项目结构。把总结写进CLUADE.md文件。

### MCP

model context protocol

最常用的MCP服务器之一是playwright，它能让Claude控制浏览器。

```
claude mcp add playwright npx @playwright/mcp@latest
```



## Hooks

非常适合做自动化



### skills

https://github.com/anthropics/skills



## 小技巧

危险模式：给予Claude最高权限

```
claude --dangerously-skip-permissions
```

换行 ctrl+j

粘贴图片 ctrl+v

Planning Mode shift+tab两次

让Claude在开发流程中保持高效与专注

```
/compact
/clear
```

