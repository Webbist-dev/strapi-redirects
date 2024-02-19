import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useFetchClient, useNotification } from '@strapi/helper-plugin';
import {
  EmptyStateLayout,
  Flex,
  Icon,
  Button,
  Loader,
  Portal,
  Table,
  Tbody,
  Tr,
  Td,
  Typography,
  ModalLayout,
  ModalBody,
  ModalHeader,
  ModalFooter
} from '@strapi/design-system';
import { CheckCircle, File } from '@strapi/icons';
import { TableHead } from '../TableHead';
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
  const { post } = useFetchClient();
  const { formatMessage } = useIntl();
  const toggleNotification = useNotification();

  const [redirects, setRedirects] = useState([]);
  const [uploadState, setUploadState] = useState(ModalState.UNSET);
  const [uploadingData, setUploadingData] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [sortBy, setSortBy] = useState('type');
  const [sortOrder, setSortOrder] = useState('desc');

  const tableHeaders = [
    {
      name: 'from',
      label: formatMessage({ id: getTrad('overview.table.headers.from') }),
    },
    {
      name: 'to',
      label: formatMessage({ id: getTrad('overview.table.headers.to') }),
    },
    {
      name: 'type',
      label: formatMessage({ id: getTrad('overview.table.headers.type') }),
    },
    {
      name: 'status',
      label: formatMessage({ id: getTrad('overview.table.headers.status') }),
    },
  ];

  const readFileAsync = (file) => new Promise((resolve, reject) => {
    if (file.type !== 'text/csv') {
      reject(new Error(`File type ${file.type} not supported.`));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e.target.error);
    reader.readAsText(file);
  });

  const handleFileChange = async (e) => {
    const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];
    try {
      const content = await readFileAsync(file);
      const data = await parseCSV(content);
      setRedirects(data);
    } catch (error) {
      toggleNotification({
        type: 'warning',
        message: error.toString(),
      });
    }
  };

  const uploadData = async () => {
    setUploadingData(true);
    try {
      const { data } = await post('/redirects/import', { body: { data: redirects } });
      setRedirects(data);

      // Check if all items are CREATED
      const allCreated = data.every(item => item.status === 'CREATED');
      const notificationType = allCreated ? 'success' : 'warning';
      const notificationMessageId = allCreated ? 'modal.import.success.message' : 'modal.import.partial.message';

      setUploadState(allCreated ? ModalState.SUCCESS : ModalState.PARTIAL);
      toggleNotification({
        type: notificationType,
        message: formatMessage({ id: getTrad(notificationMessageId) })
      });
    } catch (err) {
      setUploadState(ModalState.NOTHING);
      toggleNotification({
        type: 'warning',
        message: formatMessage({ id: getTrad('modal.import.error.message') })
      });
    } finally {
      setUploadingData(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileChange(e);
  };

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const removeFile = () => {
    setRedirects([]);
  };

  const importContinue = () => {
    onClose();
  };

  // Adjusted conditions for rendering content
  const showLoader = uploadingData;
  const showFileDragAndDrop = !uploadingData && uploadState === ModalState.UNSET && redirects.length === 0;

  // Show the table of redirects in both UNSET and PARTIAL states if there's data
  const showData = !uploadingData && (uploadState === ModalState.UNSET || uploadState === ModalState.PARTIAL) && redirects.length > 0;

  const showSuccess = !uploadingData && uploadState === ModalState.SUCCESS;
  const showNothingToImport = !uploadingData && uploadState === ModalState.NOTHING;

  // Buttons visibility
  const showPartialSuccess = !uploadingData && showData && uploadState === ModalState.UNSET;
  const showContinueButton = !uploadingData && showData && uploadState === ModalState.PARTIAL;

  return (
    <Portal>
      <ModalLayout onClose={onClose} labelledBy="title">
        <ModalHeader>
          <Flex direction="column" alignItems="flex-start">
            {showContinueButton ? (
              <>
                <Typography fontWeight="bold" textColor="neutral800" as="h2">
                  {formatMessage({ id: getTrad('modal.import.partial.title') })}
                </Typography>
                <Typography textColor="neutral800" as="p">
                  {formatMessage({ id: getTrad('modal.import.partial.description') })}
                </Typography>
              </>
            ) : (
              <>
                <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
                  {formatMessage({ id: getTrad('modal.import.title') })}
                </Typography>
                {!showSuccess && (
                  <Typography textColor="neutral800" as="p" id="copy">
                    {formatMessage({ id: getTrad('modal.import.description') })}
                  </Typography>
                )}
              </>
            )}
          </Flex>
        </ModalHeader>
        <ModalBody className="plugin-redirect-import_modal_body">
          {showFileDragAndDrop && (
            <Flex>
              <label
                htmlFor="file-upload"
                className={`plugin-redirect-import_modal_input-label plugin-redirect-custom_file_upload ${isDragOver ? 'plugin-redirect-import_modal_input-label--dragged-over' : ''}`}
                onDragEnter={handleDragOver}
                onDragOver={handleDragOver} // Prevent the default behavior to allow drop
                onDragLeave={handleDragLeave}
                onDrop={handleDrop} // Handle the file drop
              >
                <File />
                <Typography style={{ fontSize: '1rem', fontWeight: 500 }} textColor="neutral600" as="p">
                  {formatMessage({ id: getTrad('modal.import.dragAndDrop') })}
                </Typography>
                <input id="file-upload" type="file" accept=".csv" onChange={handleFileChange} style={{ display: 'none' }} />
              </label>
            </Flex>
          )}

          {showLoader && (
            <Flex justifyContent="center">
              <Loader>
                {formatMessage({ id: getTrad('modal.import.loading') })}
              </Loader>
            </Flex>
          )}

          {showData && (
            <Table
              colCount={tableHeaders.length}
              rowCount={redirects.length}
            >
              <TableHead
                headers={tableHeaders}
                handleSort={handleSort}
                sortBy={sortBy}
                sortOrder={sortOrder}
              />
              <Tbody>
                {redirects.map((entry, index) =>
                  <Tr key={index}>
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
                    {entry.details.type !== 'NEW' ? (
                      <Td>
                        <S.ModalInfo type={entry.details.type}>
                          {entry.details.type}
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
          )}

          {showSuccess && (
            <EmptyStateLayout
              icon={<Icon width="6rem" height="6rem" color="success500" as={CheckCircle} />}
              content={'Your data has been imported successfully.'}
              action={
                <Button onClick={onClose} variant="tertiary">
                  {formatMessage({ id: getTrad('modal.import.close') })}
                </Button>
              }
            />
          )}

          {showNothingToImport && (
            <Typography textColor="neutral800" fontWeight="bold" as="h2">
              {formatMessage({ id: getTrad('modal.import.error.message') })}
            </Typography>
          )}
        </ModalBody>
        <ModalFooter
          startActions={showPartialSuccess && (
            <Button onClick={removeFile} variant="tertiary">
              {formatMessage({ id: getTrad('modal.import.remove') })}
            </Button>
          )}
          endActions={(
            <>
              {showPartialSuccess && (
                <Button onClick={uploadData}>
                  {formatMessage({ id: getTrad('modal.import.action') })}
                </Button>
              )}
              {showContinueButton && (
                <Button onClick={importContinue}>
                  {formatMessage({ id: getTrad('modal.import.continue') })}
                </Button>
              )}
            </>
          )}
        />
      </ModalLayout>
    </Portal >
  );
};