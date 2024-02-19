'use strict';

module.exports = [
  {
    method: 'GET',
    path: '/:id',
    handler: 'redirects.findOne',
    config: { policies: [], auth: false }
  },
  {
    method: 'GET',
    path: '/',
    handler: 'redirects.findAll',
    config: { policies: [], auth: false }
  },
  {
    method: 'POST',
    path: '/',
    handler: 'redirects.create',
    config: { policies: [], auth: false }
  },
  {
    method: 'PUT',
    path: '/:id',
    handler: 'redirects.update',
    config: { policies: [], auth: false }
  },
  {
    method: 'DELETE',
    path: '/:id',
    handler: 'redirects.delete',
    config: { policies: [], auth: false }
  },
  {
    method: 'POST',
    path: '/import',
    handler: 'redirects.import',
    config: { policies: [], auth: false }
  }
];