const { isEmpty } = require('lodash');

const omitByFalsy = (value, obj) => {
  if (isEmpty(value) && typeof value !== 'number') {
    return undefined;
  }

  return obj;
};

module.exports = { omitByFalsy };
