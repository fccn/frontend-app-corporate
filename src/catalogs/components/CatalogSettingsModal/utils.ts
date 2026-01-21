import * as yup from 'yup';
import messages from './messages';

export const getCatalogSchema = (intl) => {
  const CATALOG_NAME_MIN = 3;
  const CATALOG_NAME_MAX = 255;
  const COURSE_ENROLLMENT_LIMIT_MIN = 0;
  const USER_LIMIT_MIN = 0;

  const isValidDate = (v?: string) => typeof v === 'string' && !Number.isNaN(new Date(v).getTime());

  return yup.object({
    name: yup
      .string()
      .required(intl.formatMessage(messages['corporate.catalog.form.validation.name.required']))
      .min(CATALOG_NAME_MIN, intl.formatMessage(messages['corporate.catalog.form.validation.name.min'], { min: CATALOG_NAME_MIN }))
      .max(CATALOG_NAME_MAX, intl.formatMessage(messages['corporate.catalog.form.validation.name.max'], { max: CATALOG_NAME_MAX })),
    alternativeLink: yup
      .string()
      .url(intl.formatMessage(messages['corporate.catalog.form.validation.alternative.link.invalid']))
      .nullable(),
    supportEmail: yup
      .string()
      .email(intl.formatMessage(messages['corporate.catalog.form.validation.support.email.invalid']))
      .nullable(),
    availableStartDate: yup
      .string()
      .required(intl.formatMessage(messages['corporate.catalog.form.validation.start.date.required']))
      .test('valid-date', intl.formatMessage(messages['corporate.catalog.form.validation.start.date.invalid']), isValidDate),

    availableEndDate: yup
      .string()
      .required(intl.formatMessage(messages['corporate.catalog.form.validation.end.date.required']))
      .test('valid-date', intl.formatMessage(messages['corporate.catalog.form.validation.end.date.invalid']), isValidDate)
      .test(
        'is-after-start',
        intl.formatMessage(messages['corporate.catalog.form.validation.end.date.min']),
        function validateEndDate(value) {
          const { availableStartDate } = this.parent;
          return (
            isValidDate(value)
            && isValidDate(availableStartDate)
            && new Date(value!).getTime() > new Date(availableStartDate!).getTime()
          );
        },
      ),
    courseEnrollmentsLimit: yup
      .number()
      .typeError(intl.formatMessage(messages['corporate.catalog.form.validation.course.enrollment.limit.integer']))
      .integer(intl.formatMessage(messages['corporate.catalog.form.validation.course.enrollment.limit.integer']))
      .min(
        COURSE_ENROLLMENT_LIMIT_MIN,
        intl.formatMessage(messages['corporate.catalog.form.validation.course.enrollment.limit.min'], { min: COURSE_ENROLLMENT_LIMIT_MIN }),
      ),
    userLimit: yup
      .number()
      .typeError(intl.formatMessage(messages['corporate.catalog.form.validation.user.limit.integer']))
      .integer(intl.formatMessage(messages['corporate.catalog.form.validation.user.limit.integer']))
      .min(
        USER_LIMIT_MIN,
        intl.formatMessage(messages['corporate.catalog.form.validation.user.limit.min'], { min: USER_LIMIT_MIN }),
      ),
    authorizationMessage: yup
      .string()
      .nullable(),
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
export const isoToDateInputValue = (isoString: string): string => {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) { return ''; }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};
