const app = require('./app');
const express = require('express');

const handler = express();

// 移除 /project-A 前缀并转发
handler.use((req, res, next) => {
  if (req.url.startsWith('/project-A')) {
    req.url = req.url.replace('/project-A', '') || '/';
  }
  next();
});

handler.use(app);

module.exports = handler;
