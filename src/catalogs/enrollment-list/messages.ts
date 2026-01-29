import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'corporate.catalog.enrollments.table.header.name': {
    id: 'corporate.catalog.enrollments.table.header.name',
    defaultMessage: 'Learner Username/Name',
    description: 'Header for the learner name column',
  },
  'corporate.catalog.enrollments.table.header.email': {
    id: 'corporate.catalog.enrollments.table.header.email',
    defaultMessage: 'Invite Email',
    description: 'Header for the learner email column',
  },
  'corporate.catalog.enrollments.table.header.status': {
    id: 'corporate.catalog.enrollments.table.header.status',
    defaultMessage: 'Status',
    description: 'Header for the learner status column',
  },
  'corporate.catalog.enrollments.table.header.last.login': {
    id: 'corporate.catalog.enrollments.table.header.last.login',
    defaultMessage: 'Last Login Date',
    description: 'Header for the last login date column',
  },
  'corporate.catalog.enrollments.table.header.course': {
    id: 'corporate.catalog.enrollments.table.header.course',
    defaultMessage: 'Course',
    description: 'Header for the course header',
  },
  'corporate.catalog.enrollments.table.header.progress': {
    id: 'corporate.catalog.enrollments.table.header.progress',
    defaultMessage: 'Progress',
    description: 'Header for the progress column in the enrollments table',
  },
  'corporate.catalog.enrollments.table.header.hasCertificate': {
    id: 'corporate.catalog.enrollments.table.header.hasCertificate',
    defaultMessage: 'Has Certificate',
    description: 'Header for the has certificate column in the enrollments table',
  },
  'corporate.catalog.enrollments.table.certificate.yes': {
    id: 'corporate.catalog.enrollments.table.certificate.yes',
    defaultMessage: 'Yes',
    description: 'Text to indicate the user has a certificate',
  },
  'corporate.catalog.enrollments.table.certificate.no': {
    id: 'corporate.catalog.enrollments.table.certificate.no',
    defaultMessage: 'No',
    description: 'Text to indicate the user has not get the certificate',
  },
  'corporate.catalog.enrollments.filter.active.only': {
    id: 'corporate.catalog.enrollments.filter.active.only',
    defaultMessage: 'Active',
    description: 'Option for active only filter',
  },
  'corporate.catalog.enrollments.filter.inactive.only': {
    id: 'corporate.catalog.enrollments.filter.inactive.only',
    defaultMessage: 'Inactive',
    description: 'Option for inactive only filter',
  },
  'corporate.catalog.enrollments.table.empty.content': {
    id: 'corporate.catalog.enrollments.table.empty.content',
    defaultMessage: 'No learners found',
    description: 'Empty table content for the learners table.',
  },
  'corporate.catalog.enrollments.table.action.download.report': {
    id: 'corporate.catalog.enrollments.table.action.download.report',
    defaultMessage: 'Download Report',
    description: 'Button text to download the learners report',
  },
});

export default messages;
