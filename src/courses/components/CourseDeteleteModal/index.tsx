import { useIntl } from '@edx/frontend-platform/i18n';
import ModalLayout from '@src/components/ModalLayout';
import { Button, Container } from '@openedx/paragon';
import messages from '@src/courses/messages';
import { useDeleteCatalogCourse } from '../../data/hooks';

interface CourseDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  catalogId: string;
  catalogName?: string;
  selectedCourses?: any[];
}

const ListItem = (content: string) => <li key={content}>{content}</li>;

const CourseDeleteModal = ({
  isOpen, onClose, catalogId, selectedCourses, catalogName = '',
}: CourseDeleteProps) => {
  const intl = useIntl();
  const deleteCatalogCourses = useDeleteCatalogCourse();

  const handleDelete = () => {
    if (!selectedCourses || selectedCourses.length === 0) {
      return;
    }
    deleteCatalogCourses({ catalogId: catalogId!, data: { catalogCourseIds: selectedCourses } });
    onClose();
  };

  return (
    <ModalLayout
      title={intl.formatMessage(messages['corporate.courses.modal.delete.title'], { count: selectedCourses ? selectedCourses.length : 0 })}
      isOpen={isOpen}
      onClose={onClose}
      actions={(
        <Button onClick={handleDelete} variant="danger">
          {intl.formatMessage(messages['corporate.courses.modal.delete.button.delete'])}
        </Button>
      )}
    >
      <Container className="pt-5">
        <h4>
          { intl.formatMessage(messages['corporate.courses.modal.delete.subtitle'], { count: selectedCourses ? selectedCourses.length : 0, catalogName }) }
        </h4>
        <ul className="mt-4">
          {intl.formatMessage(messages['corporate.courses.modal.delete.description'], { li: ListItem })}
        </ul>
      </Container>
    </ModalLayout>
  );
};

export default CourseDeleteModal;
