"use strict";

module.exports = [
  {
    method: "GET",
    path: "/",
    handler: "redirects.findAll",
    config: { policies: [], auth: false },
  },
  {
    method: "GET",
    path: "/content-types",
    handler: "content-type.find",
    config: { policies: [], auth: false },
  },
  {
    method: "POST",
    path: "/content-types/search",
    handler: "content-type.search",
  },
];
