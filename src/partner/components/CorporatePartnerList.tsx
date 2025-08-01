import { useSuspenseQuery } from '@tanstack/react-query';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  DataTable, Hyperlink, Icon, OverlayTrigger, TextFilter, Tooltip, Truncate,
} from '@openedx/paragon';
import { Visibility } from '@openedx/paragon/icons';
import { CorporatePartner } from '@src/app/types';
import { getPartners } from '../api';
import TableFooter from '../../app/TableFooter';

import messages from '../messages';

type CellValue = {
  row: {
    original: CorporatePartner;
  }
};

const CorpotatePartnerList = () => {
  const intl = useIntl();
  const { data, isLoading } = useSuspenseQuery({
    queryKey: ['partners'],
    queryFn: () => getPartners(),
  });

  return (
    <DataTable
      isLoading={isLoading}
      isPaginated
      isFilterable
      defaultColumnValues={{ Filter: TextFilter }}
      initialState={{
        pageSize: 30,
        pageIndex: 0,
      }}
      additionalColumns={[
        {
          id: 'action',
          Header: intl.formatMessage(messages.headerAction),
          Cell: ({ row }: CellValue) => (
            <OverlayTrigger
              key="view"
              overlay={(
                <Tooltip id="tooltip-view">
                  View
                </Tooltip>
              )}
            >
              <Hyperlink destination={`/${row.original.code}/catalogs`} aria-label="view-action"><Icon src={Visibility} /></Hyperlink>
            </OverlayTrigger>
          ),
        },
      ]}
      itemCount={data.length}
      data={data}
      columns={[
        {
          Header: intl.formatMessage(messages.headerName),
          accessor: 'name',
          Cell: ({ row }: CellValue) => (
            <Hyperlink className="d-block" destination={row.original.homepage} variant="muted">
              <div className="d-flex align-items-center">
                <img alt={`${row.original.name} logo`} src={row.original.logo} style={{ maxWidth: '100px', marginRight: '8px' }} />
                <Truncate.Deprecated lines={2}>{row.original.name}</Truncate.Deprecated>
              </div>
            </Hyperlink>
          ),
        },
        {
          Header: intl.formatMessage(messages.headerCatalogs),
          accessor: 'catalogs',
        },
        {
          Header: intl.formatMessage(messages.headerCourses),
          accessor: 'courses',
        },
        {
          Header: intl.formatMessage(messages.headerEnrollments),
          accessor: 'enrollments',
        },
        {
          Header: intl.formatMessage(messages.headerAction),
          accessor: 'certified',
        },
      ]}
    >
      <DataTable.TableControlBar />
      <DataTable.Table />
      <TableFooter />
    </DataTable>
  );
};

export default CorpotatePartnerList;
