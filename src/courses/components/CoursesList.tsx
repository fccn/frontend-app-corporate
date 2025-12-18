import { useIntl } from '@edx/frontend-platform/i18n';
import {
  DataTable, Form, TextFilter,
} from '@openedx/paragon';

import { CellValue, Course } from '@src/types';
import { ActionItem, TableFooter } from '@src/components/Table';

import { useNavigate, usePagination } from '@src/hooks';

import { paths } from '@src/constants';
import { useParams } from 'wouter';
import { useCatalogCourses, useDeleteCatalogCourse } from '../data/hooks';

import messages from '../messages';

type CoursesCell = CellValue<Course>;

interface CoursesListProps {
  partnerId: number;
  catalogId?: string;
}

const CourseNameCell = ({ row }: CoursesCell) => (
  <div className="text-left">
    <span className="d-block font-weight-bold truncate-1-line">
      {row.original.courseRun.displayName}
    </span>
    <span className="small text-muted  truncate-1-line">
      {row.original.courseRun.id}
    </span>
  </div>
);

const CoursesList = ({ partnerId, catalogId }: CoursesListProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { partnerSlug, catalogSlug } = useParams<{ partnerSlug: string, catalogSlug: string }>();

  const { pageSize, pageIndex, onPaginationChange } = usePagination();
  const {
    courses,
    count,
    pageCount,
    isLoading,
  } = useCatalogCourses(partnerId, catalogId!, pageIndex + 1, pageSize);
  const deleteCatalogCourse = useDeleteCatalogCourse();

  const positions = Array.from({ length: count + 1 || 0 }, (_, i) => i);
  const formatDate = (date: string | null) => {
    if (!date) { return ''; }
    return intl.formatDate(date);
  };

  const tableActions = [{
    type: 'view',
    action: (course) => navigate(paths.courseDetail.buildPath(partnerSlug, catalogSlug, course.courseRun.id)),
  },
  {
    type: 'delete',
    action: (course) => {
      deleteCatalogCourse({ partnerId, catalogId: catalogId!, courseId: course.id });
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
      isSortable
      manualPagination
      itemCount={count}
      pageCount={pageCount || 0}
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
          Header: intl.formatMessage(messages['corporate.courses.table.header.action']),
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
          Header: intl.formatMessage(messages['corporate.courses.table.header.name']),
          accessor: 'name',
          // eslint-disable-next-line react/no-unstable-nested-components
          Cell: CourseNameCell,
        },
        {
          Header: intl.formatMessage(messages['corporate.courses.table.header.position']),
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
          Header: intl.formatMessage(messages['corporate.courses.table.header.course.dates']),
          accessor: 'courseDates',
          // eslint-disable-next-line react/no-unstable-nested-components
          Cell: ({ row }: CoursesCell) => {
            const { start, end } = row.original.courseRun;
            return `${formatDate(start)} - ${formatDate(end)}`;
          },
        },
        {
          Header: intl.formatMessage(messages['corporate.courses.table.header.enrollment.dates']),
          accessor: 'enrollmentDates',
          // eslint-disable-next-line react/no-unstable-nested-components
          Cell: ({ row }: CoursesCell) => {
            const { enrollmentStart, enrollmentEnd } = row.original.courseRun;
            return `${formatDate(enrollmentStart)} - ${formatDate(enrollmentEnd)}`;
          },
        },
        {
          Header: intl.formatMessage(messages['corporate.courses.table.header.enrollment']),
          accessor: 'enrollments',
        },
        {
          Header: intl.formatMessage(messages['corporate.courses.table.header.certified']),
          accessor: 'certified',
        },
        {
          Header: intl.formatMessage(messages['corporate.courses.table.header.completion']),
          accessor: 'completionRate',
          Cell: ({ row }: CoursesCell) => `${row.original.completionRate}%`,
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
