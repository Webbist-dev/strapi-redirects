const { omitByFalsy } = require('./omitByFalsy');

const findFromUrls = async (from, id) => {
  try {
    const results =
      (await strapi.entityService.findMany('plugin::redirects.redirect', {
        filters: {
          from,
          ...omitByFalsy(id, { $not: { id } })
        }
      })) || [];

    return results;
  } catch (e) {
    return [];
  }
};

module.exports = { findFromUrls };
