import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
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
  'corporate.catalog.invitations.filter.pending': {
    id: 'corporate.catalog.invitations.filter.pending',
    defaultMessage: 'Pending',
    description: 'Filter option for pending invitations',
  },
  'corporate.catalog.invitations.filter.accepted': {
    id: 'corporate.catalog.invitations.filter.accepted',
    defaultMessage: 'Accepted',
    description: 'Filter option for accepted invitations',
  },
  'corporate.catalog.invitations.filter.declined': {
    id: 'corporate.catalog.invitations.filter.declined',
    defaultMessage: 'Declined',
    description: 'Filter option for declined invitations',
  },
  'corporate.catalog.invitations.filter.removed': {
    id: 'corporate.catalog.invitations.filter.removed',
    defaultMessage: 'Removed',
    description: 'Filter option for removed invitations',
  },
  'corporate.catalog.invitations.filter.cancelled': {
    id: 'corporate.catalog.invitations.filter.cancelled',
    defaultMessage: 'Cancelled',
    description: 'Filter option for cancelled invitations',
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
