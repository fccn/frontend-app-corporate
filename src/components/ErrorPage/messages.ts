import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'corporate.errorpage.404.title': {
    id: 'corporate.errorpage.404.title',
    defaultMessage: 'Page Not Found',
    description: 'Title for 404 error page',
  },
  'corporate.errorpage.404.message': {
    id: 'corporate.errorpage.404.message',
    defaultMessage: 'Sorry, the page you are looking for does not exist.',
    description: 'Message for 404 error page',
  },
  'corporate.errorpage.403.title': {
    id: 'corporate.errorpage.403.title',
    defaultMessage: 'Access Denied',
    description: 'Title for 403 error page',
  },
  'corporate.errorpage.403.message': {
    id: 'corporate.errorpage.403.message',
    defaultMessage: 'You do not have permission to view this page.',
    description: 'Message for 403 error page',
  },
  'corporate.errorpage.default.title': {
    id: 'corporate.errorpage.default.title',
    defaultMessage: 'Error',
    description: 'Title for default error page',
  },
  'corporate.errorpage.default.message': {
    id: 'corporate.errorpage.default.message',
    defaultMessage: 'Something went wrong.',
    description: 'Message for default error page',
  },
});

export default messages;
