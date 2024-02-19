'use strict';

module.exports = ({ strapi }) => ({
  find: async () => {
    const result = await strapi.plugins['content-manager'].services['content-types'].findAllContentTypes();

    const mappedResult = result.filter((contentType) => contentType.uid.startsWith('api::'));

    return mappedResult;
  },
  search: async (body) => {
    const { contentTypeUid, searchValue } = body;

    const contentType = strapi.plugins['content-manager'].services['content-types'].findContentType(contentTypeUid);

    if (!searchValue) {
      const result = await strapi.query(contentTypeUid).findMany({});

      return result;
    }

    const result = await strapi.query(contentType.uid).search({
      _q: searchValue
    });

    return result;
  }
});
