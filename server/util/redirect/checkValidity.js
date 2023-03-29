const { findDuplicateFromUrls } = require('./findDuplicateFromUrls');
const { checkNewUrlIsLooping } = require('./checkNewUrlIsLooping');
const { getErrors } = require('./getErrors');

const checkValidity = async ({ from, to }, id) => {
  const duplicateFrom = await findDuplicateFromUrls(from, id);
  const loopingUrl = await checkNewUrlIsLooping(from, to, id);
  const ok = [duplicateFrom, loopingUrl].filter(Boolean).length === 0;
  const errors = getErrors(duplicateFrom, loopingUrl);

  return {
    ok,
    errorMessage: errors ? errors.message : undefined,
    details: errors ? errors.details : undefined
  };
};

module.exports = { checkValidity };
