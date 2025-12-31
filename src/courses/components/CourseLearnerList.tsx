import { useIntl } from '@edx/frontend-platform/i18n';
import { DataTable, TextFilter } from '@openedx/paragon';

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

// const TableAction = ({ catalogId }: { catalogId: string }) => {
//   const intl = useIntl();
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   return (
//     <>
//       <Button iconBefore={Add} size="sm" onClick={() => setIsModalOpen(true)}>
//         {intl.formatMessage(messages['corporate.courses.table.action.add.course'])}
//       </Button>
//       <Button iconBefore={SaveAlt} size="sm">
//         {intl.formatMessage(messages['corporate.courses.table.action.download.report'])}
//       </Button>
//       <CourseAddModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         catalogId={catalogId!}
//       />
//     </>
//   );
// };

const CourseLernerList = ({ catalogId, courseId }) => {
  const intl = useIntl();

  const { pageIndex, pageSize, onPaginationChange } = usePagination();

  const { data, isLoading } = useCourseLearnersStatus(catalogId, courseId, pageIndex + 1, pageSize);

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
      pageCount={data?.numPages || 0}
      // tableActions={[
      //   <TableAction catalogId={catalogId!} />,
      // ]}
      itemCount={data?.count || 0}
      data={data?.results || []}
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
