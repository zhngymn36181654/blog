const Hexo = require('hexo');
const hexo = new Hexo(process.cwd(), { silent: true });

hexo.init().then(() => {
    console.log('=== Hexo Config Debug ===');
    console.log('url:', hexo.config.url);
    console.log('root:', hexo.config.root);
    console.log('root type:', typeof hexo.config.root);
    console.log('========================');
    process.exit(0);
}).catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
