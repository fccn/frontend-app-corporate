import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Container } from '@openedx/paragon';

import ModalLayout from '@src/components/ModalLayout';
import { useNotification } from '@src/notification';
import { useDeleteCatalogCourse } from '../data/hooks';

import messages from '../messages';

interface CourseDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  catalogId: string;
  catalogName: string;
  selectedCourses: any[];
  courseName?: string;
}

const ListItem = (content: string) => <li key={content}>{content}</li>;

const CourseDeleteModal = ({
  isOpen, onClose, catalogId, selectedCourses, catalogName = '', courseName = '',
}: CourseDeleteProps) => {
  const intl = useIntl();
  const { showNotification } = useNotification();
  const deleteCatalogCourses = useDeleteCatalogCourse();

  const handleDelete = () => {
    if (!selectedCourses || selectedCourses.length === 0) {
      return;
    }
    deleteCatalogCourses.mutate(
      { catalogId: catalogId!, data: { catalogCourseIds: selectedCourses } },
      {
        onSuccess: (data) => {
          showNotification(
            intl.formatMessage(
              messages['corporate.courses.modal.delete.notification.success'],
              { count: data.deletedCount },
            ),
            'success',
          );
          onClose();
        },
        onError: () => {
          showNotification(
            intl.formatMessage(
              messages['corporate.courses.modal.delete.notification.error'],
            ),
            'error',
          );
          onClose();
        },
      },
    );
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
          {intl.formatMessage(messages['corporate.courses.modal.delete.subtitle'], { count: selectedCourses ? selectedCourses.length : 0, catalogName, courseName })}
        </h4>
        <ul className="mt-4">
          {intl.formatMessage(messages['corporate.courses.modal.delete.description'], { li: ListItem })}
        </ul>
      </Container>
    </ModalLayout>
  );
};

export default CourseDeleteModal;
