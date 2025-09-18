import { FC } from 'react';
import { useParams } from 'wouter';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  DataTable, TextFilter,
} from '@openedx/paragon';

import { usePagination } from '@src/hooks';
import TableFooter from '@src/app/TableFooter';

import messages from '../messages';
import { useCatalogCourseEnrollments } from '../hooks';

const CourseEnrollmentsList: FC<{ courseCatalogPK: number | undefined }> = ({ courseCatalogPK }) => {
  const intl = useIntl();

  const { partnerId, catalogId } = useParams();
  const { pageSize, pageIndex, onPaginationChange } = usePagination();

  const {
    enrollments, count, pageCount, isLoading,
  } = useCatalogCourseEnrollments({
    partnerId: partnerId!, catalogId: catalogId!, courseId: courseCatalogPK, pageIndex: pageIndex + 1, pageSize,
  });

  return (
    <DataTable
      isLoading={isLoading || !courseCatalogPK}
      isPaginated
      isFilterable
      defaultColumnValues={{ Filter: TextFilter }}
      fetchData={onPaginationChange}
      initialState={{
        pageSize: 30,
        pageIndex: 0,
      }}
      itemCount={count}
      pageCount={pageCount}
      data={enrollments}
      columns={[
        {
          Header: intl.formatMessage(messages.headerStudentName),
          accessor: 'user.username',
        },
        {
          Header: intl.formatMessage(messages.headerEmail),
          accessor: 'user.email',
        },
        {
          Header: intl.formatMessage(messages.headerCompletedAssessments),
          accessor: 'completedAssessments',
        },
        {
          Header: intl.formatMessage(messages.headerDueAssessments),
          accessor: 'pendingAssessments',
        },
        {
          Header: intl.formatMessage(messages.headerProgress),
          accessor: 'progress',
          Cell: ({ cell: { value } }) => `${value}%`,
        },
      ]}
    >
      <DataTable.TableControlBar />
      <DataTable.Table />
      <TableFooter />
    </DataTable>
  );
};

export default CourseEnrollmentsList;
