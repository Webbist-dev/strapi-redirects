'use strict';

const { getPluginService } = require('../../util/getPluginService');

module.exports = () => ({
  find: async (ctx) => {
    ctx.body = getPluginService('content-type').find(ctx.params);
  },
  search: async (ctx) => {
    ctx.body = getPluginService('content-type').search(ctx.request.body);
  }
});
