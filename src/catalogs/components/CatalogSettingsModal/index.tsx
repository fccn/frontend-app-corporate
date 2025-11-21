import { ReactNode, useRef, useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, useToggle } from '@openedx/paragon';

import ModalLayout from '@src/components/ModalLayout';
import { useCatalogDetails, useUpdateCatalog } from '@src/catalogs/data/hooks';
import { CatalogUpdateRequest } from '@src/types';
import CatalogEditForm, { CatalogSettingsFormRef } from './components/CatalogSettingsForm';
import messages from './messages';

interface Props {
  /**
   * Children is a function that receives `openModal`
   * so any child can trigger the modal.
   */
  children: (openModal: (catalogId: string, partnerId: number) => void) => ReactNode;
}

export const CatalogSettingsModal = ({ children }: Props) => {
  const intl = useIntl();

  const [isOpen, open, close] = useToggle(false);
  const [selectedCatalogId, setSelectedCatalogId] = useState<string | null>(null);
  const [partnerId, setPartnerId] = useState<number | null>(null);
  const formRef = useRef<CatalogSettingsFormRef>(null);

  const updateCatalog = useUpdateCatalog();
  const { catalogDetails } = useCatalogDetails({
    partnerId,
    selectedCatalogId,
  });

  const openModal = (catalogId: number | string, partnerId: number) => {
    setSelectedCatalogId(catalogId);
    setPartnerId(partnerId);
    open();
  };

  const handleClose = () => {
    setSelectedCatalogId(null);
    close();
  };

  const handleSaveData = () => {
    if (formRef.current) { formRef.current.submitForm(); }
  };

  const handleFormSubmit = (data: CatalogUpdateRequest) => {
    if (data && selectedCatalogId) {
      updateCatalog({ partnerId, catalogId: selectedCatalogId, data }, {
        onSuccess: () => {
          setSelectedCatalogId(null);
          close();
        },
      });
    }
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
        {selectedCatalogId && (
          <CatalogEditForm
            ref={formRef}
            catalogDetails={catalogDetails}
            onSubmit={handleFormSubmit}
          />
        )}
      </ModalLayout>

      {children(openModal)}
    </>
  );
};
