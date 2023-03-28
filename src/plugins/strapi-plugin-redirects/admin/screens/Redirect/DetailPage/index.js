import React, { memo, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { request, useNotification } from '@strapi/helper-plugin';
import { ArrowLeft as ArrowLeftIcon } from '@strapi/icons';
import { Link, Box, BaseHeaderLayout, ContentLayout } from '@strapi/design-system';

import pluginId from '../../../helpers/pluginId';
import getTrad from '../../../helpers/getTrad';

import { RedirectForm } from '../../../components/RedirectForm';

const RedirectDetailPage = () => {
  const { formatMessage } = useIntl();
  const { id: selectedRedirectId } = useParams();
  const history = useHistory();
  const toggleNotification = useNotification();
  const [redirect, setRedirect] = useState(undefined);
  const [resetCount, setResetCount] = useState(0);

  const isNewRedirect = window.location.href.endsWith('new');

  useEffect(() => {
    if (selectedRedirectId) {
      getRedirect();
    }
  }, [selectedRedirectId]);

  const getRedirect = async () => {
    try {
      const result = await request(`/${pluginId}/${selectedRedirectId}`);

      if (!result || !result.data || !result.data.id) {
        throw new Error('No redirect found');
      }

      setRedirect({ id: result.data.id, ...result.data.attributes });
    } catch (error) {
      console.error(error);
      setRedirect(undefined);
    }
  };

  const handleSubmit = async (values, submitMore) => {
    try {
      if (!values || !values.from) {
        throw new Error('No values');
      }

      if (isNewRedirect) {
        const redirect = await createRedirect(values);

        if (redirect || redirect.id) {
          if (submitMore) {
            setResetCount(resetCount + 1);
          } else {
            history.push(`/plugins/${pluginId}/${redirect.id}`);
          }
        }
      } else {
        await updateRedirect(values);

        if (submitMore && redirect) {
          history.push(`/plugins/${pluginId}/new`);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const createRedirect = async (redirect) => {
    try {
      const result = await request(`/${pluginId}`, {
        method: 'POST',
        body: {
          data: redirect
        }
      });

      toggleNotification({
        type: 'success',
        message: formatMessage({
          id: getTrad('detail.form.save.notify.success.new.message')
        })
      });

      return { id: result.data.id, ...result.data.attributes };
    } catch (error) {
      const strError = JSON.stringify(error);
      const parsedError = JSON.parse(strError);

      toggleNotification({
        type: 'warning',
        message: formatMessage({
          id: getTrad(`detail.form.save.notify.error.${getSaveRedirectErrorMessage(parsedError)}.message`)
        })
      });
    }
  };

  const updateRedirect = async (redirect) => {
    try {
      await request(`/${pluginId}/${selectedRedirectId}`, {
        method: 'PUT',
        body: {
          id: selectedRedirectId,
          data: redirect
        }
      });
      toggleNotification({
        type: 'success',
        message: formatMessage({
          id: getTrad('detail.form.save.notify.success.message')
        })
      });
    } catch (error) {
      toggleNotification({
        type: 'warning',
        message: formatMessage({
          id: getTrad(`detail.form.save.notify.error.${getSaveRedirectErrorMessage(error)}.message`)
        })
      });
    }
  };

  return (
    <Box>
      <BaseHeaderLayout
        navigationAction={
          <Link startIcon={<ArrowLeftIcon />} to={`/plugins/${pluginId}`}>
            {formatMessage({ id: getTrad('detail.header.back') })}
          </Link>
        }
        title={formatMessage({
          id: getTrad(isNewRedirect ? 'detail.header.title.new' : 'detail.header.title')
        })}
        as="h2"
      />
      <ContentLayout>
        <Box>
          {(redirect || isNewRedirect) && (
            <RedirectForm
              initialValues={redirect}
              handleSubmit={handleSubmit}
              isNew={isNewRedirect}
              resetCount={resetCount}
            />
          )}
        </Box>
      </ContentLayout>
    </Box>
  );
};

export default memo(RedirectDetailPage);
const getSaveRedirectErrorMessage = (error) => {
  const strError = JSON.stringify(error);

  if (!error || !strError) {
    return undefined;
  }

  const parsedError = JSON.parse(strError);

  return parsedError && parsedError.response && parsedError.response.payload && parsedError.response.payload.error && parsedError.response.payload.error.details && parsedError.response.payload.error.details.type ? parsedError.response.payload.error.details.type : 'general';
}