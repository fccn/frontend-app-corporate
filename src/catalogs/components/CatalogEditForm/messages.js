import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  formGeneralInformation: {
    id: 'form.general.information',
    defaultMessage: 'General Information',
    description: 'Title for the general information section of the form',
  },
  formIsPublic: {
    id: 'form.is.public',
    defaultMessage: 'Public Catalog',
    description: 'Label for the is public switch',
  },
  formName: {
    id: 'form.name',
    defaultMessage: 'Catalog Name',
    description: 'Label for the name field',
  },
  formCatalogAlternativeLink: {
    id: 'form.catalog.alternative.link',
    defaultMessage: 'Alternative Link',
    description: 'Label for the catalog alternative link field',
  },
  formSupportEmail: {
    id: 'form.support.email',
    defaultMessage: 'Support Email',
    description: 'Label for the support email field',
  },
  formAvailableStartDate: {
    id: 'form.available.start.date',
    defaultMessage: 'Start Date',
    description: 'Label for the available start date field',
  },
  formAvailableEndDate: {
    id: 'form.available.end.date',
    defaultMessage: 'End Date',
    description: 'Label for the available end date field',
  },
  formEnrollmentSettings: {
    id: 'form.enrollment.settings',
    defaultMessage: 'Enrollment Settings',
    description: 'Title for the enrollment settings section of the form',
  },
  formCourseEnrollmentLimit: {
    id: 'form.course.enrollment.limit',
    defaultMessage: 'Course Enrollment Limit',
    description: 'Label for the course enrollment limit field',
  },
  formUserLimit: {
    id: 'form.user.limit',
    defaultMessage: 'User Limit',
    description: 'Label for the user limit field',
  },
  formAdvancedSettings: {
    id: 'form.advanced.settings',
    defaultMessage: 'Advanced Settings',
    description: 'Title for the advanced settings section of the form',
  },
  formEmailRegexes: {
    id: 'form.email.regexes',
    defaultMessage: 'Partner Email Regex',
    description: 'Label for the partner email regex field',
  },
  formCustomCourses: {
    id: 'form.custom.courses',
    defaultMessage: 'Enable Custom Courses',
    description: 'Label for the enable custom courses switch',
  },
  formIsSelfEnrollment: {
    id: 'form.is.self.enrollment',
    defaultMessage: 'Self Enrollment',
    description: 'Label for the self enrollment switch',
  },
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
