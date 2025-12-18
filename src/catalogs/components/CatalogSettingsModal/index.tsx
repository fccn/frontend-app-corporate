import { ReactNode, useRef, useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, useToggle } from '@openedx/paragon';

import ModalLayout from '@src/components/ModalLayout';
import CatalogSettingsForm, { CatalogSettingsFormRef } from './components/CatalogSettingsForm';
import messages from './messages';

interface Props {
  /**
   * Children is a function that receives `openModal`
   * so any child can trigger the modal.
   */
  children: (openModal: (catalogSlug: string) => void) => ReactNode;
}

export const CatalogSettingsModal = ({ children }: Props) => {
  const intl = useIntl();

  const [isOpen, open, close] = useToggle(false);
  const [selectedCatalogSlug, setSelectedCatalogSlug] = useState<string>('');
  const formRef = useRef<CatalogSettingsFormRef>(null);

  const openModal = (catalogSlug: string) => {
    setSelectedCatalogSlug(catalogSlug);
    open();
  };

  const handleClose = () => {
    setSelectedCatalogSlug('');
    close();
  };

  const handleSaveData = () => {
    if (formRef.current) { formRef.current.submitForm(); }
  };

  return (
    <>
      <ModalLayout
        title={intl.formatMessage(messages['corporate.catalog.settings.modal.title'])}
        isOpen={isOpen}
        onClose={handleClose}
        actions={(
          <Button className="px-5" variant="primary" onClick={handleSaveData}>
            {intl.formatMessage(messages['corporate.catalog.form.save.button'])}
          </Button>
        )}
      >
        {selectedCatalogSlug && (
          <CatalogSettingsForm
            ref={formRef}
            catalogSlug={selectedCatalogSlug}
            onSuccess={handleClose}
          />
        )}
      </ModalLayout>

      {children(openModal)}
    </>
  );
};
