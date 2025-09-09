import * as yup from 'yup';
import messages from './messages';

export const getCatalogSchema = (intl) => {
  const CATALOG_NAME_MIN = 3;
  const CATALOG_NAME_MAX = 100;
  const COURSE_ENROLLMENT_LIMIT_MIN = 0;
  const USER_LIMIT_MIN = 0;

  return yup.object({
    isPublic: yup.boolean(),
    name: yup
      .string()
      .required(intl.formatMessage(messages.formNameRequired))
      .min(CATALOG_NAME_MIN, intl.formatMessage(messages.formNameMin, { min: CATALOG_NAME_MIN }))
      .max(CATALOG_NAME_MAX, intl.formatMessage(messages.formNameMax, { max: CATALOG_NAME_MAX })),
    catalogAlternativeLink: yup
      .string()
      .url(intl.formatMessage(messages.formCatalogAlternativeLinkInvalid)),
    supportEmail: yup
      .string()
      .email(intl.formatMessage(messages.formSupportEmailInvalid))
      .required(intl.formatMessage(messages.formSupportEmailRequired)),
    availableStartDate: yup
      .date()
      .required(intl.formatMessage(messages.formAvailableStartDateRequired))
      .typeError(intl.formatMessage(messages.formAvailableStartDateInvalid)),
    availableEndDate: yup
      .date()
      .required(intl.formatMessage(messages.formAvailableEndDateRequired))
      .typeError(intl.formatMessage(messages.formAvailableEndDateInvalid))
      .test(
        'is-after-start-date',
        intl.formatMessage(messages.formAvailableEndDateMin),
        function validateEndDate(availableEndDate) {
          const { availableStartDate } = this.parent;
          if (!availableEndDate || !availableStartDate) { return true; }
          return new Date(availableEndDate) > new Date(availableStartDate);
        },
      ),
    courseEnrollmentLimit: yup
      .number()
      .typeError(intl.formatMessage(messages.formCourseEnrollmentLimitInteger))
      .integer(intl.formatMessage(messages.formCourseEnrollmentLimitInteger))
      .min(
        COURSE_ENROLLMENT_LIMIT_MIN,
        intl.formatMessage(messages.formCourseEnrollmentLimitMin, { min: COURSE_ENROLLMENT_LIMIT_MIN }),
      ),
    userLimit: yup
      .number()
      .typeError(intl.formatMessage(messages.formUserLimitInteger))
      .integer(intl.formatMessage(messages.formUserLimitInteger))
      .min(
        USER_LIMIT_MIN,
        intl.formatMessage(messages.formUserLimitMin, { min: USER_LIMIT_MIN }),
      ),
    emailRegexes: yup
      .array()
      .of(yup.string().required()),
    customCourses: yup.boolean(),
    isSelfEnrollment: yup.boolean(),
  });
};
