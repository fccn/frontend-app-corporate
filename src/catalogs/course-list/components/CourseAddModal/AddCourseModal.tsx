import { useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import ModalLayout from '@src/components/ModalLayout';
import {
  Button, Tab, Tabs, Container,
} from '@openedx/paragon';
import Loader from '@src/components/Loader';
import { useNotification } from '@src/notification';
import { useAvailableCourses, useAddCoursesToCatalog } from '../../data/hooks';
import AvailableCoursesList from './AvailableCoursesList';

import messages from '../../messages';

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalogId: string;
}

const AddCourseModal = ({ isOpen, onClose, catalogId }: AddCourseModalProps) => {
  const intl = useIntl();
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
  const { showNotification } = useNotification();
  const {
    data: allCourses = {
      base: [],
      organization: [],
    }, isLoading: loadingAll,
  } = useAvailableCourses(catalogId, isOpen);

  const addCourses = useAddCoursesToCatalog();

  const handleSave = () => {
    addCourses.mutate(
      { catalogId, courseIds: Array.from(selectedCourses) },
      {
        onSuccess: (data) => {
          showNotification(
            intl.formatMessage(messages['corporate.courses.modal.add.notification.success'], { count: data.length }),
            'success',
          );
          setSelectedCourses(new Set());
          onClose();
        },
        onError: () => {
          showNotification(
            intl.formatMessage(messages['corporate.courses.modal.add.notification.error']),
            'error',
          );
        },
      },
    );
  };

  return (
    <ModalLayout
      title={intl.formatMessage(messages['corporate.courses.modal.add.title'])}
      isOpen={isOpen}
      onClose={onClose}
      actions={(
        <Button onClick={handleSave} disabled={addCourses.isPending}>
          {intl.formatMessage(messages['corporate.courses.modal.add.button.add'])}
        </Button>
      )}
    >
      <Container className="min-vh-100">
        <Tabs className="mt-4">
          <Tab eventKey="all" title="Base Catalog Courses">
            {loadingAll ? <Loader />
              : (
                <AvailableCoursesList
                  courses={allCourses.base}
                  selectedCourses={selectedCourses}
                  setSelectedCourses={setSelectedCourses}
                />
              )}
          </Tab>
          <Tab eventKey="current" title="My Organization's Courses">
            {loadingAll ? <Loader />
              : (
                <AvailableCoursesList
                  courses={allCourses.organization}
                  selectedCourses={selectedCourses}
                  setSelectedCourses={setSelectedCourses}
                />
              )}
          </Tab>
        </Tabs>
      </Container>
    </ModalLayout>
  );
};

export default AddCourseModal;
