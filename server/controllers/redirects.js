'use strict';

const { getPluginService } = require('../helpers/getPluginService');

module.exports = () => ({
  findOne: async (ctx) => {
    ctx.body = await getPluginService('redirects').findOne(ctx.params.id);
  },
  findAll: async (ctx) => {
    ctx.body = await getPluginService('redirects').findAll(ctx.query);
  },
  create: async (ctx) => {
    ctx.body = await getPluginService('redirects').create(ctx.request.body);
  },
  update: async (ctx) => {
    ctx.body = await getPluginService('redirects').update(ctx.params.id, ctx.request.body);
  },
  delete: async (ctx) => {
    ctx.body = await getPluginService('redirects').delete(ctx.params.id);
  },
  import: async (ctx) => {
    ctx.body = await getPluginService('redirects').import(ctx.request.body);
  },
});