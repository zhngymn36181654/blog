const Hexo = require('hexo');
const hexo = new Hexo(process.cwd(), { silent: true });

hexo.init().then(() => {
    hexo.load().then(() => {
        // Find the post
        const posts = hexo.locals.get('posts').toArray();
        const post = posts.find(p => p.title === '写博客流程');

        if (post) {
            console.log('=== Post Debug Info ===');
            console.log('Title:', post.title);
            console.log('path:', post.path);
            console.log('permalink:', post.permalink);
            console.log('asset_dir:', post.asset_dir);
            console.log('layout:', post.layout);

            // Simulate hexo-filter-pathfix logic
            const articlePath = post.path.replace(/([^\/]+).html$/g,'');
            console.log('Article path after replace:', articlePath);
            console.log('hexo.config.root:', hexo.config.root);
            console.log('Final prefix:', hexo.config.root + articlePath);

            // Parse URL to see what hexo-asset-link would produce
            const url = new URL(post.permalink);
            console.log('URL pathname:', url.pathname);
            console.log('URL path after replace:', url.pathname.replace(/\.[^/.]+$/, '/'));
        }

        process.exit(0);
    });
}).catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
