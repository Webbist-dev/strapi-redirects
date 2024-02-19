import React, { memo, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useFetchClient, useNotification } from '@strapi/helper-plugin';
import { ArrowLeft as ArrowLeftIcon } from '@strapi/icons';
import { Loader, Link, Box, BaseHeaderLayout, ContentLayout } from '@strapi/design-system';

import pluginId from '../../../helpers/pluginId';
import getTrad from '../../../helpers/getTrad';

import { RedirectForm } from '../../../components/RedirectForm';

const RedirectDetailPage = () => {
  const { get, post, put } = useFetchClient();
  const { formatMessage } = useIntl();
  const { id: selectedRedirectId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(true);
      const { data } = await get(`/${pluginId}/${selectedRedirectId}`);

      setRedirect(data);
    } catch (error) {
      console.error(error);
      setRedirect(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData, submitMore) => {
    try {
      if (!formData || !formData.from) {
        throw new Error('No form values');
      }

      if (isNewRedirect) {
        const redirect = await createRedirect(formData);

        if (redirect || redirect.id) {
          if (submitMore) {
            setResetCount(resetCount + 1);
          } else {
            history.push(`/plugins/${pluginId}/${redirect.id}`);
          }
        }
      } else {
        await updateRedirect(formData);

        if (submitMore && redirect) {
          history.push(`/plugins/${pluginId}/new`);
        }
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error && error.response.data.error.details) {
        const errorType = error.response.data.error.details.type;
        toggleNotification({
          type: 'warning',
          message: formatMessage({
            id: getTrad(`detail.form.save.notify.error.${errorType}.message`)
          })
        });
      } else {
        toggleNotification({
          type: 'warning',
          message: formatMessage({
            id: getTrad('detail.form.save.notify.error.general.message')
          })
        });
      }
    }
  };

  const createRedirect = async (redirect) => {
    const result = await post(`/${pluginId}`, { body: { data: redirect } });

    if (!result.data) {
      toggleNotification({
        type: 'warning',
        message: formatMessage({
          id: getTrad(`detail.form.save.notify.error.${result.error.details.type}.message`)
        })
      });
    }

    toggleNotification({
      type: 'success',
      message: formatMessage({
        id: getTrad('detail.form.save.notify.success.new.message')
      })
    });

    return { id: result.data.id, ...result.data.attributes };
  };

  const updateRedirect = async (redirect) => {
    await put(`/${pluginId}/${selectedRedirectId}`, {
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
          {isLoading && !isNewRedirect && <Loader />}
          {(!isLoading || isNewRedirect) && (
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