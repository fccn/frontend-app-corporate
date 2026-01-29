import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Container } from '@openedx/paragon';
import ModalLayout from '@src/components/ModalLayout';
import { useNotification } from '@src/notification';
import { CELERY_STATUS } from '@src/constants';
import { useRemoveLearners } from '../data/hooks';

import messages from '../messages';

interface LearnerDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalogId: string;
  catalogName: string;
  selectedLearners: any[];
}

const ListItem = (content: string) => <li key={content}>{content}</li>;

const LearnerDeleteModal = ({
  isOpen,
  onClose,
  catalogId,
  catalogName,
  selectedLearners = [],
}: LearnerDeleteModalProps) => {
  const intl = useIntl();
  const { showNotification } = useNotification();
  const removeLearnersMutation = useRemoveLearners();

  const handleDelete = () => {
    if (!selectedLearners?.length) {
      return;
    }
    removeLearnersMutation.mutate({
      catalogId,
      learnerIds: selectedLearners.map(l => l.id),
    }, {
      onSuccess: (data: any) => {
        if (data.status === CELERY_STATUS.SUCCESS || data.status === CELERY_STATUS.PENDING) {
          showNotification(intl.formatMessage(messages['corporate.catalog.learners.modal.delete.success']), 'success');
        }
        onClose();
      },
      onError: () => {
        showNotification(intl.formatMessage(messages['corporate.catalog.learners.modal.delete.notification.error']), 'error');
      },
    });
  };

  const learnerNames = (selectedLearners || []).map(l => l.user.fullName || l.user.username).join(', ');
  const email = (selectedLearners || []).length === 1 ? selectedLearners[0].user.email : '';

  return (
    <ModalLayout
      title={intl.formatMessage(messages['corporate.catalog.learners.modal.delete.title'])}
      isOpen={isOpen}
      onClose={onClose}
      actions={(
        <Button variant="danger" onClick={handleDelete} disabled={removeLearnersMutation.isPending}>
          {intl.formatMessage(messages['corporate.catalog.learners.modal.delete.action'])}
        </Button>
      )}
    >
      <Container className="py-4">
        <h4>
          {intl.formatMessage(messages['corporate.catalog.learners.modal.delete.confirmation'], {
            count: selectedLearners.length,
            learnerName: learnerNames,
            email,
            catalogName,
          })}
        </h4>
        <ul className="mt-4">
          {intl.formatMessage(messages['corporate.catalog.learners.modal.delete.description'], { li: ListItem })}
        </ul>
      </Container>
    </ModalLayout>
  );
};

export default LearnerDeleteModal;
