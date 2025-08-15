import { useIntl } from '@edx/frontend-platform/i18n';
import {
  DataTable, TextFilter,
} from '@openedx/paragon';

import { CellValue, CorporateCourse } from '@src/app/types';
import { navigate } from 'wouter/use-browser-location';
import TableName from '@src/app/TableName';
import TableFooter from '@src/app/TableFooter';
import ActionItem from '@src/app/ActionItem';

import messages from './messages';
import { useCatalogCourses } from './apiHooks';


interface CoursesDataCell extends CellValue {
  row: {
    original: CorporateCourse;
  }
}
const tableActions = ['view', 'delete'];
const mockData: CorporateCourse[] =  [
  {
    "courseId": "CC101",
    "name": "Effective Communication in the Workplace",
    "link": "https://corporatetraining.com/courses/cc101",
    "logo": "https://via.placeholder.com/150",
    "enrollments": 1200,
    "certified": 950,
    "completionRate": 79.2,
    "position": 1,
    "courseDates": "2023-01-15 to 2023-02-15",
    "enrollmentDates": "2023-01-01 to 2023-01-14"
  },
  {
    "courseId": "CC102",
    "name": "Project Management Fundamentals",
    "link": "https://corporatetraining.com/courses/cc102",
    "logo": "https://via.placeholder.com/150",
    "enrollments": 870,
    "certified": 720,
    "completionRate": 82.7,
    "position": 2,
    "courseDates": "2023-02-01 to 2023-03-01",
    "enrollmentDates": "2023-01-15 to 2023-01-31"
  },
  {
    "courseId": "CC103",
    "name": "Cybersecurity Essentials for Employees",
    "link": "https://corporatetraining.com/courses/cc103",
    "logo": "https://via.placeholder.com/150",
    "enrollments": 1500,
    "certified": 1300,
    "completionRate": 86.7,
    "position": 3,
    "courseDates": "2023-03-01 to 2023-04-01",
    "enrollmentDates": "2023-02-15 to 2023-02-28"
  },
  {
    "courseId": "CC104",
    "name": "Diversity and Inclusion Training",
    "link": "https://corporatetraining.com/courses/cc104",
    "logo": "https://via.placeholder.com/150",
    "enrollments": 980,
    "certified": 840,
    "completionRate": 85.7,
    "position": 4,
    "courseDates": "2023-04-01 to 2023-05-01",
    "enrollmentDates": "2023-03-15 to 2023-03-31"
  },
  {
    "courseId": "CC105",
    "name": "Time Management for Professionals",
    "link": "https://corporatetraining.com/courses/cc105",
    "logo": "https://via.placeholder.com/150",
    "enrollments": 1100,
    "certified": 960,
    "completionRate": 87.3,
    "position": 5,
    "courseDates": "2023-05-01 to 2023-06-01",
    "enrollmentDates": "2023-04-15 to 2023-04-30"
  }
]

const CoursesList = ({catalogId}) => {
  const intl = useIntl();
  const {
    data= mockData,
    isLoading,
    isError,
    error,
  } = useCatalogCourses(catalogId);
  // const data = mockData; // For testing purposes, replace with actual data fetching
  console.debug('CoursesList data', data);
  return (
    <DataTable
    isSelectable
      isPaginated
      isFilterable
      defaultColumnValues={{ Filter: TextFilter }}
      initialState={{
        pageSize: 30,
        pageIndex: 0,
      }}
      additionalColumns={[
        {
          id: 'action',
          Header: intl.formatMessage(messages.headerAction),
          Cell: ({ row }: CoursesDataCell) => tableActions.map((type) => (
            <ActionItem
              key={`action-${type}-${row.original.courseId}`}
              type={type}
              onClick={() => navigate(`/courses/${row.original.courseId}/`)}
            />
          )),
        },
      ]}
      itemCount={data?.length || 0}
      data={data}
      columns={[
        {
          Header: intl.formatMessage(messages.headerName),
          accessor: 'name',
          // eslint-disable-next-line react/no-unstable-nested-components
          Cell: ({ row }: CoursesDataCell) => (
            <TableName
              className="course-name"
              key={`description-view-${row.original.courseId}`}
              name={row.original.name}
            />
          ),
        },
        {
          Header: intl.formatMessage(messages.headerPosition),
          accessor: 'position',
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
