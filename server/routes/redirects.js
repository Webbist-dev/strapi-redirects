"use strict";

module.exports = [
  {
    method: "GET",
    path: "/:id",
    handler: "redirects.findOne",
    config: { policies: [] },
  },
  {
    method: "GET",
    path: "/",
    handler: "redirects.findAll",
    config: { policies: [] },
  },
  {
    method: "POST",
    path: "/",
    handler: "redirects.create",
    config: { policies: [] },
  },
  {
    method: "PUT",
    path: "/:id",
    handler: "redirects.update",
    config: { policies: [] },
  },
  {
    method: "DELETE",
    path: "/:id",
    handler: "redirects.delete",
    config: { policies: [] },
  },
  {
    method: "POST",
    path: "/import",
    handler: "redirects.import",
    config: { policies: [] },
  },
];
