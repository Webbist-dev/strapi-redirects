'use strict';

const register = require('./register');
const bootstrap = require('./bootstrap');
const destroy = require('./destroy');
const config = require('./config');
const controllers = require('./controllers');
const routes = require('./routes');
const services = require('./services');
const schema = require('./content-types/redirect');

module.exports = {
  register,
  bootstrap,
  destroy,
  config,
  controllers,
  routes,
  services,
  contentTypes: {
    redirect: {
      schema
    }
  },
  policies: {},
  middlewares: {},
};