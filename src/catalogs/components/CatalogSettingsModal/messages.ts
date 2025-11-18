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
  'corporate.catalog.form.authorization.message.field': {
    id: 'corporate.catalog.form.authorization.message.field',
    defaultMessage: 'Additional message for authorization',
    description: 'Label the authorization message field',
  },
  'corporate.catalog.form.email.regexes.field': {
    id: 'corporate.catalog.form.email.regexes.field',
    defaultMessage: 'Partner Email Regex',
    description: 'Label for the partner email regex field',
  },
  'corporate.catalog.form.is.self.enrollment.field': {
    id: 'corporate.catalog.form.is.self.enrollment.field',
    defaultMessage: 'Self Enrollment',
    description: 'Label for the self enrollment switch',
  },

  // form validation messages
  formNameRequired: {
    id: 'form.name.required',
    defaultMessage: 'Catalog name is required',
    description: 'Error message for required catalog name',
  },
  formNameMin: {
    id: 'form.name.min',
    defaultMessage: 'Catalog name must be at least {min} characters',
    description: 'Error message for minimum length of catalog name',
  },
  formNameMax: {
    id: 'form.name.max',
    defaultMessage: 'Catalog name cannot exceed {max} characters',
    description: 'Error message for maximum length of catalog name',
  },
  formCatalogAlternativeLinkInvalid: {
    id: 'form.catalog.alternative.link.invalid',
    defaultMessage: 'Please enter a valid URL',
    description: 'Error message for invalid alternative link URL',
  },
  formSupportEmailRequired: {
    id: 'form.support.email.required',
    defaultMessage: 'Support email is required',
    description: 'Error message for required support email',
  },
  formSupportEmailInvalid: {
    id: 'form.support.email.invalid',
    defaultMessage: 'Please enter a valid email address',
    description: 'Error message for invalid support email format',
  },
  formAvailableStartDateRequired: {
    id: 'form.available.start.date.required',
    defaultMessage: 'Start date is required',
    description: 'Error message for required start date',
  },
  formAvailableStartDateInvalid: {
    id: 'form.available.start.date.invalid',
    defaultMessage: 'Please enter a valid start date',
    description: 'Error message for invalid start date format',
  },
  formAvailableEndDateRequired: {
    id: 'form.available.end.date.required',
    defaultMessage: 'End date is required',
    description: 'Error message for required end date',
  },
  formAvailableEndDateInvalid: {
    id: 'form.available.end.date.invalid',
    defaultMessage: 'Please enter a valid end date',
    description: 'Error message for invalid end date format',
  },
  formAvailableEndDateMin: {
    id: 'form.available.end.date.min',
    defaultMessage: 'End date must be after start date',
    description: 'Error message when end date is before start date',
  },
  formCourseEnrollmentLimitMin: {
    id: 'form.course.enrollment.limit.min',
    defaultMessage: 'Course enrollment must be at least {min} participants',
    description: 'Error message for negative course enrollment limit',
  },
  formCourseEnrollmentLimitInteger: {
    id: 'form.course.enrollment.limit.integer',
    defaultMessage: 'Course enrollment limit must be a whole number',
    description: 'Error message for non-integer course enrollment limit',
  },
  formUserLimitMin: {
    id: 'form.user.limit.min',
    defaultMessage: 'User limit cannot be negative',
    description: 'Error message for negative user limit',
  },
  formUserLimitInteger: {
    id: 'form.user.limit.integer',
    defaultMessage: 'User limit must be a whole number',
    description: 'Error message for non-integer user limit',
  },
});

export default messages;
