import { ActionRow, ModalDialog } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import React, { FC } from 'react';
import messages from './messages';

interface ModalLayoutProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  actions: React.ReactNode | React.ReactNode[];
  children: React.ReactNode;
}

const ModalLayout: FC<ModalLayoutProps> = ({
  title, isOpen, actions, onClose, children,
}) => {
  const intl = useIntl();
  return (
    <ModalDialog
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      hasCloseButton
      isFullscreenOnMobile
      isOverflowVisible={false}
    >
      <ModalDialog.Header className="bg-primary-500">
        <ModalDialog.Title className="text-light-100">
          {title}
        </ModalDialog.Title>
      </ModalDialog.Header>

      <ModalDialog.Body>
        {children}
      </ModalDialog.Body>

      <ModalDialog.Footer className="py-4 px-6">
        <ActionRow>
          <ModalDialog.CloseButton className="px-5" variant="outline-primary">
            {intl.formatMessage(messages.cancelButton)}
          </ModalDialog.CloseButton>

          {actions}
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default ModalLayout;
