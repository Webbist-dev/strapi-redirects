const { omitByFalsy } = require('./omitByFalsy');

const findDuplicateFromUrls = async (url, id) => {
  try {
    const results =
      (await strapi.entityService.findMany('plugin::redirects.redirect', {
        filters: {
          from: url,
          ...omitByFalsy(id, { $not: { id } })
        }
      })) || [];

    return results.length > 0;
  } catch (e) {
    return false;
  }
};

module.exports = { findDuplicateFromUrls };
