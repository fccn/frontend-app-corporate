import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  headerAction: {
    id: 'corporate.partner.table.header.action',
    defaultMessage: 'Action',
    description: 'Header for the action column',
  },
  headerName: {
    id: 'corporate.catalog.table.header.name',
    defaultMessage: 'Catalog Name',
    description: 'Header for the catalog name column',
  },
  headerCourses: {
    id: 'corporate.catalog.table.header.courses',
    defaultMessage: 'Courses',
    description: 'Header for the courses counter column',
  },
  headerEnrollments: {
    id: 'corporate.catalog.table.header.enrollments',
    defaultMessage: 'Enrollments',
    description: 'Header for the number of enrollments column',
  },
  headerCertified: {
    id: 'corporate.catalog.table.header.certified',
    defaultMessage: 'Certified Learners',
    description: 'Header for the number of certified students column',
  },
  headerCompletion: {
    id: 'corporate.catalog.table.header.completion',
    defaultMessage: 'Completion Rate',
    description: 'Header for the completion rate column',
  },
});

export default messages;
