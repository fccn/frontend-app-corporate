import { ReactNode } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { ActionRow, ModalDialog } from '@openedx/paragon';

import messages from './messages';

interface ModalLayoutProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  actions: ReactNode | ReactNode[];
  children: ReactNode;
}

const ModalLayout = ({
  title, isOpen, actions, onClose, children,
}: ModalLayoutProps) => {
  const intl = useIntl();
  return (
    <ModalDialog
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      variant='dark'
      hasCloseButton
      isFullscreenOnMobile
      isOverflowVisible={false}
    >
      <ModalDialog.Header className="bg-primary-500">
        <ModalDialog.Title>
          {title}
        </ModalDialog.Title>
      </ModalDialog.Header>

      <ModalDialog.Body>
        {children}
      </ModalDialog.Body>

      <ModalDialog.Footer className="py-4 px-5">
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
