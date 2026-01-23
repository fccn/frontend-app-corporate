import * as yup from 'yup';

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;

export const inviteSchema = yup
  .object({
    emails: yup
      .string()
      .optional()
      .test(
        'valid-emails',
        'One or more email addresses are invalid',
        (value) => {
          if (!value) { return true; } // optional

          const emails = value
            .split(/[\s,;]+/)
            .map(e => e.trim())
            .filter(Boolean);

          return emails.every(email => emailRegex.test(email));
        },
      ),

    csvFile: yup
      .mixed<File>()
      .nullable()
      .optional(),
  })
  .test(
    'at-least-one-method',
    'Please add email addresses or upload a CSV file',
    (values) => Boolean(values?.emails?.trim() || values?.csvFile),
  );

export const fileUploadStatus = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  pending: 'PENDING',
  started: 'STARTED',
};

export const inviteError = {
  duplicate: 'An active invitation already exists for this user.',
}

export const dateFormat = (isoDateString) => {
  if (!isoDateString) {
    return null;
  }
  const date = new Date(isoDateString);
  const pad = n => n.toString().padStart(2, '0');
  const formatted = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} `
    + `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  return formatted;
};
