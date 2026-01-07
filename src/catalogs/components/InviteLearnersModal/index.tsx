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
import { inviteSchema } from './utils';

type FormValues = yup.InferType<typeof inviteSchema>;

interface CourseAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalogId: string;
}

const InviteLearnersModal = ({ isOpen, onClose, catalogId }: CourseAddModalProps) => {
  const intl = useIntl();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupValidationResolver(inviteSchema),
    mode: 'onChange',
  });
  const csvFile = watch('csvFile');
  const { mutate: inviteLearners, isPending } = useInviteLearners();
  const fileName = csvFile ? csvFile.name : null;

  const onSubmit = (data: FormValues) => {
    const emails = data.emails
      ? data.emails
        .split(/[\s,;]+/)
        .map(e => e.trim())
        .filter(Boolean)
      : [];

    inviteLearners({
      catalogId,
      data: {
        emails: emails.length ? emails : undefined,
        csvFile: data.csvFile || undefined,
      },
    });
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
            isInvalid={!!errors.emails}
          />
          {errors.emails && (
            <Form.Control.Feedback type="invalid">
              {errors.emails.message}
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
