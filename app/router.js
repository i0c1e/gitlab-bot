'use strict';

const S = require('string')
const contextPath = process.env.CONTEXT_PATH || '/';
const contextPathEndWithSlash = S(contextPath).endsWith('/') ? contextPath : contextPath + '/'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  app.logger.info('===> contextPath: ', contextPath);

  
  
  router.post(`${contextPathEndWithSlash}:path`, controller.home.index);
  router.post(`${contextPathEndWithSlash}`, controller.home.index);
};
