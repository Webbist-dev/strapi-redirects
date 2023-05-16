# Strapi plugin redirects

This plugin allows a user to manage redirects from the admin panel.

Once the plugin is enabled, you should see a new option (Redirects) under plugins in the admin dashboard. 

Inside this plugin you can add redirects, each redirect requires the following fields [to, from, type].

The `To` field represents the destination URL where the user should be redirected to. The `From` field represents the original URL that the user attempted to access. The `Type` field represents the type of redirect to be used (e.g. 301 or 302).

Once a redirect is added, it will be output on the endpoint `api/redirects` as a JSON object. This endpoint can be accessed by authenticated users with the appropriate permissions.

## Installation

1. Install the plugin via npm:

```npm install strapi-plugin-redirects``` or ```yarn add strapi-plugin-redirects```

2. Enable the plugin in your Strapi project by adding the following line to `./config/plugins.js`:


```
module.exports = ({ env }) => ({
  // ...
  plugins: [
    // ...
    redirects : {
      enabled: true,
    },
  ],
  // ...
});
```

3. Rebuild and restart your Strapi server and the plugin should be ready to use.

## Usage

1. Log in to your Strapi admin panel and navigate to the `Redirects` option under plugins.

2. Click on the `Add New Redirect` button to add a new redirect.

3. Fill in the required fields (To, From, and Type) for the redirect.

4. Save the redirect and it should be output on the endpoint `api/redirects`.

5. To view the redirects, make a GET request to the `api/redirects` endpoint. The response should be a JSON object containing all of the redirects.

## Importing

1. Upload a csv file with the headers: 
  - from
  - to
  - type

2. You can use relative or absolute paths depending on your use case for the api for "from" and "to"

3. You should use either 301/302 or permanent/temporary for parsing to work and map to the correct type in the enumerable field

## Frontend

Since Strapi is headless this plugin is simply a way for content editors or SEOers to manage redirects to be consumed by the frontend. An example implementation of useage of the redirects in next.js is:

1. Request the endpoint as part of the build process to be included in next.config.js

The redirects request and mapping file could look something like this:

```
const fetch = require('isomorphic-unfetch');

// Bake redirects into next config at build time
const redirects = () => {
  const apiUrl = process.env.NEXT_STRAPI_API_URL || 'http://localhost:1337/api';

  return fetch(`${apiUrl}/redirects?pagination[start]=0&pagination[limit]=-1`)
    .then((res) => res.json())
    .then((response) => {
      const redirects = response.data.map((redirect) => ({
        source: redirect.attributes.from,
        destination: redirect.attributes.to,
        permanent: redirect.attributes.type === 'permanent',
      }));

      return redirects;
    })
};

module.exports = redirects;
```

And using it in the next.config.js would work like this. 

```
const redirects = require('./redirects');

module.exports = {
  ...
  redirects: () => {
    return redirects();
  }
};
```

## Contributions

Inspired by [@webbio](https://www.npmjs.com/package/@webbio/strapi-plugin-redirects) plugin which works very similarly but is not on the marketplace or on a public repository for some reason (I added import functionality, would have done a pull request if it was public!)

- French Translation [ChristopheCVB](https://github.com/ChristopheCVB)
- German Translation [meowhib](https://github.com/meowhib)

If you want to help out I have some things I'd love to implement with this plugin.

1. Read from existing content types and have a settings page to "enable" redirects on specific content types so the user can select a collection or single type and be prompted with a modal to add a redirect if a content item is deleted or a UID like a slug is renamed. 

2. Add provider support for Vercel/Netlify/Firebase/Ampliphy/Render.io so redirects are uploaded automatically on CRUD events to be handled by the host (I know render.io only allows GET requests for it's redirects dashboard)
 
## License

This plugin is licensed under the MIT. See the LICENSE file for more information.
