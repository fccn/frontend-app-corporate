import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Container } from '@openedx/paragon';
import ModalLayout from '@src/components/ModalLayout';
import { useNotification } from '@src/notification';
import { CatalogInvitation } from '@src/types';
import { useCancelInvitation } from '../data/hooks';
import messages from '../messages';

interface InvitationCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalogId: string;
  invitation: CatalogInvitation | null;
}

const InvitationCancelModal = ({
  isOpen,
  onClose,
  catalogId,
  invitation,
}: InvitationCancelModalProps) => {
  const intl = useIntl();
  const { showNotification } = useNotification();
  const cancelMutation = useCancelInvitation();

  const handleCancel = () => {
    if (!invitation) { return; }
    cancelMutation.mutate({ catalogId, invitationId: invitation.id }, {
      onSuccess: () => {
        showNotification(intl.formatMessage(messages['corporate.catalog.invitations.modal.cancel.success']), 'success');
        onClose();
      },
      onError: () => {
        showNotification(intl.formatMessage(messages['corporate.catalog.invitations.modal.cancel.error']), 'error');
      },
    });
  };

  return (
    <ModalLayout
      title={intl.formatMessage(messages['corporate.catalog.invitations.modal.cancel.title'])}
      isOpen={isOpen}
      onClose={onClose}
      actions={(
        <Button variant="danger" onClick={handleCancel} disabled={cancelMutation.isPending}>
          {intl.formatMessage(messages['corporate.catalog.invitations.modal.cancel.action'])}
        </Button>
      )}
    >
      <Container className="py-4">
        <p>
          {intl.formatMessage(messages['corporate.catalog.invitations.modal.cancel.confirmation'], {
            email: invitation?.inviteEmail || '',
          })}
        </p>
      </Container>
    </ModalLayout>
  );
};

export default InvitationCancelModal;
