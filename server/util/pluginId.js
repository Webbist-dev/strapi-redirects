'use strict';

const pluginPkg = require('../../package.json');

/**
 * A helper function to obtain the plugin's ID.
 * 
 * @return {string} The plugin ID. 
 */

const pluginId = pluginPkg.name.replace(
  /^(@[^-,.][\w,-]+\/|strapi-)plugin-/i,
  ""
);

module.exports = pluginId;
