/**
 * Queries and filters redirects based on the provided URL and optional ID.
 * @param {string} url The URL to query redirects for.
 * @param {string} [id] Optional ID to exclude from the query results.
 * @param {boolean} [returnCount=false] Whether to return the count of results instead of the results themselves.
 * @returns {Promise<Array|boolean|number>} The query results, or a boolean or count based on the returnCount parameter.
 */
async function queryRedirects(url, id, returnCount = false) {
  try {
    const filters = { from: url, ...(id ? { id: { $not: id } } : {}) };
    const results = await strapi.entityService.findMany('plugin::redirects.redirect', { filters }) || [];
    return returnCount ? results.length : results;
  } catch (e) {
    console.error('Failed to query redirects:', e);
    return returnCount ? 0 : [];
  }
}

/**
 * Recursively checks for URL looping.
 * @param {string} originalFromUrl The original "from" URL to check for loops.
 * @param {string} toUrl The "to" URL to check against the original "from" URL.
 * @param {string} id The ID of the redirect being validated to exclude from checks.
 * @param {Set} [checkedUrls=new Set()] A set of URLs that have already been checked.
 * @returns {Promise<boolean>} Whether a loop has been detected.
 */
async function isUrlLooping(originalFromUrl, toUrl, id, checkedUrls = new Set()) {
  if (checkedUrls.has(toUrl)) return false;
  checkedUrls.add(toUrl);

  const results = await queryRedirects(toUrl, id);
  for (let result of results) {
    if (result.to === originalFromUrl || await isUrlLooping(originalFromUrl, result.to, id, checkedUrls)) {
      return true;
    }
  }
  return false;
}

/**
 * Validates a redirect, checking for duplicates and loops.
 * @param {Object} body The request body containing the redirect data.
 * @param {boolean} [isUpdate=false] Whether this validation is for an update operation.
 * @returns {Promise<Object>} The validation result.
 */
async function validateRedirect(redirect, isUpdate = false) {

  const id = redirect.id || undefined;
  const { from, to } = redirect.data;

  let hasDuplicate = false;
  if (!isUpdate) {
    hasDuplicate = await queryRedirects(from, id, true) > 0;
  } else {
    const existingRedirect = await strapi.entityService.findOne('plugin::redirects.redirect', id);
    if (!existingRedirect || existingRedirect.from !== from) {
      hasDuplicate = await queryRedirects(from, id, true) > 0;
    }
  }

  const hasLoop = await isUrlLooping(from, to, id);
  const isValid = !hasDuplicate && !hasLoop;

  const errors = compileErrors(hasDuplicate, hasLoop);

  return {
    ok: isValid,
    errorMessage: errors?.message,
    details: errors?.details
  };
}

/**
 * Compiles error messages based on validation results.
 * @param {boolean} hasDuplicate Whether a duplicate redirect was found.
 * @param {boolean} hasLoop Whether a redirect loop was detected.
 * @returns {Object|undefined} The error message and details, if any.
 */
function compileErrors(hasDuplicate, hasLoop) {
  if (hasDuplicate) {
    return { message: "Duplicate redirect. Another redirect with the same 'From' field already exists.", details: { type: 'DUPLICATE' } };
  }
  if (hasLoop) {
    return { message: "Redirect will cause a loop. The 'To' field creates a loop back to the 'From' field.", details: { type: 'LOOP' } };
  }
  return undefined;
}

module.exports = { validateRedirect };
