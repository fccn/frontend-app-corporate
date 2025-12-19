import React, { useState } from 'react';
import ModalLayout from '@src/components/ModalLayout';
import {
  Button, Tab, Tabs, Container,
} from '@openedx/paragon';
import { useAvailableCourses, useAddCoursesToCatalog } from '../../data/hooks';
import AvailableCoursesList from './AvailableCoursesList';

interface CourseAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalogId: string;
}

const CourseAddModal: React.FC<CourseAddModalProps> = ({ isOpen, onClose, catalogId }) => {
  const [selectedCourses, setSelectedCourses] = useState<Set<number>>(new Set());
  const { data: allCourses = { base: [], organization: [] }, isLoading: loadingAll } = useAvailableCourses(catalogId, isOpen);

  const addMutation = useAddCoursesToCatalog();

  const handleSave = () => {
    addMutation.mutate({ catalogId, courseIds: Array.from(selectedCourses) });
  };

  return (
    <ModalLayout
      title="Add Courses"
      isOpen={isOpen}
      onClose={onClose}
      actions={(
        <Button onClick={handleSave} disabled={addMutation.isPending}>
          Save
        </Button>
      )}
    >
      <Container className="min-vh-100">
        <Tabs className="mt-4">
          <Tab eventKey="all" title="Base Catalog Courses">
            {loadingAll ? <p>Loading...</p>
              : (
                <AvailableCoursesList
                  courses={allCourses.base}
                  selectedCourses={selectedCourses}
                  setSelectedCourses={setSelectedCourses}
                />
              )}
          </Tab>
          <Tab eventKey="current" title="My Organization's Courses">
            {loadingAll ? <p>Loading...</p>
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

export default CourseAddModal;
