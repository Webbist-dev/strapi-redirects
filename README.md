# Strapi Plugin for Managing Redirects

This plugin provides a convenient way to manage URL redirects within a dedicated collection type in Strapi, catering to the headless nature of the CMS. While it does not automatically handle redirects on the server side, it offers a structured endpoint from which frontend applications can fetch redirect rules and implement redirection logic as needed. This approach empowers developers and content managers to seamlessly integrate and manage redirect rules, enhancing SEO and user experience by leveraging the flexibility of Strapi's headless architecture.

![Version](https://img.shields.io/badge/version-1.0.4-blue.svg?cacheSeconds=2592000)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://github.com/Webbist-dev/strapi-redirects/#readme)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/Webbist-dev/strapi-redirects/graphs/commit-activity)
[![License: MIT](https://img.shields.io/github/license/Webbist-dev/strapi-redirects)](https://github.com/Webbist-dev/strapi-redirects/blob/master/LICENSE)
[![Twitter: webbist](https://img.shields.io/twitter/follow/webbist.svg?style=social)](https://twitter.com/webbist)

## Features

- **Admin Panel Integration:** Once installed, the plugin adds a new section called "Redirects" under the plugins category in the Strapi admin dashboard. This intuitive interface lets you effortlessly manage your redirects.
- **Flexible Redirects Management:** Create redirects by specifying the origin URL (`From`), the destination URL (`To`), and the redirect type (`Type`).
- **Accessible Endpoint:** Redirects are made available through the `api/redirects` endpoint as a JSON object. This endpoint is accessible to authenticated users with the appropriate permissions, enabling easy integration with your frontend.

## Getting Started

### Installation

1. Install the plugin using npm or yarn:

```npm install strapi-plugin-redirects``` or ```yarn add strapi-plugin-redirects```

2. Enable the plugin in Strapi by adding it to your ./config/plugins.js:

```
module.exports = ({ env }) => ({
  // Other plugin configurations...
  redirects: {
    enabled: true,
  },
});
```

3. Restart your Strapi server for the changes to take effect.

## How to Use

1. Access the Strapi admin panel and locate the `Redirects` section within the plugins area.
2. To add a new redirect, click on `Add New Redirect` and fill in the `To`, `From`, and `Type` fields accordingly.
3. After saving, the new redirect will be available at the `api/redirects` endpoint.
4. To fetch redirects, send a GET request to `api/redirects`. The response will be a JSON object listing all configured redirects.

### Importing Redirects

You can import redirects in bulk by uploading a CSV file with `from`, `to`, and `type` headers. Both relative and absolute paths are supported for maximum flexibility, and specifying `permanent` or `temporary` in the `type` field correctly maps to the respective redirect type.

## Example Usage with Next.js

This plugin is ideal for content editors or SEO specialists managing redirects in a headless CMS setup. Here's how you can integrate it with a Next.js project:

1. Fetch redirects during the build process to include them in `next.config.js`.

Example script for fetching redirects:

```javascript
const redirects = () => {
  return fetch('http://localhost:1337/redirects')
    .then(res => res.json())
    .then(response => {
      // Use redirects however you need to
    });
};

module.exports = redirects;
```

Incorporate the fetched redirects into next.config.js:


```javascript
const getRedirects = require('./redirects');

module.exports = {
  // Other configurations...
  redirects: () => getRedirects(),
};
```

## Redirect Types

Define your redirect types with clear descriptions, for instance:

- moved_permanently_301: The resource has moved permanently to a new URL.
- found_302: The resource is temporarily located at a different URL.
- temporary_redirect_307: Temporarily moved to a new URL with the same method used.
- gone_410: The resource is permanently removed and won't be available again.
- unavailable_for_legal_reasons_451: Access to the resource is restricted due to legal reasons.

## Contributions

This plugin is inspired by and extends the functionalities of the [@webbio](https://www.npmjs.com/package/@webbio/strapi-plugin-redirects) plugin by adding features like bulk import capabilities. Contributions in the form of translations, feature enhancements, and bug fixes are highly encouraged and appreciated.

We are particularly interested in expanding the plugin to include:

1. A settings page to enable redirects on specific content types, allowing users to easily manage redirects when content items are deleted or slugs are changed.
2. Integration with hosting providers like Vercel, Netlify, Firebase, Amplify, and Render.io to automate the management of redirects through CRUD events.

Feel free to reach out or submit pull requests on GitHub if you're interested in contributing to the development of this plugin.

## License

This plugin is available under the MIT License. For more information, please refer to the LICENSE file in the repository.