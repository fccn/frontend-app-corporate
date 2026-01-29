import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'corporate.catalog.table.header.action': {
    id: 'corporate.catalog.table.header.action',
    defaultMessage: 'Action',
    description: 'Header for the action column',
  },
  'corporate.catalog.table.header.name': {
    id: 'corporate.catalog.table.header.name',
    defaultMessage: 'Catalog Name',
    description: 'Header for the catalog name column',
  },
  'corporate.catalog.table.header.courses': {
    id: 'corporate.catalog.table.header.courses',
    defaultMessage: 'Courses',
    description: 'Header for the courses counter column',
  },
  'corporate.catalog.table.header.enrollments': {
    id: 'corporate.catalog.table.header.enrollments',
    defaultMessage: 'Enrollments',
    description: 'Header for the number of enrollments column',
  },
  'corporate.catalog.table.header.certified': {
    id: 'corporate.catalog.table.header.certified',
    defaultMessage: 'Certified Learners',
    description: 'Header for the number of certified students column',
  },
  'corporate.catalog.table.header.completion': {
    id: 'corporate.catalog.table.header.completion',
    defaultMessage: 'Completion Rate',
    description: 'Header for the completion rate column',
  },
  'corporate.catalog.table.empty.content': {
    id: 'corporate.catalog.table.empty.content',
    defaultMessage: 'No catalogs found',
    description: 'Empty table content for the catalog table.',
  },
});

export default messages;
