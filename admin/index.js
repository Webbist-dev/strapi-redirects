import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../package.json';
import pluginId from './helpers/pluginId';
import { Repeat } from '@strapi/icons';

const pluginDescription = pluginPkg.strapi.description || pluginPkg.description;
const { name } = pluginPkg.strapi;

export default {
  register(app) {
    app.registerPlugin({
      description: pluginDescription,
      id: pluginId,
      isReady: true,
      isRequired: pluginPkg.strapi.required || false,
      name,
    });

    // app.createSettingSection(
    //   {
    //     id: pluginId,
    //     intlLabel: {
    //       id: pluginPkg,
    //       defaultMessage: `${pluginPkg.strapi.displayName} plugin`
    //     }
    //   },
    //   [
    //     {
    //       intlLabel: {
    //         id: pluginPkg,
    //         defaultMessage: 'Settings'
    //       },
    //       id: 'redirects-settings',
    //       to: `/settings/${pluginId}`,
    //       Component: async () => {
    //         return await import(/* webpackChunkName: "redirects-settings" */ './screens/Settings');
    //       }
    //     }
    //   ]
    // );

    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: Repeat,
      intlLabel: {
        id: pluginPkg,
        defaultMessage: pluginPkg.strapi.displayName
      },
      Component: async () => {
        return await import(/* webpackChunkName: "[request]" */ './screens/Redirect');
      }
    })
  },

  bootstrap() { },

  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(
          /* webpackChunkName: "redirects-translation-[request]" */ `./translations/${locale}.json`
        )
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      }),
    );

    return Promise.resolve(importedTrads);
  },
};
