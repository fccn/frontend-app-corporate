import { useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import ModalLayout from '@src/components/ModalLayout';
import {
  Button, Card, Container, Dropzone, Form, IconButton,
} from '@openedx/paragon';
import messages from '@src/catalogs/messages';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupValidationResolver } from '@src/utils';
import { useInviteLearners } from '@src/catalogs/data/hooks';
import { Delete } from '@openedx/paragon/icons';
import { useNotification } from '@src/components/NotificationProvider';
import { inviteSchema, parseEmails, groupInviteErrors } from './utils';

type FormValues = yup.InferType<typeof inviteSchema>;

interface CourseInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalogId: string;
  onTaskCreated: (taskId: string) => void;
}

const handleInviteResponse = ({
  responseData,
  intl,
  showNotification,
  setErrorDetails,
  setValue,
  reset,
  onClose,
}) => {
  const createdCount = responseData?.createdCount || responseData?.successCount || 0;
  const errors = responseData?.errors || responseData?.failed || [];

  if (createdCount > 0) {
    showNotification(
      intl.formatMessage(
        messages['corporate.catalog.learners.modal.invite.notification.success'],
        { count: createdCount },
      ),
      'success',
    );
  }

  if (!errors.length) {
    reset({ emails: '', csvFile: null });
    onClose();
    return;
  }

  const {
    duplicateErrors,
    otherErrors,
    groupedOtherErrors,
  } = groupInviteErrors(errors);

  if (duplicateErrors.length > 0) {
    showNotification(
      intl.formatMessage(
        messages['corporate.catalog.learners.modal.invite.notification.duplicate'],
        {
          count: duplicateErrors.length,
        },
      ),
      'error',
      10000,
    );
  }

  if (otherErrors.length > 0) {
    showNotification(
      intl.formatMessage(
        messages['corporate.catalog.learners.modal.invite.notification.error'],
        {
          count: otherErrors.length,
          email: otherErrors.map(e => e.email).join(', '),
        },
      ),
      'error',
    );

    const errorList = Object.entries(groupedOtherErrors);

    setErrorDetails(errorList);

    setValue(
      'emails',
      otherErrors.map(err => err.email).join(', '),
      { shouldValidate: true },
    );
  } else {
    reset({ emails: '', csvFile: null });
    onClose();
  }
};

const InviteLearnersModal = ({
  isOpen, onClose, catalogId, onTaskCreated,
}: CourseInviteModalProps) => {
  const intl = useIntl();
  const { showNotification } = useNotification();
  const [errorDetails, setErrorDetails] = useState<null | [string, string[]][]>(null);
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
  const fileName = csvFile ? csvFile.name : null;

  const onSubmit = (data: FormValues) => {
    const emails = parseEmails(data.emails);

    inviteLearners(
      {
        catalogId,
        data: {
          emails: emails.length ? emails : undefined,
          csvFile: data.csvFile || undefined,
        },
      },
      {
        onSuccess: (responseData) => {
          // Async Response
          if (responseData && 'taskId' in responseData) {
            showNotification(
              intl.formatMessage(
                messages['corporate.catalog.learners.modal.invite.notification.processing'],
              ),
              'info',
            );
            reset({ emails: '', csvFile: null });
            onClose();
            onTaskCreated(responseData.taskId as string);
            return;
          }

          handleInviteResponse({
            responseData,
            intl,
            showNotification,
            setErrorDetails,
            setValue,
            reset,
            onClose,
          });
        },
        onError: (error: any) => {
          // Try to get structured error data from response
          const responseData = error.response?.data;

          if (responseData && (responseData.errors || responseData.createdCount)) {
            handleInviteResponse({
              responseData,
              intl,
              showNotification,
              setErrorDetails,
              setValue,
              reset,
              onClose,
            });
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
              if (errorDetails) { setErrorDetails(null); }
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
                {errorDetails.map(([message, emails]) => (
                  <li key={message}>
                    {message}: {emails.join(', ')}
                  </li>
                ))}
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
