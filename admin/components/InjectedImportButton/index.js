import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import { Button } from '@strapi/design-system';
import { Upload } from '@strapi/icons';

import { ImportModal } from '../ImportModal';

import getTrad from '../../helpers/getTrad';

export const InjectedImportButton = ({ onImportClose }) => {
  const { formatMessage } = useIntl();
  const [importVisible, setImportVisible] = useState(false);

  const openImportModal = () => {
    setImportVisible(true);
  };

  const closeImportModal = () => {
    setImportVisible(false);
    onImportClose(); 
  };

  return (
    <>
      <Button startIcon={<Upload />} onClick={openImportModal}>
        {formatMessage({
          id: getTrad('overview.header.importButton.title')
        })}
      </Button>

      {importVisible && <ImportModal onClose={closeImportModal} />}
    </>
  )
};