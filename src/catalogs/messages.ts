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
  'corporate.catalog.header.info.name': {
    id: 'corporate.catalog.table.info.name',
    defaultMessage: 'Catalog',
    description: 'Info for the catalog name',
  },
  'corporate.catalog.header.info.courses': {
    id: 'corporate.catalog.table.info.courses',
    defaultMessage: 'Courses',
    description: 'Info for the number of courses',
  },
  'corporate.catalog.header.info.enrollments': {
    id: 'corporate.catalog.table.info.enrollments',
    defaultMessage: 'Enrollments',
    description: 'Info for the number of enrollments',
  },
  'corporate.catalog.header.info.certified': {
    id: 'corporate.catalog.table.info.certified',
    defaultMessage: 'Certified Learners',
    description: 'Info for the number of certified learners',
  },
  'corporate.catalog.table.empty.content': {
    id: 'corporate.catalog.table.empty.content',
    defaultMessage: 'No catalogs found',
    description: 'Empty table content for the catalog table.',
  },
  'corporate.catalog.learners.table.empty.content': {
    id: 'corporate.catalog.learners.table.empty.content',
    defaultMessage: 'No learners found',
    description: 'Empty table content for the learners table.',
  },
  'corporate.catalog.learners.table.header.name': {
    id: 'corporate.catalog.learners.table.header.name',
    defaultMessage: 'Learner Name',
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
    defaultMessage: 'Accept At',
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
  'corporate.catalog.learners.table.action.add.learner': {
    id: 'corporate.catalog.learners.table.action.add.learner',
    defaultMessage: 'Invite Learners',
    description: 'Button text to add a learner to the catalog',
  },
  'corporate.catalog.learners.table.action.download.report': {
    id: 'corporate.catalog.learners.table.action.download.report',
    defaultMessage: 'Download Report',
    description: 'Button text to download the learners report',
  },
  'corporate.catalog.learners.modal.invite.title': {
    id: 'corporate.catalog.learners.modal.invite.title',
    defaultMessage: 'Invite Learners to Catalog',
    description: 'Title for the invite learners to catalog modal',
  },
  'corporate.catalog.learners.modal.invite.manually.title': {
    id: 'corporate.catalog.learners.modal.invite.manually.title',
    defaultMessage: 'Invite manually',
    description: 'Label for the manual invite learners input',
  },
  'corporate.catalog.learners.modal.invite.manually.description': {
    id: 'corporate.catalog.learners.modal.invite.manually.description',
    defaultMessage: 'Add email addresses',
    description: 'Description for the manual invite learners input',
  },
  'corporate.catalog.learners.modal.invite.manually.input.placeholder': {
    id: 'corporate.catalog.learners.modal.invite.manually.input.placeholder',
    defaultMessage: 'Enter email addresses (use commas, semicolons, spaces, or new lines to separate).',
    description: 'Placeholder for the manual invite learners input',
  },
  'corporate.catalog.learners.modal.invite.bulk.title': {
    id: 'corporate.catalog.learners.modal.invite.bulk.title',
    defaultMessage: 'Send invitation in Bulk',
    description: 'Label for the bulk invite learners input',
  },
  'corporate.catalog.learners.modal.invite.bulk.description': {
    id: 'corporate.catalog.learners.modal.invite.bulk.description',
    defaultMessage: 'Import the learner list as a CSV file.',
    description: 'Description for the bulk invite learners input',
  },
  'corporate.catalog.learners.modal.invite.action': {
    id: 'corporate.catalog.learners.modal.invite.action',
    defaultMessage: 'Send Invitations',
    description: 'Action button text for sending invitations to learners',
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
  'corporate.catalog.enrollments.table.action.preenroll': {
    id: 'corporate.catalog.enrollments.table.action.preenroll',
    defaultMessage: 'Pre-enroll Learner',
    description: 'Action button text for pre-enrolling a learner in the enrollments table',
  },
  'corporate.catalog.learners.filter.active.only': {
    id: 'corporate.catalog.learners.filter.active.only',
    defaultMessage: 'Active Only',
    description: 'Option for active only filter',
  },
  'corporate.catalog.learners.filter.inactive.only': {
    id: 'corporate.catalog.learners.filter.inactive.only',
    defaultMessage: 'Inactive Only',
    description: 'Option for inactive only filter',
  },
  'corporate.catalog.learners.filter.all': {
    id: 'corporate.catalog.learners.filter.all',
    defaultMessage: 'All',
    description: 'Option for all status filter',
  },
  'corporate.catalog.learners.modal.delete.success': {
    id: 'corporate.catalog.learners.modal.delete.success',
    defaultMessage: 'Learners removed successfully.',
    description: 'Success notification message when learners are removed from the catalog',
  },
});

export default messages;
