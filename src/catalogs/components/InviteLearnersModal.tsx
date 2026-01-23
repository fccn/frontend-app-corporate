import { useIntl } from '@edx/frontend-platform/i18n';
import ModalLayout from '@src/components/ModalLayout';
import {
  Alert,
  Button, Card, Container, Dropzone, Form, IconButton,
} from '@openedx/paragon';
import messages from '@src/catalogs/messages';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupValidationResolver } from '@src/utils';
import { useInviteLearners, useBulkInviteTaskStatus } from '@src/catalogs/data/hooks';
import { Delete } from '@openedx/paragon/icons';
import { inviteSchema, inviteError, fileUploadStatus } from './utils';
import { useNotification } from '@src/components/NotificationProvider';
import { useState, useRef } from 'react';

type FormValues = yup.InferType<typeof inviteSchema>;

interface CourseAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalogId: string;
}

const InviteLearnersModal = ({ isOpen, onClose, catalogId }: CourseAddModalProps) => {
  const intl = useIntl();
  const { showNotification } = useNotification();
  const [errorDetails, setErrorDetails] = useState();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupValidationResolver(inviteSchema),
    mode: 'onBlur',
  });

  const csvFile = watch('csvFile');
  const { mutate: inviteLearners, isPending } = useInviteLearners();
  const { mutateAsync: getTaskStatus } = useBulkInviteTaskStatus();
  const fileName = csvFile ? csvFile.name : null;
  const timeoutRef = useRef<NodeJS.Timeout>();

  const pollTaskStatus = async (taskId: string) => {
    try {
      const response = await getTaskStatus({ catalogId, taskId });

      if (response.status === fileUploadStatus.failure) {
        showNotification(intl.formatMessage(messages['corporate.catalog.learners.modal.invite.notification.generic.error']), 'error');
        return;
      }

      if (response.status == fileUploadStatus.success) {
        handleInviteResponse(response.result);
        return;
      }

      timeoutRef.current = setTimeout(() => pollTaskStatus(taskId), 2000);
    } catch (error) {
      showNotification(intl.formatMessage(messages['corporate.catalog.learners.modal.invite.notification.generic.error']), 'error');
    }
  };

  const handleInviteResponse = (responseData: any) => {
    // Sync Response
    if (responseData?.createdCount > 0 || responseData?.successCount > 0) {
      const count = responseData.createdCount || responseData.successCount;
      showNotification(
        intl.formatMessage(messages['corporate.catalog.learners.modal.invite.notification.success'], { count }),
        'success',
      );
    }

    if (responseData?.errors && responseData.errors.length > 0 || responseData?.failedCount && responseData.failedCount > 0) {
      const errors = responseData.errors || responseData.failed;
      const duplicateErrors = errors.filter((err: any) => err.error === inviteError.duplicate);
      const otherErrors = errors.filter((err: any) => err.error !== inviteError.duplicate);

      if (duplicateErrors.length > 0) {
        showNotification(
          intl.formatMessage(
            messages['corporate.catalog.learners.modal.invite.notification.duplicate'],
            {
              count: duplicateErrors.length,
              email: duplicateErrors.map((err: any) => err.email).join(', '),
            },
          ),
          'error',
          10000,
        );
      }

      if (otherErrors.length > 0) {
        showNotification(
          intl.formatMessage(messages['corporate.catalog.learners.modal.invite.notification.error'], { count: otherErrors.length }),
          'error',
        );

        const groupedErrors: Record<string, string[]> = {};
        otherErrors.forEach((err: any) => {
          if (!groupedErrors[err.error]) groupedErrors[err.error] = [];
          groupedErrors[err.error].push(err.email);
        });

        const errorList = Object.entries(groupedErrors).map(([message, emails]) => (
          <li key={message}>
            {message}: {emails.join(', ')}
          </li>
        ));
        setErrorDetails(errorList as any);

        // Collect failed emails (excluding duplicates) to keep in the input
        const failedEmails = otherErrors.map((err: any) => err.email);
        setValue('emails', failedEmails.join(', '), { shouldValidate: true });
      } else {
        // If only duplicates occurred (or success + duplicates), we clear the form and close.
        // Duplicates are warned via toast, but we don't block the user.
        reset({ emails: '', csvFile: null });
        onClose();
      }
    } else {
      // createdCount > 0 and no errors falls through here implicitly if we don't return early.
      // But we have checks above.
      // If createdCount > 0 and no errors (or errors empty), we want to close.
      // The boolean logic:
      // if (createdCount > 0) -> Notify.
      // if (errors > 0) -> Handle errors.
      // else -> Close?
      // Wait, the logic in 'else' block of (otherErrors.length > 0) handles cases where we have duplicates or no errors.
      // But if we have createdCount > 0 and NO errors at all, we don't hit the `if (responseData?.errors ...)` block.
      // So we need to handle "Pure Success" closing.
      reset({ emails: '', csvFile: null });
      onClose();
    }
  };

  const onSubmit = (data: FormValues) => {
    const emails = data.emails
      ? data.emails
        .split(/[\s,;]+/)
        .map(e => e.trim())
        .filter(Boolean)
      : [];

    inviteLearners(
      {
        catalogId,
        data: {
          emails: emails.length ? emails : undefined,
          csvFile: data.csvFile || undefined,
        },
      },
      {
        onSuccess: (responseData: any) => {
          // Async Response
          if (responseData?.taskId) {
            if (responseData.status === fileUploadStatus.success) {
              handleInviteResponse(responseData);
              return;
            };
            showNotification(intl.formatMessage(messages['corporate.catalog.learners.modal.invite.notification.processing']), 'info');
            reset({ emails: '', csvFile: null });
            onClose();
            pollTaskStatus(responseData.taskId);
            return;
          }

          // Sync Response
          handleInviteResponse(responseData);
        },
        onError: (error: any) => {
          // Try to get structured error data from response
          const responseData = error.response?.data;

          if (responseData && (responseData.errors || responseData.createdCount)) {
            handleInviteResponse(responseData);
          } else {
            showNotification(
              intl.formatMessage(messages['corporate.catalog.learners.modal.invite.notification.generic.error']),
              'error',
            );
          }
        },
      },
    );
  };

  return (
    <ModalLayout
      title={intl.formatMessage(messages['corporate.catalog.learners.modal.invite.title'])}
      isOpen={isOpen}
      onClose={() => {
        reset({
          emails: '',
          csvFile: null,
        });
        onClose();
      }}
      actions={(
        <Button onClick={handleSubmit(onSubmit)} disabled={!isValid || isSubmitting || isPending}>
          {intl.formatMessage(messages['corporate.catalog.learners.modal.invite.action'])}
        </Button>
      )}
    >
      <Container className="py-3">
        <Form.Group controlId="inviteLearnersEmail" size="sm">
          <h4 className="text-primary">{intl.formatMessage(messages['corporate.catalog.learners.modal.invite.manually.title'])}</h4>
          <Form.Label>
            {intl.formatMessage(messages['corporate.catalog.learners.modal.invite.manually.description'])}
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            {...register('emails')}
            placeholder={intl.formatMessage(
              messages['corporate.catalog.learners.modal.invite.manually.input.placeholder'],
            )}
            isInvalid={!!errors.emails || !!errorDetails}
            disabled={isSubmitting || isPending || !!csvFile}
            onChange={(e) => {
              register('emails').onChange(e);
              if (errorDetails) setErrorDetails(undefined);
            }}
          />
          {errors.emails && (
            <Form.Control.Feedback type="invalid">
              {errors.emails.message}
            </Form.Control.Feedback>
          )}
          {errorDetails && (
            <Form.Control.Feedback type="invalid">
              {intl.formatMessage(messages['corporate.catalog.learners.modal.invite.notification.error_details_header'])}
              <ul className="mb-0 pl-3">
                {errorDetails}
              </ul>
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group controlId="inviteLearnersUpload" size="sm" className="mt-4">
          <h4 className="text-primary">{intl.formatMessage(messages['corporate.catalog.learners.modal.invite.bulk.title'])}</h4>
          <Form.Label>
            {intl.formatMessage(messages['corporate.catalog.learners.modal.invite.bulk.description'])}
          </Form.Label>
          {csvFile
            ? (
              <Card className="mt-4 px-3 py-4 d-flex align-items-center justify-content-between" orientation="horizontal">
                <span>{fileName}</span>
                <IconButton
                  variant="danger"
                  alt="Remove File"
                  src={Delete}
                  size="sm"
                  onClick={() => {
                    setValue('csvFile', null, { shouldValidate: true });
                  }}
                />
              </Card>
            )
            : (
              <Dropzone
                accept={{ 'text/csv': ['.csv'] }}
                maxSize={5 * 1024 * 1024} // 5 MB
                className={watch('emails') ? 'upload-disabled' : ''}
                onProcessUpload={async ({ fileData, requestConfig, handleError }) => {
                  try {
                    const file = await fileData.get('file');

                    if (!file) {
                      throw new Error('No file provided');
                    }
                    setValue('csvFile', file, { shouldValidate: true });

                    // Signal success to Dropzone
                    return await Promise.resolve({
                      ...requestConfig,
                      status: 200,
                      data: {},
                    });
                  } catch (error) {
                    handleError(error as Error);
                    return Promise.reject(error);
                  }
                }}
                onRemove={() => {
                  setValue('csvFile', null, { shouldValidate: true });
                }}
              />
            )}
        </Form.Group>
      </Container>
    </ModalLayout>
  );
};

export default InviteLearnersModal;
