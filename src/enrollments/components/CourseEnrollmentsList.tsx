import { useSuspenseQuery } from '@tanstack/react-query';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  DataTable, TextFilter,
} from '@openedx/paragon';

import { useParams } from 'wouter';
import { getCourseEnrollments } from '../api';
import TableFooter from '../../app/TableFooter';

import messages from '../messages';

const CourseEnrollmentsList = () => {
  const intl = useIntl();

  const { partnerId, catalogId, courseId } = useParams();

  const { data, isLoading } = useSuspenseQuery({
    queryKey: ['courseLearners'],
    queryFn: () => getCourseEnrollments(partnerId!, catalogId!, courseId!, 1, 10),
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
      itemCount={data.count}
      data={data.results}
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
