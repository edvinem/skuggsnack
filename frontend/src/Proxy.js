const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/auth',
        createProxyMiddleware({
            target: 'http://localhost:9000',
            changeOrigin: true,
        })
    );
    app.use(
        '/chat',
        createProxyMiddleware({
            target: 'http://localhost:9001',
            changeOrigin: true,
        })
    );
};
