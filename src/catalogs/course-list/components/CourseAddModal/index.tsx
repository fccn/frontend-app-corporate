import { useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';

import { Button } from '@openedx/paragon';
import { Add } from '@openedx/paragon/icons';

import messages from '../../messages';
import AddCourseModal from './AddCourseModal';

const CourseAddModal = ({ catalogId }: { catalogId: string }) => {
  const intl = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button iconBefore={Add} size="sm" onClick={() => setIsModalOpen(true)}>
        {intl.formatMessage(messages['corporate.courses.table.action.add.course'])}
      </Button>
      <AddCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        catalogId={catalogId!}
      />
    </>
  );
};

export default CourseAddModal;
