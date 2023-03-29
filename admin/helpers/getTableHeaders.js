import getTrad from './getTrad';

const getTableHeaders = (formatMessage) => [
  {
    name: 'from',
    label: formatMessage({ id: getTrad('overview.table.headers.from') })
  },
  {
    name: 'to',
    label: formatMessage({ id: getTrad('overview.table.headers.to') })
  },
  {
    name: 'type',
    label: formatMessage({ id: getTrad('overview.table.headers.type') })
  }
];

const getOverviewTableHeaders = (formatMessage) => [
  {
    name: 'id',
    label: formatMessage({ id: getTrad('overview.table.headers.id') })
  },
  ...getTableHeaders(formatMessage),
];

const getImportTableHeaders = (formatMessage) => [
  ...getTableHeaders(formatMessage),
  {
    name: 'status',
    label: formatMessage({ id: getTrad('overview.table.headers.status') })
  },
];

export { getOverviewTableHeaders, getImportTableHeaders };