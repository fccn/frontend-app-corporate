import * as yup from 'yup';
import messages from './messages';

export const getCatalogSchema = (intl) => {
  const CATALOG_NAME_MIN = 3;
  const CATALOG_NAME_MAX = 255;
  const COURSE_ENROLLMENT_LIMIT_MIN = 0;
  const USER_LIMIT_MIN = 0;

  return yup.object({
    name: yup
      .string()
      .required(intl.formatMessage(messages.formNameRequired))
      .min(CATALOG_NAME_MIN, intl.formatMessage(messages.formNameMin, { min: CATALOG_NAME_MIN }))
      .max(CATALOG_NAME_MAX, intl.formatMessage(messages.formNameMax, { max: CATALOG_NAME_MAX })),
    alternativeLink: yup
      .string()
      .url(intl.formatMessage(messages.formCatalogAlternativeLinkInvalid)),
    supportEmail: yup
      .string()
      .email(intl.formatMessage(messages.formSupportEmailInvalid)),
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
    courseEnrollmentsLimit: yup
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
    authorizationMessage: yup
      .string(),
    emailRegexes: yup
      .array()
      .of(yup.string().required()),
    isSelfEnrollment: yup.boolean(),
  });
};

/**
 * Converts an ISO-8601 datetime string (e.g., "2025-11-05T13:00:00Z")
 * into a `YYYY-MM-DD` string suitable for use in an HTML
 * `<input type="date">`.
 *
 * The conversion respects the user's **local timezone**.
 * For example, if the backend sends a UTC timestamp, this function
 * adjusts the date based on the user's local offset.
 *
 * @param isoString - An ISO-8601 formatted date/time string.
 * @returns A `YYYY-MM-DD` formatted date string, or an empty string if the input is invalid.
 *
 * @example
 * ```ts
 * isoToDateInputValue("2025-11-05T13:00:00Z");
 * // "2025-11-05" (depending on the user's local timezone)
 * ```
 *
 * @example
 * ```ts
 * isoToDateInputValue("invalid-date");
 * // ""
 * ```
 */
export function isoToDateInputValue(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) { return ''; }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
