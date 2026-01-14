import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, DataTable, TextFilter } from '@openedx/paragon';
import { SaveAlt } from '@openedx/paragon/icons';

import { TableFooter } from '@src/components/Table/';
import { usePagination } from '@src/hooks';

import { useCourseLearnersStatus } from '../data/hooks';

import messages from '../messages';

const LearnerName = ({ row }) => (
  <span>{row.original.user.fullName}</span>
);

const LearnerEmail = ({ row }) => (
  <span>{row.original.user.email}</span>
);

const TableAction = () => {
  const intl = useIntl();

  return (
    <Button iconBefore={SaveAlt} size="sm">
      {intl.formatMessage(messages['corporate.courses.table.action.download.report'])}
    </Button>
  );
};

const CourseLernerList = ({ catalogId, courseId }) => {
  const intl = useIntl();

  const { pageIndex, pageSize, onPaginationChange } = usePagination();

  const {
    data: { results, count, pageCount },
    isLoading,
  } = useCourseLearnersStatus(catalogId, courseId, pageIndex + 1, pageSize);

  return (
    <DataTable
      isLoading={isLoading}
      isPaginated
      isFilterable
      defaultColumnValues={{ Filter: TextFilter }}
      initialState={{
        pageSize,
        pageIndex,
      }}
      manualPagination
      fetchData={onPaginationChange}
      pageCount={pageCount || 0}
      tableActions={[
        <TableAction />,
      ]}
      itemCount={count || 0}
      data={results || []}
      columns={[
        {
          Header: intl.formatMessage(messages['corporate.course.learners.table.header.name']),
          accessor: 'fullName',
          Cell: LearnerName,
        },
        {
          Header: intl.formatMessage(messages['corporate.course.learners.table.header.email']),
          accessor: 'email',
          Cell: LearnerEmail,
        },
        {
          Header: intl.formatMessage(messages['corporate.course.learners.table.header.completed.assessments']),
          accessor: 'completedAssessments',
          Cell: ({ row }) => row.original.completedAssessments,
        },
        {
          Header: intl.formatMessage(messages['corporate.course.learners.table.header.assessments.to.complete']),
          accessor: 'assessmentsToComplete',
          Cell: ({ row }) => row.original.assessmentsToComplete,
        },
        {
          Header: intl.formatMessage(messages['corporate.course.learners.table.header.progress']),
          accessor: 'progress',
          Cell: ({ row }) => `${row.original.progress}%`,
        },
        {
          Header: intl.formatMessage(messages['corporate.course.learners.table.header.certificate']),
          accessor: 'hasCertificate',
          Cell: ({ row }) => (row.original.hasCertificate ? 'Yes' : 'No'),
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
