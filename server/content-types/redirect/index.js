module.exports = {
  kind: "collectionType",
  collectionName: "redirects",
  info: {
    singularName: "redirect",
    pluralName: "redirects",
    displayName: "redirect",
  },
  options: {
    draftAndPublish: false,
    comment: "",
  },
  pluginOptions: {
    "content-manager": {
      visible: false,
    },
    "content-type-builder": {
      visible: false,
    },
  },
  attributes: {
    from: {
      type: "string",
      required: true,
    },
    to: {
      type: "string",
      required: true,
    },
    type: {
      type: "enumeration",
      enum: [
        "found_302",
        "moved_permanently_301",
        "temporary_redirect_307",
        "gone_410",
        "unavailable_for_legal_reasons_451",
      ],
      default: "found_302",
      required: true,
    },
  },
};
