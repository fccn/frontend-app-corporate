import { InvitationError } from '@src/types';
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
          if (!value) { return true; }

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

export const INVITE_ERROR = {
  DUPLICATE: 'An active invitation already exists for this user.',
};

export const groupInviteErrors = (errors: InvitationError[]) => {
  const duplicateErrors = errors.filter(err => err.error === INVITE_ERROR.DUPLICATE);
  const otherErrors = errors.filter(err => err.error !== INVITE_ERROR.DUPLICATE);

  const groupedOtherErrors: Record<string, string[]> = {};
  otherErrors.forEach(err => {
    if (!groupedOtherErrors[err.error]) {
      groupedOtherErrors[err.error] = [];
    }
    groupedOtherErrors[err.error].push(err.email);
  });

  return {
    duplicateErrors,
    otherErrors,
    groupedOtherErrors,
  };
};

export const parseEmails = (value?: string): string[] => {
  if (!value) { return []; }

  return value
    .split(/[\s,;]+/)
    .map(email => email.trim())
    .filter(Boolean);
};
