'use strict';

module.exports = [
  {
    method: 'GET',
    path: '/content-types',
    handler: 'content-type.find',
    config: { policies: [], auth: false }
  },
  {
    method: 'POST',
    path: '/content-types/search',
    handler: 'content-type.search'
  },
  {
    method: 'GET',
    path: '/',
    handler: 'redirect.find',
    config: { policies: [], auth: false }
  },
  {
    method: 'GET',
    path: '/all',
    handler: 'redirect.findAll',
    config: { policies: [], auth: false }
  },
  {
    method: 'POST',
    path: '/',
    handler: 'redirect.create'
  },
  {
    method: 'GET',
    path: '/:id',
    handler: 'redirect.findOne'
  },
  {
    method: 'PUT',
    path: '/:id',
    handler: 'redirect.update'
  },
  {
    method: 'DELETE',
    path: '/:id',
    handler: 'redirect.delete'
  },
  {
    method: 'POST',
    path: '/import',
    handler: 'redirect.import',
    config: { policies: [], auth: false }
  }
];