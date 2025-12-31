import { useIntl } from '@edx/frontend-platform/i18n';
import ModalLayout from '@src/components/ModalLayout';
import { Button, Container } from '@openedx/paragon';
import messages from '@src/catalogs/messages';
import { useRemoveLearners } from '../data/hooks';

interface CourseDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  catalogId: string;
  catalogName?: string;
  selectedLearners?: any[];
}

const ListItem = (content: string) => <li key={content}>{content}</li>;

const LearnerDeleteModal = ({
  isOpen, onClose, catalogId, selectedLearners, catalogName = '',
}: CourseDeleteProps) => {
  const intl = useIntl();
  const { mutate: removeLearners } = useRemoveLearners();

  const handleDelete = () => {
    if (!selectedLearners || selectedLearners.length === 0) {
      return;
    }
    console.log('Deleting learners with IDs:', selectedLearners);
    const learnerIds = selectedLearners.map((learner) => learner.id);
    removeLearners({ catalogId, learnerIds });
    onClose();
  };

  return (
    <ModalLayout
      title={intl.formatMessage(messages['corporate.catalog.learners.modal.delete.title'])}
      isOpen={isOpen}
      onClose={onClose}
      actions={(
        <Button onClick={handleDelete} variant="danger">
          {intl.formatMessage(messages['corporate.catalog.learners.modal.delete.action'])}
        </Button>
      )}
    >
      <Container className="pt-5">
        <h4>
          { intl.formatMessage(messages['corporate.catalog.learners.modal.delete.confirmation'], { learnerName: selectedLearners ? selectedLearners[0]?.user.fullName : '', email: selectedLearners ? selectedLearners[0]?.user.email : '', catalogName }) }
        </h4>
        <ul className="mt-4">
          {intl.formatMessage(messages['corporate.catalog.learners.modal.delete.description'], { li: ListItem })}
        </ul>
      </Container>
    </ModalLayout>
  );
};

export default LearnerDeleteModal;
