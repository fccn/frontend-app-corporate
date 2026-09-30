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
  'corporate.catalog.table.header.action': {
    id: 'corporate.catalog.table.header.action',
    defaultMessage: 'Action',
    description: 'Header for the action column',
  },
  'corporate.catalog.invitations.table.empty.content': {
    id: 'corporate.catalog.invitations.table.empty.content',
    defaultMessage: 'No invitations found',
    description: 'Empty table content for the invitations table.',
  },
  'corporate.catalog.invitations.table.header.email': {
    id: 'corporate.catalog.invitations.table.header.email',
    defaultMessage: 'Email',
    description: 'Header for the invite email column',
  },
  'corporate.catalog.invitations.table.header.name': {
    id: 'corporate.catalog.invitations.table.header.name',
    defaultMessage: 'Name',
    description: 'Header for the invitee name column',
  },
  'corporate.catalog.invitations.table.header.status': {
    id: 'corporate.catalog.invitations.table.header.status',
    defaultMessage: 'Status',
    description: 'Header for the invitation status column',
  },
  'corporate.catalog.invitations.table.header.invited.at': {
    id: 'corporate.catalog.invitations.table.header.invited.at',
    defaultMessage: 'Invited At',
    description: 'Header for the invited at column',
  },
  'corporate.catalog.invitations.table.header.accepted.at': {
    id: 'corporate.catalog.invitations.table.header.accepted.at',
    defaultMessage: 'Accepted At',
    description: 'Header for the accepted at column',
  },
  'corporate.catalog.invitations.table.header.cancelled.at': {
    id: 'corporate.catalog.invitations.table.header.cancelled.at',
    defaultMessage: 'Cancelled At',
    description: 'Header for the cancelled at column',
  },
  'corporate.catalog.invitations.table.header.invited.by': {
    id: 'corporate.catalog.invitations.table.header.invited.by',
    defaultMessage: 'Invited By',
    description: 'Header for the invited by column',
  },
  'corporate.catalog.invitations.not.registered': {
    id: 'corporate.catalog.invitations.not.registered',
    defaultMessage: 'Not registered yet',
    description: 'Label for invitees who have not yet registered on the platform',
  },
  'corporate.catalog.invitations.filter.all': {
    id: 'corporate.catalog.invitations.filter.all',
    defaultMessage: 'All statuses',
    description: 'Status filter option that shows invitations in every status',
  },
  'corporate.catalog.invitations.status.pending': {
    id: 'corporate.catalog.invitations.status.pending',
    defaultMessage: 'Pending',
    description: 'Label for the pending invitation status, used by the status badge and filter',
  },
  'corporate.catalog.invitations.status.accepted': {
    id: 'corporate.catalog.invitations.status.accepted',
    defaultMessage: 'Accepted',
    description: 'Label for the accepted invitation status, used by the status badge and filter',
  },
  'corporate.catalog.invitations.status.declined': {
    id: 'corporate.catalog.invitations.status.declined',
    defaultMessage: 'Declined',
    description: 'Label for the declined invitation status, used by the status badge and filter',
  },
  'corporate.catalog.invitations.status.removed': {
    id: 'corporate.catalog.invitations.status.removed',
    defaultMessage: 'Removed',
    description: 'Label for the removed invitation status, used by the status badge and filter',
  },
  'corporate.catalog.invitations.status.cancelled': {
    id: 'corporate.catalog.invitations.status.cancelled',
    defaultMessage: 'Cancelled',
    description: 'Label for the cancelled invitation status, used by the status badge and filter',
  },
  'corporate.catalog.invitations.action.resend': {
    id: 'corporate.catalog.invitations.action.resend',
    defaultMessage: 'Resend',
    description: 'Tooltip for the resend invitation action',
  },
  'corporate.catalog.invitations.action.cancel': {
    id: 'corporate.catalog.invitations.action.cancel',
    defaultMessage: 'Cancel',
    description: 'Tooltip for the cancel invitation action',
  },
  'corporate.catalog.invitations.modal.cancel.title': {
    id: 'corporate.catalog.invitations.modal.cancel.title',
    defaultMessage: 'Cancel Invitation',
    description: 'Title for the cancel invitation modal',
  },
  'corporate.catalog.invitations.modal.cancel.confirmation': {
    id: 'corporate.catalog.invitations.modal.cancel.confirmation',
    defaultMessage: 'You are about to cancel the invitation sent to {email}. The invitee will no longer be able to accept this invitation.',
    description: 'Confirmation message for cancelling an invitation',
  },
  'corporate.catalog.invitations.modal.cancel.action': {
    id: 'corporate.catalog.invitations.modal.cancel.action',
    defaultMessage: 'Cancel Invitation',
    description: 'Action button text for cancelling an invitation',
  },
  'corporate.catalog.invitations.modal.cancel.success': {
    id: 'corporate.catalog.invitations.modal.cancel.success',
    defaultMessage: 'Invitation cancelled successfully.',
    description: 'Success notification when an invitation is cancelled',
  },
  'corporate.catalog.invitations.modal.cancel.error': {
    id: 'corporate.catalog.invitations.modal.cancel.error',
    defaultMessage: 'Failed to cancel invitation.',
    description: 'Error notification when cancelling an invitation fails',
  },
  'corporate.catalog.invitations.resend.success': {
    id: 'corporate.catalog.invitations.resend.success',
    defaultMessage: 'Invitation resent successfully.',
    description: 'Success notification when an invitation is resent',
  },
  'corporate.catalog.invitations.resend.error': {
    id: 'corporate.catalog.invitations.resend.error',
    defaultMessage: 'Failed to resend invitation.',
    description: 'Error notification when resending an invitation fails',
  },
});

export default messages;
