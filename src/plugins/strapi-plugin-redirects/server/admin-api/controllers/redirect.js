'use strict';

const { getPluginService } = require('../../util/getPluginService');
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('plugin::redirects.redirect', () => ({
  import: async (ctx) => {
    return getPluginService('redirect').import(ctx.request.body);
  },
  findAll: async () => {
    return getPluginService('redirect').findAll();
  }
}));