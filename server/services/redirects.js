const { errors } = require('@strapi/utils');
const { ApplicationError } = errors;
const { validateRedirect } = require('../helpers/redirectValidationHelper');
const NOLIMIT = -1;

module.exports = ({ strapi }) => ({
  /**
   * Find a single redirect
   * 
   * @param {*} id 
   * @returns 
   */
  findOne: async (id) => {
    const results = await strapi.entityService.findOne('plugin::redirects.redirect', id);

    return results;
  },

  /**
   * Find all redirects
   * 
   * @returns 
   */
  findAll: async (params = {}) => {
    // Destructure and set default values for sort, filters, and handle pagination using start and limit
    const {
      sort = 'id:desc', // Default sorting order
      filters = {},
      pagination = {}
    } = params;
  
    // Calculate start (offset) based on page and pageSize (or limit)
    let start = 0;
    const limit = parseInt(pagination.pageSize, 10) || 10; // Default limit
    if (pagination.page) {
      start = (parseInt(pagination.page, 10) - 1) * limit;
    }
  
    // Fetch the redirects with filters, sort, and calculated start and limit
    const redirects = await strapi.entityService.findMany('plugin::redirects.redirect', {
      sort,
      start,
      limit,
      filters,
    });
  
    // Calculate the total number of redirects matching the filters (without pagination limit)
    const total = await strapi.entityService.count('plugin::redirects.redirect', { filters });
  
    return {
      redirects,
      total,
    };
  },

  /**
   * Create a redirect
   * 
   * @param {Object} params 
   * @returns 
   */
  create: async ({ body }) => {
    const validity = await validateRedirect(body);

    if (!validity.ok) {
      throw new ApplicationError(validity.errorMessage, validity.details);
    }

    const results = await strapi.entityService.create('plugin::redirects.redirect', body);

    return results;
  },

  /**
   * Update a redirect
   * 
   * @param {Number} id 
   * @param {Object} body 
   * @returns 
   */
  update: async (id, { body }) => {
    const validity = await validateRedirect(body, isUpdate = true);

    if (!validity.ok) {
      throw new ApplicationError(validity.errorMessage, validity.details);
    }

    const results = await strapi.entityService.update('plugin::redirects.redirect', id, body);

    return results;
  },

  /**
   * Delete a redirect
   * 
   * @param {Number} id 
   * @returns Redirect Object
   */
  delete: async (id) => {
    const results = await strapi.entityService.delete('plugin::redirects.redirect', id);

    return results;
  },

  /**
   * Import redirects
   * 
   * @param {Object} body 
   * @returns 
   */
  import: async ({ body }) => {
    const importResults = [];
    for (const row of body.data) {
  
      // Skip processing for rows already marked as INVALID in the parsing phase
      if (row.status === 'INVALID') {
        importResults.push(row); // Include these rows in the importResults to report back as skipped due to validation failures
        continue;
      }
  
      try {
        // Since the row passed initial CSV parsing validation, proceed with database-specific validation
        const validity = await validateRedirect({ data: row }, false);
  
        if (!validity.ok) {
          // If further validation fails (e.g., against database entries), mark as INVALID with detailed reasons
          importResults.push({ ...row, status: 'INVALID', reason: validity.errorMessage, details: validity.details });
          continue;
        }
  
        let operationResult;
        // As validateRedirect ensures the row is valid for import, directly create or update without re-checking for duplicates
        const existingRedirects = await strapi.entityService.findMany('plugin::redirects.redirect', {
          filters: { from: row.from }
        });
  
        if (existingRedirects.length > 0) {
          // Update the existing redirect if it's considered valid for an update
          const existingRedirect = existingRedirects[0];
          operationResult = await strapi.entityService.update('plugin::redirects.redirect', existingRedirect.id, { data: row });
          importResults.push({ ...operationResult, status: 'UPDATED', details: { type: 'UPDATED' } });
        } else {
          // Create a new redirect if no valid duplicates are found in the database
          operationResult = await strapi.entityService.create('plugin::redirects.redirect', { data: row });
          importResults.push({ ...operationResult, status: 'CREATED', details: { type: 'CREATED' } });
        }
      } catch (e) {
        console.error('error during import operation', e);
        importResults.push({ ...row, status: 'ERROR', error: e.message });
      }
    }
  
    return importResults;
  }
});
