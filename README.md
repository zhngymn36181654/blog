#  Blog Theme

## 📁 项目结构（Theme Layout）
```
themes/gstyle/
├── layout/ # EJS 页面模板
│ ├── index.ejs # 首页（Apple Newsroom 风格）
│ ├── archive.ejs # Archive 归档页
│ ├── about.ejs # About 页
│ ├── post.ejs # 文章内容页
│ └── partials/ # 可复用组件
│ ├── head.ejs # <head> 元信息
│ ├── nav.ejs # 顶部导航栏（Apple 导航）
│ ├── pagination.ejs # 分页器（苹果风）
│ └── footer.ejs
│
├── source/
│ ├── css/ # 主题样式
│ │ ├── main.css
│ │ ├── archive.css
│ │ ├── pagination.css
│ │ └── about.css
│ ├── img/ # 图片资源（默认封面、icon）
│ └── js/ # 可选：主题交互脚本
│
├── languages/ # 多语言支持（可选）
│
├── _config.yml # 主题专属配置文件
└── package.json # 主题依赖说明
```

