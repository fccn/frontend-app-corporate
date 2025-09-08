import { useIntl } from '@edx/frontend-platform/i18n';
import {
  DataTable, Form, TextFilter,
} from '@openedx/paragon';

import { CellValue, CorporateCourse } from '@src/app/types';
import TableName from '@src/app/TableName';
import TableFooter from '@src/app/TableFooter';
import ActionItem from '@src/app/ActionItem';
import { navigate } from 'wouter/use-browser-location';

import { useCatalogCourses, useDeleteCatalogCourse } from './hooks';
import { usePagination } from '@src/hooks';
import { paths } from '@src/constants';

import messages from './messages';

interface CoursesCell extends CellValue {
  row: {
    original: CorporateCourse;
  };
}

interface CoursesListProps {
  partnerId: string;
  catalogId: string;
}

const CoursesList = ({ partnerId, catalogId }: CoursesListProps) => {
  const intl = useIntl();
  const { pageSize, pageIndex, onPaginationChange } = usePagination();
  const {
    courses,
    count,
    pageCount,
    isLoading,
  } = useCatalogCourses(partnerId, catalogId, pageIndex + 1, pageSize);
  const positions = Array.from({ length: count + 1 || 0 }, (_, i) => i);
  const deleteCatalogCourse  = useDeleteCatalogCourse();

  const tableActions = [{
    type: 'view',
    action: (partnerId, catalogId, course) => navigate(paths.courseDetail.buildPath(partnerId, catalogId, course.courseRun.id))
  },
  {
    type: 'delete',
    action: (partnerId, catalogId, course) => {
      deleteCatalogCourse({ partnerId, catalogId, courseId: course.id }); 
    }
  }];
  console.log('CoursesList render', { partnerId, catalogId, pageIndex, pageSize, count, pageCount, courses });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>, courseId: string) => {
    // TODO: Implement mutation to update position
    // updateCoursePosition(courseId, Number(e.target.value));
    console.log('Change position for', courseId, 'to', e.target.value);
  };

  return (
    <DataTable
      isLoading={isLoading}
      isSelectable
      isPaginated
      isFilterable
      manualPagination
      itemCount={count}
      pageCount={pageCount}
      fetchData={onPaginationChange}
      defaultColumnValues={{ Filter: TextFilter }}
      initialState={{
        pageSize,
        pageIndex,
      }}
      data={courses}
      additionalColumns={[
        {
          id: 'action',
          Header: intl.formatMessage(messages.headerAction),
          Cell: ({ row }: CoursesCell) => tableActions.map(({ type, action }) => (
            <ActionItem
              key={`action-${type}-${row.original.id}`}
              type={type}
              onClick={() => action(partnerId, catalogId, row.original)}
            />
          )),
        },
      ]}
      columns={[
        {
          Header: intl.formatMessage(messages.headerName),
          accessor: 'name',
          // eslint-disable-next-line react/no-unstable-nested-components
          Cell: ({ row }: CoursesCell) => (
            <TableName
              className="course-name"
              key={`description-view-${row.original.id}`}
              name={row.original.courseRun.displayName}
            />
          ),
        },
        {
          Header: intl.formatMessage(messages.headerPosition),
          accessor: 'position',
          Cell: ({ row }: CoursesCell) => (
            <Form.Control
              as="select"
              value={row.original.position}
              onChange={(e) => handleChange(e, row.original.id)}
            >
              {positions.map((pos) => (
                <option
                  key={`position-${row.original.id}-${pos}`}
                  value={pos}
                >
                  {pos}
                </option>
              ))}
            </Form.Control>
          ),
        },
        {
          Header: intl.formatMessage(messages.headerCourseDates),
          accessor: 'courseDates',
        },
        {
          Header: intl.formatMessage(messages.headerEnrollmentDates),
          accessor: 'enrollmentDates',
        },
        {
          Header: intl.formatMessage(messages.headerEnrollment),
          accessor: 'enrollments',
        },
        {
          Header: intl.formatMessage(messages.headerCertified),
          accessor: 'certified',
        },
        {
          Header: intl.formatMessage(messages.headerCompletion),
          accessor: 'completionRate',
        },
      ]}
    >
      <DataTable.TableControlBar />
      <DataTable.Table />
      <TableFooter />
    </DataTable>
  );
};

export default CoursesList;
