import * as yup from 'yup';

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;

export const inviteSchema = yup
  .object({
    emails: yup
      .string()
      .optional()
      .test(
        'valid-emails',
        'One or more email addresses are invalid',
        (value) => {
          if (!value) return true; // optional

          const emails = value
            .split(/[\s,;]+/)
            .map(e => e.trim())
            .filter(Boolean);

          return emails.every(email => emailRegex.test(email));
        }
      ),

    csvFile: yup
      .mixed<File>()
      .nullable()
      .optional(),
  })
  .test(
    'at-least-one-method',
    'Please add email addresses or upload a CSV file',
    (values) => {
      return Boolean(values?.emails?.trim() || values?.csvFile);
    }
  );
