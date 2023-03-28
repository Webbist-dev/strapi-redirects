const { findFromUrls } = require('./findFromUrls');

const checkNewUrlIsLooping = async (originalFromUrl, toUrl, id) => {
  const results = await findFromUrls(toUrl, id);

  if (results.length === 0) {
    return false;
  }

  if (results.length > 1) {
    return true;
  }

  if (results && results[0].to === originalFromUrl) {
    return true;
  }

  return checkNewUrlIsLooping(originalFromUrl, results && results[0].to, id);
};

module.exports = { checkNewUrlIsLooping };
