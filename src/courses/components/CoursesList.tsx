import { useState, useMemo } from 'react';
import { useParams } from 'wouter';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button, DataTable, Form, useToggle,
} from '@openedx/paragon';

import { CellValue, Course } from '@src/types';
import { ActionItem, SearchFilter, TableFooter } from '@src/components/Table';

import { useNavigate, usePagination, useTableSortFilter } from '@src/hooks';

import { paths } from '@src/constants';
import { Add, SaveAlt } from '@openedx/paragon/icons';
import CourseAddModal from '@src/courses/components/CourseAddModal';
import { useNotification } from '@src/components/NotificationProvider';
import { useCatalogCourses, useUpdateCatalogCourse } from '../data/hooks';
import CourseDeleteModal from './CourseDeleteModal';

import messages from '../messages';

type CoursesCell = CellValue<Course>;

interface CoursesListProps {
  catalogId: string;
  catalogName: string;
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

const TableAction = ({ catalogId }: { catalogId: string }) => {
  const intl = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button iconBefore={Add} size="sm" onClick={() => setIsModalOpen(true)}>
        {intl.formatMessage(messages['corporate.courses.table.action.add.course'])}
      </Button>
      <Button iconBefore={SaveAlt} size="sm">
        {intl.formatMessage(messages['corporate.courses.table.action.download.report'])}
      </Button>
      <CourseAddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        catalogId={catalogId!}
      />
    </>
  );
};

type BulkActionProps = {
  selectedFlatRows?: any[];
  setRowsForDelete: (rows: any[]) => void;
  openDeleteModal: () => void;
};
const BulkAction = ({ selectedFlatRows, setRowsForDelete, openDeleteModal }: BulkActionProps) => {
  const intl = useIntl();
  if (!selectedFlatRows?.length) { return null; }
  return (
    <Button
      variant="outline-danger"
      size="sm"
      onClick={() => {
        setRowsForDelete(selectedFlatRows.map((row) => row.original.id));
        openDeleteModal();
      }}
    >
      {intl.formatMessage(messages['corporate.courses.table.action.delete.selected'])}
    </Button>
  );
};

const searchIds = ['name'];
const filterMappings = searchIds.reduce((prev, curr) => ({
  ...prev, [curr]: 'search',
}), {});

const sortMappings = {
  position: 'position',
  courseDates: { asc: 'course_start', desc: 'course_end' },
  enrollmentDates: { asc: 'enrollment_start', desc: 'enrollment_end' },
  enrollments: 'enrollments',
  certified: 'certified',
};

const CoursesList = ({ catalogId, catalogName }: CoursesListProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { partnerSlug, catalogSlug } = useParams<{ partnerSlug: string, catalogSlug: string }>();
  const { showNotification } = useNotification();

  const [isdeleteModalOpen, openDeleteModal, closeDeleteModal] = useToggle(false);
  const [selectedRowsForDelete, setSelectedRowsForDelete] = useState<string[]>([]);
  const [courseNameForDelete, setCourseNameForDelete] = useState<string>('');

  const { pageSize, pageIndex, onPaginationChange } = usePagination();

  const tableConfig = useMemo(() => ({
    sortMappings,
    filterMappings,
    onPaginationChange,
  }), [onPaginationChange]);

  const { ordering, searchParams, fetchData } = useTableSortFilter(tableConfig);
  const {
    data: { courses, count, pageCount },
    isLoading,
  } = useCatalogCourses(catalogId!, pageIndex + 1, pageSize, ordering, searchParams.search);

  const updateCatalogCourse = useUpdateCatalogCourse();

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
      setSelectedRowsForDelete([course.id]);
      setCourseNameForDelete(course.courseRun.displayName);
      openDeleteModal();
    },
  }];

  const handleChange = (courseId: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    updateCatalogCourse.mutate(
      { catalogId: catalogId!, courseId, data: { position: Number(e.target.value) } },
      {
        onSuccess: () => {
          showNotification(
            intl.formatMessage(messages['corporate.courses.notification.position.update.success']),
            'success',
          );
        },
        onError: () => {
          showNotification(
            intl.formatMessage(messages['corporate.courses.notification.position.update.error']),
            'error',
          );
        },
      },
    );
  };

  return (
    <>
      <DataTable
        isLoading={isLoading}
        isSelectable
        isPaginated
        isFilterable
        isSortable
        manualPagination
        manualSortBy
        manualFilters
        defaultColumnValues={{ disableFilters: true }}
        initialState={{
          pageSize,
          pageIndex,
        }}
        fetchData={fetchData}
        itemCount={count}
        pageCount={pageCount}
        data={courses}
        tableActions={[
          <TableAction catalogId={catalogId!} />,
        ]}
        bulkActions={[
          <BulkAction setRowsForDelete={setSelectedRowsForDelete} openDeleteModal={openDeleteModal} />,
        ]}
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
            disableFilters: false,
            disableSortBy: true,
            Cell: CourseNameCell,
            Filter: SearchFilter,
            meta: {
              searchIds,
            },
          },
          {
            Header: intl.formatMessage(messages['corporate.courses.table.header.position']),
            accessor: 'position',
            // eslint-disable-next-line react/no-unstable-nested-components
            Cell: ({ row }: CoursesCell) => (
              <Form.Control
                as="select"
                value={row.original.position}
                onChange={(e) => handleChange(row.original.courseRun.id, e)}
                aria-label={intl.formatMessage(messages['corporate.courses.table.header.position'])}
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
            Cell: ({ row }: CoursesCell) => {
              const { start, end } = row.original.courseRun;
              return `${formatDate(start)} - ${formatDate(end)}`;
            },
          },
          {
            Header: intl.formatMessage(messages['corporate.courses.table.header.enrollment.dates']),
            accessor: 'enrollmentDates',
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
            disableSortBy: true,
            Cell: ({ row }: CoursesCell) => `${row.original.completionRate}%`,
          },
        ]}
      >
        <DataTable.TableControlBar />
        <DataTable.Table />
        <DataTable.EmptyTable content={intl.formatMessage(messages['corporate.courses.table.empty.content'])} />
        <TableFooter />
      </DataTable>
      <CourseDeleteModal
        isOpen={isdeleteModalOpen}
        onClose={() => { closeDeleteModal(); setSelectedRowsForDelete([]); setCourseNameForDelete(''); }}
        selectedCourses={selectedRowsForDelete}
        catalogId={catalogId!}
        catalogName={catalogName}
        courseName={courseNameForDelete}
      />
    </>
  );
};

export default CoursesList;
