import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

app.use('/api', createProxyMiddleware({
  target: 'https://localhost:7124/api', 
  changeOrigin: true,
  secure: false, 
}));

/*app.use('/chatHub', createProxyMiddleware({
  target: 'https://localhost:7124',
  ws: true,              
  changeOrigin: true,
  secure: false,
  logLevel: 'debug',
}));*/

app.listen(6969, () => {
  console.log('Proxy server is running on http://localhost:6969')
});