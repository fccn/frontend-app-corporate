import { useIntl } from '@edx/frontend-platform/i18n';
import {
  DataTable, Form, TextFilter,
} from '@openedx/paragon';

import { CellValue, CorporateCourse } from '@src/app/types';
import TableName from '@src/app/TableName';
import TableFooter from '@src/app/TableFooter';
import ActionItem from '@src/app/ActionItem';
import { useNavigate, usePagination } from '@src/hooks';

import { paths } from '@src/constants';
import { useCatalogCourses, useDeleteCatalogCourse } from '../hooks';

import messages from '../messages';

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
  const navigate = useNavigate();
  const { pageSize, pageIndex, onPaginationChange } = usePagination();
  const {
    courses,
    count,
    pageCount,
    isLoading,
  } = useCatalogCourses(partnerId, catalogId, pageIndex + 1, pageSize);
  const positions = Array.from({ length: count + 1 || 0 }, (_, i) => i);
  const deleteCatalogCourse = useDeleteCatalogCourse();

  const tableActions = [{
    type: 'view',
    action: (course) => navigate(paths.courseDetail.buildPath(partnerId, catalogId, course.courseRun.id)),
  },
  {
    type: 'delete',
    action: (course) => {
      deleteCatalogCourse({ partnerId, catalogId, courseId: course.id });
    },
  }];

  const handleChange = () => {
    // TODO: Implement mutation to update position
    // updateCourse(courseId, Number(e.target.value));
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
              onClick={() => action(row.original)}
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
          // eslint-disable-next-line react/no-unstable-nested-components
          Cell: ({ row }: CoursesCell) => (
            <Form.Control
              as="select"
              value={row.original.position}
              onChange={() => handleChange()}
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
