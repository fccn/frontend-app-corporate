import { useState, useMemo } from 'react';
import { useParams } from 'wouter';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button,
  DataTable, Form, TextFilter,
  useToggle,
} from '@openedx/paragon';

import { CellValue, Course } from '@src/types';
import { ActionItem, TableFooter } from '@src/components/Table';

import { useNavigate, usePagination, useTableSortFilter } from '@src/hooks';

import { paths } from '@src/constants';
import { Add, SaveAlt } from '@openedx/paragon/icons';
import CourseAddModal from '@src/courses/components/CourseAddModal';
import { useCatalogCourses, useUpdateCatalogCourse } from '../data/hooks';
import CourseDeleteModal from './CourseDeleteModal';

import messages from '../messages';

type CoursesCell = CellValue<Course>;

interface CoursesListProps {
  catalogId?: string;
  catalogName?: string;
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

const BulkAction = ({ selectedFlatRows, setRowsForDelete, openDeleteModal }) => {
  const intl = useIntl();
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
const CoursesList = ({ catalogId, catalogName }: CoursesListProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { partnerSlug, catalogSlug } = useParams<{ partnerSlug: string, catalogSlug: string }>();
  const [isdeleteModalOpen, openDeleteModal, closeDeleteModal] = useToggle(false);
  const [selectedRowsForDelete, setSelectedRowsForDelete] = useState<any[]>([]);
  const { pageSize, pageIndex, onPaginationChange } = usePagination();
  const tableConfig = useMemo(() => ({
    sortFields: ['position'],
    filterMappings: { name: 'search' },
    onPaginationChange,
  }), [onPaginationChange]);
  const { ordering, searchParams, fetchData } = useTableSortFilter(tableConfig);
  const {
    courses,
    count,
    pageCount,
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
      openDeleteModal();
    },
  }];

  const handleChange = (courseId: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    updateCatalogCourse({ catalogId: catalogId!, courseId, data: { position: Number(e.target.value) } });
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
        defaultColumnValues={{ Filter: TextFilter }}
        initialState={{
          pageSize,
          pageIndex,
          sortBy: [],
          filters: [],
        }}
        fetchData={fetchData}
        itemCount={count}
        pageCount={pageCount || 0}
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
            disableSortBy: true,
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
                onChange={(e) => handleChange(row.original.courseRun.id, e)}
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
            disableSortBy: true,
            Cell: ({ row }: CoursesCell) => {
              const { start, end } = row.original.courseRun;
              return `${formatDate(start)} - ${formatDate(end)}`;
            },
          },
          {
            Header: intl.formatMessage(messages['corporate.courses.table.header.enrollment.dates']),
            accessor: 'enrollmentDates',
            disableSortBy: true,
            Cell: ({ row }: CoursesCell) => {
              const { enrollmentStart, enrollmentEnd } = row.original.courseRun;
              return `${formatDate(enrollmentStart)} - ${formatDate(enrollmentEnd)}`;
            },
          },
          {
            Header: intl.formatMessage(messages['corporate.courses.table.header.enrollment']),
            accessor: 'enrollments',
            disableSortBy: true,
          },
          {
            Header: intl.formatMessage(messages['corporate.courses.table.header.certified']),
            accessor: 'certified',
            disableSortBy: true,
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
        <TableFooter />
      </DataTable>
      <CourseDeleteModal
        isOpen={isdeleteModalOpen}
        onClose={() => { closeDeleteModal(); setSelectedRowsForDelete([]); }}
        selectedCourses={selectedRowsForDelete}
        catalogId={catalogId!}
        catalogName={catalogName}
      />
    </>
  );
};

export default CoursesList;
