import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'corporate.catalog.form.save.button': {
    id: 'corporate.catalog.form.save.button',
    defaultMessage: 'Save',
    description: 'Text for the save button in the app layout',
  },
  'corporate.catalog.settings.modal.title': {
    id: 'corporate.catalog.settings.modal.title',
    defaultMessage: 'Catalog settings',
    description: 'Title for the edit catalog modal',
  },
  'corporate.catalog.form.general.information.title': {
    id: 'corporate.catalog.form.general.information.title',
    defaultMessage: 'General Information',
    description: 'Title for the general information section of the form',
  },
  'corporate.catalog.form.name.field': {
    id: 'corporate.catalog.form.name.field',
    defaultMessage: 'Catalog Name',
    description: 'Label for the name field',
  },
  'corporate.catalog.form.alternative.link.field': {
    id: 'corporate.catalog.form.alternative.link.field',
    defaultMessage: 'Alternative Link',
    description: 'Label for the catalog alternative link field',
  },
  'corporate.catalog.form.support.email.field': {
    id: 'corporate.catalog.form.support.email.field',
    defaultMessage: 'Support Email',
    description: 'Label for the support email field',
  },
  'corporate.catalog.form.available.start.date.field': {
    id: 'corporate.catalog.form.available.start.date.field',
    defaultMessage: 'Start Date',
    description: 'Label for the available start date field',
  },
  'corporate.catalog.form.available.end.date.field': {
    id: 'corporate.catalog.form.available.end.date.field',
    defaultMessage: 'End Date',
    description: 'Label for the available end date field',
  },
  'corporate.catalog.form.enrollment.settings.title': {
    id: 'corporate.catalog.form.enrollment.settings.title',
    defaultMessage: 'Enrollment Settings',
    description: 'Title for the enrollment settings section of the form',
  },
  'corporate.catalog.form.course.enrollment.limit.field': {
    id: 'corporate.catalog.form.course.enrollment.limit.field',
    defaultMessage: 'Course Enrollment Limit',
    description: 'Label for the course enrollment limit field',
  },
  'corporate.catalog.form.user.limit.field': {
    id: 'corporate.catalog.form.user.limit.field',
    defaultMessage: 'User Limit',
    description: 'Label for the user limit field',
  },
  'corporate.catalog.form.advanced.settings.title': {
    id: 'corporate.catalog.form.advanced.settings.title',
    defaultMessage: 'Advanced Settings',
    description: 'Title for the advanced settings section of the form',
  },
  'corporate.catalog.form.enrollment.authorization.title': {
    id: 'corporate.catalog.form.enrollment.authorization.title',
    defaultMessage: 'Authorization',
    description: 'Title for the authorization section of the form',
  },
  'corporate.catalog.form.authorization.message.field': {
    id: 'corporate.catalog.form.authorization.message.field',
    defaultMessage: 'Additional message for authorization',
    description: 'Label the authorization message field',
  },
  'corporate.catalog.form.authorization.message.placeholder': {
    id: 'corporate.catalog.form.authorization.message.placeholder',
    defaultMessage: 'Write a message for learners (optional)',
    description: 'Placeholder for the authorization message field',
  },
  'corporate.catalog.form.email.regexes.field': {
    id: 'corporate.catalog.form.email.regexes.field',
    defaultMessage: 'Allowed email domains',
    description: 'Label for the partner email regex field',
  },
  'corporate.catalog.form.email.regexes.description': {
    id: 'corporate.catalog.form.email.regexes.description',
    defaultMessage: 'Add comma-separated email domains allowed to self-enroll in this catalog. Only users with emails from these domains will be able to join. Example: @empresa.com',
    description: 'Description text for the partner email regex field',
  },
  'corporate.catalog.form.self.enrollment.field': {
    id: 'corporate.catalog.form.self.enrollment.field',
    defaultMessage: 'Self Enrollment',
    description: 'Label for the self enrollment switch',
  },

  // form validation messages
  'corporate.catalog.form.validation.name.required': {
    id: 'corporate.catalog.form.validation.name.required',
    defaultMessage: 'Catalog name is required',
    description: 'Error message for required catalog name',
  },
  'corporate.catalog.form.validation.name.min': {
    id: 'corporate.catalog.form.validation.name.min',
    defaultMessage: 'Catalog name must be at least {min} characters',
    description: 'Error message for minimum length of catalog name',
  },
  'corporate.catalog.form.validation.name.max': {
    id: 'corporate.catalog.form.validation.name.max',
    defaultMessage: 'Catalog name cannot exceed {max} characters',
    description: 'Error message for maximum length of catalog name',
  },
  'corporate.catalog.form.validation.alternative.link.invalid': {
    id: 'corporate.catalog.form.validation.alternative.link.invalid',
    defaultMessage: 'Please enter a valid URL',
    description: 'Error message for invalid alternative link URL',
  },
  'corporate.catalog.form.validation.support.email.invalid': {
    id: 'corporate.catalog.form.validation.support.email.invalid',
    defaultMessage: 'Please enter a valid email address',
    description: 'Error message for invalid support email format',
  },
  'corporate.catalog.form.validation.start.date.required': {
    id: 'corporate.catalog.form.validation.available.start.date.required',
    defaultMessage: 'Start date is required',
    description: 'Error message for required start date',
  },
  'corporate.catalog.form.validation.start.date.invalid': {
    id: 'corporate.catalog.form.validation.start.date.invalid',
    defaultMessage: 'Please enter a valid start date',
    description: 'Error message for invalid start date format',
  },
  'corporate.catalog.form.validation.end.date.required': {
    id: 'corporate.catalog.form.validation.end.date.required',
    defaultMessage: 'End date is required',
    description: 'Error message for required end date',
  },
  'corporate.catalog.form.validation.end.date.invalid': {
    id: 'corporate.catalog.form.validation.available.end.date.invalid',
    defaultMessage: 'Please enter a valid end date',
    description: 'Error message for invalid end date format',
  },
  'corporate.catalog.form.validation.end.date.min': {
    id: 'corporate.catalog.form.validation.available.end.date.min',
    defaultMessage: 'End date must be after start date',
    description: 'Error message when end date is before start date',
  },
  'corporate.catalog.form.validation.course.enrollment.limit.min': {
    id: 'corporate.catalog.form.validation.course.enrollment.limit.min',
    defaultMessage: 'Course enrollment must be at least {min} participants',
    description: 'Error message for negative course enrollment limit',
  },
  'corporate.catalog.form.validation.course.enrollment.limit.integer': {
    id: 'corporate.catalog.form.validation.course.enrollment.limit.integer',
    defaultMessage: 'Course enrollment limit must be a whole number',
    description: 'Error message for non-integer course enrollment limit',
  },
  'corporate.catalog.form.validation.user.limit.min': {
    id: 'corporate.catalog.form.validation.user.limit.min',
    defaultMessage: 'User limit cannot be negative',
    description: 'Error message for negative user limit',
  },
  'corporate.catalog.form.validation.user.limit.integer': {
    id: 'corporate.catalog.form.validation.user.limit.integer',
    defaultMessage: 'User limit must be a whole number',
    description: 'Error message for non-integer user limit',
  },

  // notification messages
  'corporate.catalog.settings.modal.notification.success': {
    id: 'corporate.catalog.settings.modal.notification.success',
    defaultMessage: 'Catalog settings have been successfully updated.',
    description: 'Notification message displayed when catalog settings are successfully updated',
  },
  'corporate.catalog.settings.modal.notification.error': {
    id: 'corporate.catalog.settings.modal.notification.error',
    defaultMessage: 'An error occurred while updating catalog settings. Please try again.',
    description: 'Notification message displayed when there is an error updating catalog settings',
  },
});

export default messages;
