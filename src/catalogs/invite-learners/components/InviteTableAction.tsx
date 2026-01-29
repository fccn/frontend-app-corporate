import { useState, useEffect, useRef } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button } from '@openedx/paragon';
import { PersonAddAlt } from '@openedx/paragon/icons';

import { CELERY_STATUS } from '@src/constants';
import { useNotification } from '@src/notification';
import { useBulkInviteTaskStatus } from '../data/hooks';
import { groupInviteErrors } from '../utils';
import InviteLearnersModal from './InviteLearnersModal';

import messages from '../messages';

const InviteLearnerAction = ({ catalogId }: { catalogId: string }) => {
  const intl = useIntl();
  const { showNotification } = useNotification();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteTaskId, setInviteTaskId] = useState<string | null>(null);

  const { data } = useBulkInviteTaskStatus(catalogId, inviteTaskId);

  const handledRef = useRef(false);

  useEffect(() => {
    if (!data || handledRef.current) { return; }

    if (data.status === CELERY_STATUS.FAILURE) {
      handledRef.current = true;
      setInviteTaskId(null);
      return;
    }

    if (data.status === CELERY_STATUS.SUCCESS) {
      handledRef.current = true;
      const { successCount, failed = [] } = data.result || {};

      const createdCount = successCount || 0;
      const { duplicateErrors, otherErrors } = groupInviteErrors(failed);

      if (createdCount > 0) {
        showNotification(
          intl.formatMessage(
            messages['corporate.catalog.invitation.modal.invite.notification.success'],
            { count: createdCount },
          ),
          'success',
        );
      }

      if (duplicateErrors.length > 0) {
        showNotification(
          intl.formatMessage(
            messages['corporate.catalog.invitation.modal.invite.notification.duplicate'],
            { count: duplicateErrors.length },
          ),
          'error',
          10000,
        );
      }

      if (otherErrors.length > 0) {
        showNotification(
          intl.formatMessage(
            messages['corporate.catalog.invitation.modal.invite.notification.error'],
            {
              count: otherErrors.length,
              email: otherErrors.map(e => e.email).join(', '),
            },
          ),
          'error',
        );
      }

      setInviteTaskId(null);
    }
  }, [data, intl, showNotification]);

  return (
    <>
      <Button iconBefore={PersonAddAlt} size="sm" onClick={() => setIsModalOpen(true)}>
        {intl.formatMessage(messages['corporate.catalog.invitation.table.action.add.learner'])}
      </Button>

      <InviteLearnersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        catalogId={catalogId}
        onTaskCreated={(taskId) => {
          handledRef.current = false;
          setInviteTaskId(taskId);
        }}
      />
    </>
  );
};

export default InviteLearnerAction;
