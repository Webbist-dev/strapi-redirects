import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { request, useNotification } from '@strapi/helper-plugin';

import { EmptyStateLayout } from '@strapi/design-system';

import { Flex, Icon, Button, Loader, Portal, Table, Tbody, Tr, Td, Typography } from '@strapi/design-system';
import { ModalLayout, ModalBody, ModalHeader, ModalFooter } from '@strapi/design-system/ModalLayout';

import CheckCircle from '@strapi/icons/CheckCircle';
import IconFile from '@strapi/icons/File';

import { TableHead } from '../TableHead';

import { getImportTableHeaders } from '../../helpers/getTableHeaders';
import parseCSV from '../../helpers/parser'
import getTrad from '../../helpers/getTrad';
import S from '../../helpers/styles';
import './style.css';

const ModalState = {
  SUCCESS: 'success',
  PARTIAL: 'partial',
  UNSET: 'unset',
  NOTHING: 'nothing'
};

export const ImportModal = ({ onClose }) => {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const toggleNotification = useNotification();

  const [redirects, setRedirects] = useState([]);
  const [uploadSuccessful, setUploadSuccessful] = useState(ModalState.UNSET);
  const [uploadingData, setUploadingData] = useState(false);
  const [sortBy, setSortBy] = useState('type');
  const [sortOrder, setSortOrder] = useState('desc');
  const [labelClassNames, setLabelClassNames] = useState('plugin-redirect-import_modal_input-label');

  const tableHeaders = getImportTableHeaders(formatMessage);

  const onReadFile = (e) => {
    const file = e.target.files[0];
    readFile(file);
  };

  const readFile = (file) => {
    if (file.type !== 'text/csv') {
      throw new Error(`File type ${file.type} not supported.`);
    }

    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = await parseCSV(e.target.result);
      setRedirects(data);
    };

    reader.readAsText(file);
  };

  const removeFile = () => {
    setRedirects([]);
  };

  const uploadData = async () => {
    setUploadingData(true);
    try {
      const response = await request('/redirects/import', {
        method: 'POST',
        body: { data: redirects },
      });

      setRedirects(response);

      if (response.length && response.length === redirects.length) {
        setUploadSuccessful(ModalState.SUCCESS);
        toggleNotification({
          type: 'success',
          message:
            formatMessage({
              id: getTrad('modal.import.success.message')
            })
        });
        refreshView();
      } else if (response.length && response.length !== redirects.length) {
        setUploadSuccessful(ModalState.UNSET);
        toggleNotification({
          type: 'warning',
          message:
            formatMessage({
              id: getTrad('modal.import.partial.message')
            })
        });
      } else {
        setUploadSuccessful(ModalState.NOTHING);
        toggleNotification({
          type: 'warning',
          message:
            formatMessage({
              id: getTrad('modal.import.error.message')
            })
        });
      }

    } catch (err) {
      console.log(err)
    } finally {
      setUploadingData(false);
    }
  };

  const refreshView = () => {
    history.push('/tmp');
    history.goBack();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLabelClassNames([labelClassNames, 'plugin-redirect-import_modal_input-label--dragged-over'].join(' '));
  };

  const handleDragLeave = () => {
    setLabelClassNames(labelClassNames.replaceAll('plugin-redirect-import_modal_input-label--dragged-over', ''));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    readFile(file);
  };

  const handleSort = (sortBy) => {
    setSortBy(sortBy);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const showLoader = uploadingData;
  const showFileDragAndDrop = !uploadingData && uploadSuccessful === ModalState.UNSET && redirects.length === 0;
  const showData = !uploadingData && uploadSuccessful === ModalState.UNSET && redirects.length > 0;
  const showSuccess = !uploadingData && uploadSuccessful === ModalState.SUCCESS;
  const showPartialSuccess = !uploadingData && uploadSuccessful === ModalState.PARTIAL;
  const showNothingToImport = !uploadingData && uploadSuccessful === ModalState.NOTHING;

  const showImportButton = showData;
  const showRemoveFileButton = showData;

  return (
    <Portal>
      <ModalLayout onClose={onClose} labelledBy="title">
        <ModalHeader>
          <Flex direction="column" alignItems="flex-start">
            <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
              Import redirects
            </Typography>
            <Typography textColor="neutral800" as="p" id="copy">
              If any of the redirects already exist, they will be updated.
            </Typography>
          </Flex>
        </ModalHeader>
        <ModalBody className="plugin-redirect-import_modal_body">
          {showFileDragAndDrop && (
            <Flex>
              <label className={labelClassNames} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}>
                <span style={{ fontSize: 80 }}>
                  <IconFile />
                </span>
                <Typography style={{ fontSize: '1rem', fontWeight: 500 }} textColor="neutral600" as="p">
                  Drag &amp; drop your file into this area or browse for a file to upload
                </Typography>
                <input type="file" accept=".csv" hidden="" onChange={onReadFile} />
              </label>
            </Flex>
          )}
          {showLoader && (
            <>
              <Flex justifyContent="center">
                <Loader>Importing data...</Loader>
              </Flex>
            </>
          )}
          {showData && (
            <>
              {showPartialSuccess && (
                <Typography textColor="warning600" fontWeight="bold" as="h2">
                  Import Partially Failed
                </Typography>
              )}
              <Table colCount={tableHeaders.length} rowCount={redirects.length}>
                <TableHead headers={tableHeaders} handleSort={handleSort} sortBy={sortBy} sortOrder={sortOrder} />
                <Tbody>
                  {redirects.map((entry) =>
                    <Tr key={entry.id}>
                      <Td>
                        <S.ModalInfo type={entry.details.type} ellipsis style={{ maxWidth: '160px' }}>
                          {entry.from}
                        </S.ModalInfo>
                      </Td>
                      <Td>
                        <S.ModalInfo type={entry.details.type} ellipsis style={{ maxWidth: '160px' }}>
                          {entry.to}
                        </S.ModalInfo>
                      </Td>
                      <Td>
                        <S.ModalInfo type={entry.details.type}>
                          {entry.type}
                        </S.ModalInfo>
                      </Td>
                      {entry.message ? (
                        <Td>
                          <S.ModalInfo type={entry.details.type}>
                            {entry.message}
                          </S.ModalInfo>
                        </Td>
                      ) : (
                        <Td>
                          <S.ModalInfo type={entry.details.type}>
                            -
                          </S.ModalInfo>
                        </Td>
                      )}
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </>
          )}
          {showSuccess && (
            <>
              <EmptyStateLayout
                icon={<Icon width="6rem" height="6rem" color="success500" as={CheckCircle} />}
                content={'Your data has been imported successfully.'}
                action={
                  <Button onClick={onClose} variant="tertiary">
                    Close
                  </Button>
                }
              />
            </>
          )}
          {showNothingToImport && (
            <>
              <Typography textColor="neutral800" fontWeight="bold" as="h2">
                Nothing to import
              </Typography>
            </>
          )}
        </ModalBody>
        <ModalFooter
          startActions={
            <>
              {showRemoveFileButton && (
                <Button onClick={removeFile} variant="tertiary">
                  Remove file
                </Button>
              )}
            </>
          }
          endActions={
            <>
              {showImportButton && <Button onClick={uploadData}>Import redirects</Button>}
            </>
          }
        />
      </ModalLayout>
    </Portal >
  );
};