'use strict';

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: 'redirect.find',
    config: { policies: [], auth: false }
  }
];