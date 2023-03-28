const { ApplicationError } = require('@strapi/utils').errors;
const { createCoreService } = require('@strapi/strapi').factories;
const { checkValidity } = require('../../util/redirect/checkValidity');
const NOLIMIT = -1;

module.exports = createCoreService('plugin::redirects.redirect', ({ strapi }) => ({
  findAll: async () => {
    const results = await strapi.entityService.findMany('plugin::redirects.redirect', {
      limit: NOLIMIT
    });

    return results;
  },
  
  create: async (params) => {
    const validity = await checkValidity(params.data);

    if (!validity.ok) {
      throw new ApplicationError(validity.errorMessage, validity.details);
    }

    const results = await strapi.entityService.create('plugin::redirects.redirect', params);

    return results;
  },
  
  update: async (id, params) => {
    const validity = await checkValidity(params.data, Number(id));

    if (!validity.ok) {
      throw new ApplicationError(validity.errorMessage, validity.details);
    }

    const results = await strapi.entityService.update('plugin::redirects.redirect', id, params);

    return results;
  },
  
  import: async ({ data }) => {
    const results = await Promise.all(data.map(async (row) => {
      const validity = await checkValidity(row);
      const existingRedirect = await strapi.entityService.findMany('plugin::redirects.redirect', {
        filters: {
          from: row.from
        }
      });

      if (existingRedirect.length) {
        if (existingRedirect[0].to !== row.to || existingRedirect[0].type !== row.type) {
          try {
            const result = await strapi.entityService.update('plugin::redirects.redirect', existingRedirect[0].id, { data: row });
            result.message = 'Updated';
            result.details = { type: 'UPDATED' };
            return result;
          } catch (e) {
            return {
              ...row,
              error: e.message
            };
          }
        } else {
          return null;
        }
      }

      if (!validity.ok) {
        return {
          ...row,
          error: validity.errorMessage
        };
      }

      try {
        const result = await strapi.entityService.create('plugin::redirects.redirect', { data: row });
        result.message = 'Created';
        result.details = { type: 'CREATED' };
        return result;
      } catch (e) {
        return {
          ...row,
          error: e.message
        };
      }
    }));

    if (!results.length) {
      throw new ApplicationError('No redirects imported');
    } else {
      return results.filter(result => result !== null);
    }
  }
}));