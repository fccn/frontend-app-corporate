import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'corporate.catalog.table.header.action': {
    id: 'corporate.catalog.table.header.action',
    defaultMessage: 'Action',
    description: 'Header for the action column',
  },
  'corporate.catalog.learners.table.empty.content': {
    id: 'corporate.catalog.learners.table.empty.content',
    defaultMessage: 'No learners found',
    description: 'Empty table content for the learners table.',
  },
  'corporate.catalog.learners.table.header.name': {
    id: 'corporate.catalog.learners.table.header.name',
    defaultMessage: 'Learner Username/Name',
    description: 'Header for the learner name column',
  },
  'corporate.catalog.learners.table.header.email': {
    id: 'corporate.catalog.learners.table.header.email',
    defaultMessage: 'Invite Email',
    description: 'Header for the learner email column',
  },
  'corporate.catalog.learners.table.header.status': {
    id: 'corporate.catalog.learners.table.header.status',
    defaultMessage: 'Status',
    description: 'Header for the learner status column',
  },
  'corporate.catalog.learners.table.header.invite.sent.at': {
    id: 'corporate.catalog.learners.table.header.invite.sent.at',
    defaultMessage: 'Invite Sent At',
    description: 'Header for the invite sent at column',
  },
  'corporate.catalog.learners.table.header.accept.at': {
    id: 'corporate.catalog.learners.table.header.accept.at',
    defaultMessage: 'Accepted At',
    description: 'Header for the accept at column',
  },
  'corporate.catalog.learners.table.header.last.login': {
    id: 'corporate.catalog.learners.table.header.last.login',
    defaultMessage: 'Last Login Date',
    description: 'Header for the last login date column',
  },
  'corporate.catalog.learners.table.header.enrollments': {
    id: 'corporate.catalog.learners.table.header.enrollments',
    defaultMessage: 'Enrollments',
    description: 'Header for the enrollments column',
  },
  'corporate.catalog.learners.table.header.certified': {
    id: 'corporate.catalog.learners.table.header.certified',
    defaultMessage: 'Certificates',
    description: 'Header for the certificates column',
  },
  'corporate.catalog.learners.table.header.removed.at': {
    id: 'corporate.catalog.learners.table.header.removed.at',
    defaultMessage: 'Removed At',
    description: 'Header for the removed at column',
  },
  'corporate.catalog.learners.table.action.download.report': {
    id: 'corporate.catalog.learners.table.action.download.report',
    defaultMessage: 'Download Report',
    description: 'Button text to download the learners report',
  },
  'corporate.catalog.learners.bulk.delete.action': {
    id: 'corporate.catalog.learners.bulk.delete.action',
    defaultMessage: 'Delete Selected Learners',
    description: 'Action button text for deleting selected learners from the catalog',
  },
  'corporate.catalog.learners.modal.delete.title': {
    id: 'corporate.catalog.learners.modal.delete.title',
    defaultMessage: 'Delete Learners from Catalog',
    description: 'Title for the delete learners from catalog modal',
  },
  'corporate.catalog.learners.modal.delete.confirmation': {
    id: 'corporate.catalog.learners.modal.delete.confirmation',
    defaultMessage: 'You are about to remove {count, plural, one {{learnerName} ({email})} other {# learners}} from "{catalogName}" catalog.',
    description: 'Confirmation message for deleting learners from the catalog',
  },
  'corporate.catalog.learners.modal.delete.description': {
    id: 'corporate.catalog.learners.modal.delete.description',
    defaultMessage: `
    <li>The learner will lose access to this catalog and will no longer see its courses.</li>
    <li>Any active enrollments in open/free courses will be preserved (progress and certificates remain intact).</li>
    <li>If the learner was enrolled in paid or verified-mode courses only through this catalog, their enrollment may be downgraded to audit mode.</li>
    `,
    description: 'Description for the delete learners from catalog modal',
  },
  'corporate.catalog.learners.modal.delete.action': {
    id: 'corporate.catalog.learners.modal.delete.action',
    defaultMessage: 'Delete Learner',
    description: 'Action button text for deleting learners from the catalog',
  },
  'corporate.catalog.learners.filter.active.only': {
    id: 'corporate.catalog.learners.filter.active.only',
    defaultMessage: 'Active',
    description: 'Option for active only filter',
  },
  'corporate.catalog.learners.filter.inactive.only': {
    id: 'corporate.catalog.learners.filter.inactive.only',
    defaultMessage: 'Inactive',
    description: 'Option for inactive only filter',
  },
  'corporate.catalog.learners.modal.delete.success': {
    id: 'corporate.catalog.learners.modal.delete.success',
    defaultMessage: 'Learners removed successfully.',
    description: 'Success notification message when learners are removed from the catalog',
  },
});

export default messages;
