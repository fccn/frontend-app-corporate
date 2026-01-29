import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'corporate.catalog.invitation.modal.invite.notification.success': {
    id: 'corporate.catalog.invitation.modal.invite.notification.success',
    defaultMessage: '{count, plural, one {One invitation sent successfully.} other {# invitations sent successfully.}}',
    description: 'Success notification for sending invites',
  },
  'corporate.catalog.invitation.modal.invite.notification.error': {
    id: 'corporate.catalog.invitation.modal.invite.notification.error',
    defaultMessage: '{count, plural, one {Failed to send invitation ({email}).} other {Failed to send # invitations ({email}).}}',
    description: 'Error notification for failed invites',
  },
  'corporate.catalog.invitation.modal.invite.notification.processing': {
    id: 'corporate.catalog.invitation.modal.invite.notification.processing',
    defaultMessage: 'File uploaded. Invitations are being processed in the background.',
    description: 'Notification for background processing of bulk invites',
  },
  'corporate.catalog.invitation.modal.invite.notification.generic.error': {
    id: 'corporate.catalog.invitation.modal.invite.notification.generic.error',
    defaultMessage: 'An error occurred while sending invitations.',
    description: 'Generic error notification',
  },
  'corporate.catalog.invitation.modal.invite.notification.duplicate': {
    id: 'corporate.catalog.invitation.modal.invite.notification.duplicate',
    defaultMessage: '{count, plural, one {An active invitation already exists for one user.} other {Active invitations already exist for # users}}',
    description: 'Error notification for duplicate invites',
  },
  'corporate.catalog.invitation.modal.invite.notification.error_details_header': {
    id: 'corporate.catalog.invitation.modal.invite.notification.error_details_header',
    defaultMessage: 'The following error happened during the invitation:',
    description: 'Header for the detailed error list in the invite modal',
  },
  'corporate.catalog.invitation.modal.invite.title': {
    id: 'corporate.catalog.invitation.modal.invite.title',
    defaultMessage: 'Invite Learners to Catalog',
    description: 'Title for the invite learners to catalog modal',
  },
  'corporate.catalog.invitation.modal.invite.manually.title': {
    id: 'corporate.catalog.invitation.modal.invite.manually.title',
    defaultMessage: 'Invite manually',
    description: 'Label for the manual invite learners input',
  },
  'corporate.catalog.invitation.modal.invite.manually.description': {
    id: 'corporate.catalog.invitation.modal.invite.manually.description',
    defaultMessage: 'Add email addresses',
    description: 'Description for the manual invite learners input',
  },
  'corporate.catalog.invitation.modal.invite.manually.input.placeholder': {
    id: 'corporate.catalog.invitation.modal.invite.manually.input.placeholder',
    defaultMessage: 'Enter email addresses (use commas, semicolons, spaces, or new lines to separate).',
    description: 'Placeholder for the manual invite learners input',
  },
  'corporate.catalog.invitation.modal.invite.bulk.title': {
    id: 'corporate.catalog.invitation.modal.invite.bulk.title',
    defaultMessage: 'Send invitation in Bulk',
    description: 'Label for the bulk invite learners input',
  },
  'corporate.catalog.invitation.modal.invite.bulk.description': {
    id: 'corporate.catalog.invitation.modal.invite.bulk.description',
    defaultMessage: 'Import the learner list as a CSV file.',
    description: 'Description for the bulk invite learners input',
  },
  'corporate.catalog.invitation.modal.invite.action': {
    id: 'corporate.catalog.invitation.modal.invite.action',
    defaultMessage: 'Send Invitations',
    description: 'Action button text for sending invitations to learners',
  },
  'corporate.catalog.invitation.table.action.add.learner': {
    id: 'corporate.catalog.invitation.table.action.add.learner',
    defaultMessage: 'Invite Learners',
    description: 'Button text to add a learner to the catalog',
  },
});

export default messages;
