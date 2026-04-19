const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(cors());

app.use('/nasa', createProxyMiddleware({
  target: 'https://exoplanetarchive.ipac.caltech.edu',
  changeOrigin: true,
  pathRewrite: { '^/nasa': '' },
}));

app.listen(3001, () => {
  console.log('🚀 NASA Proxy server running on http://localhost:3001');
});