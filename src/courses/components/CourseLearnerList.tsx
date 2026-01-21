import { useMemo } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, DataTable, TextFilter } from '@openedx/paragon';
import { SaveAlt } from '@openedx/paragon/icons';

import { FilterStatus, LearnerEmail, LearnerName, SearchFilter, TableFooter } from '@src/components/Table/';
import { usePagination, useTableSortFilter } from '@src/hooks';

import { useCourseLearnersStatus } from '../data/hooks';

import messages from '../messages';

const TableAction = () => {
  const intl = useIntl();

  return (
    <Button iconBefore={SaveAlt} size="sm">
      {intl.formatMessage(messages['corporate.courses.table.action.download.report'])}
    </Button>
  );
};

const searchIds = ['fullName', 'email'];
const filterMappings = searchIds.reduce((prev, curr) => ({
  ...prev, [curr]: 'search',
}), {});

const CourseLernerList = ({ catalogId, courseId }) => {
  const intl = useIntl();

  const { pageIndex, pageSize, onPaginationChange } = usePagination();
  const tableConfig = useMemo(() => ({
    filterMappings,
    onPaginationChange,
  }), [onPaginationChange]);

  const { ordering, searchParams, fetchData } = useTableSortFilter(tableConfig);    

  const {
    data: { results, count, pageCount },
    isLoading,
  } = useCourseLearnersStatus(catalogId, courseId, pageIndex + 1, pageSize, ordering, searchParams.search);

  return (
    <DataTable
      isLoading={isLoading}
      isPaginated
      isFilterable
      manualFilters
      defaultColumnValues={{ disableFilters: true }}
      FilterStatusComponent={FilterStatus}
      initialState={{
        pageSize,
        pageIndex,
      }}
      manualPagination
      fetchData={fetchData}
      pageCount={pageCount}
      tableActions={[
        <TableAction />,
      ]}
      itemCount={count}
      data={results}
      columns={[
        {
          Header: intl.formatMessage(messages['corporate.course.learners.table.header.name']),
          accessor: 'fullName',
          disableFilters: false,
          Cell: LearnerName,
          Filter: SearchFilter,
          meta: {
            searchIds,
          },
        },
        {
          Header: intl.formatMessage(messages['corporate.course.learners.table.header.email']),
          accessor: 'email',
          Cell: LearnerEmail,
        },
        {
          Header: intl.formatMessage(messages['corporate.course.learners.table.header.progress']),
          accessor: 'progress',
          Cell: ({ row }) => `${row.original.progress}%`,
        },
        {
          Header: intl.formatMessage(messages['corporate.course.learners.table.header.certificate']),
          accessor: 'hasCertificate',
          Cell: ({ row }) => (row.original.hasCertificate
            ? intl.formatMessage(messages['corporate.course.learners.table.certificate.yes'])
            : intl.formatMessage(messages['corporate.course.learners.table.certificate.no'])
          ),
        },
      ]}
    >
      <DataTable.TableControlBar />
      <DataTable.Table />
      <DataTable.EmptyTable content={intl.formatMessage(messages['corporate.course.learners.table.empty.content'])} />
      <TableFooter />
    </DataTable>
  );
};

export default CourseLernerList;
