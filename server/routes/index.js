"use strict";

const contentType = require("./content-type");
const redirects = require("./redirects");

module.exports = {
  "content-api": {
    type: "content-api",
    routes: [...contentType],
  },
  admin: {
    type: "admin",
    routes: [...redirects],
  },
};
