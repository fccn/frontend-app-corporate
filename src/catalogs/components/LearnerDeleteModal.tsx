import { useIntl } from '@edx/frontend-platform/i18n';
import ModalLayout from '@src/components/ModalLayout';
import { Button, Container } from '@openedx/paragon';
import messages from '@src/catalogs/messages';
import { useNotification } from '@src/components/NotificationProvider';
import { CELERY_STATUS } from '@src/constants';
import { useRemoveLearners } from '../data/hooks';

interface LearnersDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  catalogId: string;
  catalogName: string;
  selectedLearners: any[];
}

const ListItem = (content: string) => <li key={content}>{content}</li>;

const LearnerDeleteModal = ({
  isOpen, onClose, catalogId, selectedLearners, catalogName = '',
}: LearnersDeleteProps) => {
  const intl = useIntl();
  const { showNotification } = useNotification();
  const { mutate: removeLearners, isPending } = useRemoveLearners();

  const handleDelete = () => {
    if (!selectedLearners || selectedLearners.length === 0) {
      return;
    }
    const learnerIds = selectedLearners.map((learner) => learner.id);
    removeLearners(
      { catalogId, learnerIds },
      {
        onSuccess: (data) => {
          if (data.status === CELERY_STATUS.SUCCESS) {
            showNotification(
              intl.formatMessage(messages['corporate.catalog.learners.modal.delete.success']),
              'success',
            );
          }
          onClose();
        },
      },
    );
    onClose();
  };

  return (
    <ModalLayout
      title={intl.formatMessage(messages['corporate.catalog.learners.modal.delete.title'])}
      isOpen={isOpen}
      onClose={onClose}
      actions={(
        <Button onClick={handleDelete} variant="danger" disabled={!selectedLearners || selectedLearners.length === 0 || isPending}>
          {intl.formatMessage(messages['corporate.catalog.learners.modal.delete.action'])}
        </Button>
      )}
    >
      <Container className="pt-5">
        <h4>
          {intl.formatMessage(
            messages['corporate.catalog.learners.modal.delete.confirmation'],
            {
              count: selectedLearners ? selectedLearners.length : 0,
              learnerName: (selectedLearners && selectedLearners[0]?.user?.fullName) || '',
              email: (selectedLearners && selectedLearners[0]?.user?.email) || '',
              catalogName,
            },
          )}
        </h4>
        <ul className="mt-4">
          {intl.formatMessage(messages['corporate.catalog.learners.modal.delete.description'], { li: ListItem })}
        </ul>
      </Container>
    </ModalLayout>
  );
};

export default LearnerDeleteModal;
