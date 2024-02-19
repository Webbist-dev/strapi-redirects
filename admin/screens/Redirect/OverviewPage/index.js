import * as qs from 'qs';
import React, { useEffect, useState, memo } from 'react';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';

import { useFetchClient, EmptyBodyTable, PaginationURLQuery, PageSizeURLQuery } from '@strapi/helper-plugin';
import {
  Box,
  Table,
  Tbody,
  Tr,
  Td,
  Typography,
  Button,
  Flex,
  Icon,
  IconButton,
  BaseHeaderLayout,
  Searchbar
} from '@strapi/design-system';
import { ChevronUp, ChevronDown, Plus, Pencil, Trash } from '@strapi/icons';

import { TableHead } from '../../../components/TableHead';
import { InjectedImportButton } from '../../../components/InjectedImportButton';

import { usePrevious } from '../../../hooks/usePrevious';
import { useDebounce } from '../../../hooks/useDebounce';
import { useSearchQuery } from '../../../hooks/useSearchQuery';

import S from '../../../helpers/styles';

import pluginId from '../../../helpers/pluginId';
import getTrad from '../../../helpers/getTrad';

const RedirectOverviewPage = () => {
  const { get, del } = useFetchClient();
  const history = useHistory();
  const { pageSize, page, setNewPage } = useSearchQuery();
  const { formatMessage } = useIntl();
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('desc');
  const [redirects, setRedirects] = useState([]);
  const [totalNumberOfRedirects, setTotalNumberOfRedirects] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const debouncedSearchValue = useDebounce(searchValue, 300);
  const prevDebouncedSearchValue = usePrevious(debouncedSearchValue);
  const tableHeaders = [
    {
      name: 'id',
      label: formatMessage({ id: getTrad('overview.table.headers.id') }),
    },
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
    }
  ];
  const pageCount = Math.ceil(totalNumberOfRedirects / pageSize);

  const handleRowClick = (id) => {
    history.push(`/plugins/${pluginId}/${id}`);
  };

  const getRedirects = async (newPage) => {
    try {
      setIsLoading(true);

      const query = qs.stringify(
        {
          sort: [`${sortBy}:${sortOrder}`],
          pagination: {
            pageSize,
            page: newPage
          },
          filters: {
            $or: [
              { from: { $contains: searchValue } },
              { to: { $contains: searchValue } }
            ]
          }
        },
        {
          encodeValuesOnly: true
        }
      );

      const { data } = await get(`/${pluginId}?${query}`);

      setRedirects(data.redirects);
      setTotalNumberOfRedirects(data.total);
      setIsLoading(false);
    } catch (error) {
      setRedirects([]);
      setTotalNumberOfRedirects(0);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshRedirects = () => {
    getRedirects(page);
  };

  useEffect(() => {
    getRedirects(page);
  }, [page, sortOrder, pageSize]);

  useEffect(() => {
    if (prevDebouncedSearchValue !== null) {
      setNewPage(1);
      getRedirects(1);
    }
  }, [debouncedSearchValue]);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const handleDeleteRedirect = async (id) => {
    try {
      await del(`/${pluginId}/${id}`);
      await getRedirects(1);
    } catch (error) {
      setRedirects([]);
      setTotalNumberOfRedirects(0);
      setIsLoading(false);
    }
  };

  const handleNewRedirect = () => {
    history.push(`/plugins/${pluginId}/new`);
  };

  const handleSort = (sortBy) => {
    setSortBy(sortBy);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const subtitleMessageId = totalNumberOfRedirects === 1 ? 'overview.header.subtitle.singular' : 'overview.header.subtitle.plural';

  return (
    <Box>
      <BaseHeaderLayout
        p={0}
        primaryAction={
          <Button startIcon={<Plus />} onClick={handleNewRedirect}>
            {formatMessage({ id: getTrad('overview.header.addButton.title') })}
          </Button>
        }
        title={formatMessage({ id: getTrad('overview.header.title') })}
        subtitle={formatMessage(
          { id: getTrad(subtitleMessageId) },
          { amount: totalNumberOfRedirects }
        )}
        as="h2"
      />

      <Flex paddingLeft={10} paddingRight={10} marginBottom={6} gap={2} justifyContent="space-between">
        <Flex gap={2}>
          <Searchbar
            name="_q"
            value={searchValue}
            onChange={handleSearch}
            placeholder={formatMessage({ id: getTrad('overview.search.placeholder') })}
            onClear={() => setSearchValue('')}
            clearLabel={formatMessage({ id: getTrad('overview.search.clearLabel') })}
            size="S"
          >
            {formatMessage({ id: getTrad('overview.search.label') })}
          </Searchbar>

          <InjectedImportButton onImportClose={refreshRedirects} />
        </Flex>
      </Flex>

      <Flex
        paddingLeft={10}
        paddingRight={10}
        marginBottom={10}
        direction="column"
        alignItems="flex-start"
        gap={6}
      >
        <S.SelectHelp type="button" onClick={() => setIsOpen(!isOpen)}>
          {formatMessage({ id: getTrad('overview.help.title') })}
          <Icon width={3} height={3} as={isOpen ? ChevronUp : ChevronDown} />
        </S.SelectHelp>
        {isOpen && (
          <S.InfoBox hasRadius padding={4} marginTop={4} background="#fff">
            <S.InfoItem>
              <Typography textColor="neutral800" fontWeight="bold" as="h4" marginBottom={2}>
                {formatMessage({ id: getTrad('overview.help.instructions') })}
              </Typography>

              <ul>
                <li>
                  {formatMessage(
                    { id: getTrad('overview.help.from') },
                    { strong: (chunks) => <strong>{chunks}</strong> }
                  )}
                </li>
                <li>
                  {formatMessage(
                    { id: getTrad('overview.help.to') },
                    { strong: (chunks) => <strong>{chunks}</strong> }
                  )}
                </li>
                <li>
                  {formatMessage(
                    { id: getTrad('overview.help.type') },
                    { strong: (chunks) => <strong>{chunks}</strong> }
                  )}
                </li>
              </ul>
            </S.InfoItem>
          </S.InfoBox>
        )}
      </Flex>

      <Flex
        paddingLeft={10}
        paddingRight={10}
        direction="column"
        alignItems="stretch"
        gap={6}
      >
        <Table
          colCount={tableHeaders.length}
          rowCount={pageSize}
        >
          <TableHead
            headers={tableHeaders}
            handleSort={handleSort}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
          {redirects.length > 0 ? (
            <Tbody>
              {redirects.map((entry) => (
                <Tr key={entry.id}>
                  <Td>
                    <Typography textColor="neutral800">{entry.id}</Typography>
                  </Td>
                  <Td>
                    <Typography textColor="neutral800" ellipsis style={{ maxWidth: '400px' }}>
                      {entry.from}
                    </Typography>
                  </Td>
                  <Td>
                    <Typography textColor="neutral800" ellipsis style={{ maxWidth: '400px' }}>
                      {entry.to}
                    </Typography>
                  </Td>
                  <Td>
                    <Typography textColor="neutral800">
                      {formatMessage({
                        id: getTrad(`detail.form.type.value.${entry.type}`)
                      })}
                    </Typography>
                  </Td>
                  <Td>
                    <Flex justifyContent="end">
                      <IconButton
                        onClick={() => handleRowClick(entry.id)}
                        label={formatMessage({ id: getTrad('overview.table.actions.edit.label') })}
                        noBorder
                        icon={<Pencil />}
                      />
                      <IconButton
                        onClick={() => handleDeleteRedirect(entry.id)}
                        label={formatMessage({ id: getTrad('overview.table.actions.delete.label') })}
                        noBorder
                        icon={<Trash />}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          ) : (
            <EmptyBodyTable
              colSpan={tableHeaders.length}
              content={{
                id: getTrad('overview.table.empty.message')
              }}
              isLoading={isLoading}
              action={
                <Button variant="secondary" startIcon={<Plus />} onClick={handleNewRedirect}>
                  {formatMessage({
                    id: getTrad('overview.table.empty.button.title')
                  })}
                </Button>
              }
            />
          )}
        </Table>

        <Flex justifyContent="space-between">
          <PageSizeURLQuery />
          {redirects.length > 0 && <PaginationURLQuery pagination={{ pageCount, currentPage: page }} />}
        </Flex>
      </Flex>
    </Box>
  );
};

export default memo(RedirectOverviewPage);