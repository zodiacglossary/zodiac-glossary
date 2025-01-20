const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  console.log('this stupid function actually gets called!')
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3001/api',
      changeOrigin: true,
    })
  );
};
