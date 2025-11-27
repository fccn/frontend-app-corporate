import { ReactNode, useRef, useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, useToggle } from '@openedx/paragon';

import ModalLayout from '@src/components/ModalLayout';
import { useCatalogDetails, useUpdateCatalog } from '@src/catalogs/data/hooks';
import { Catalog, CatalogUpdateRequest } from '@src/types';
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
  const [selectedCatalogId, setSelectedCatalogId] = useState<string>('');
  const [relatedpartnerId, setRelatedPartnerId] = useState<number>(NaN);
  const formRef = useRef<CatalogSettingsFormRef>(null);

  const updateCatalog = useUpdateCatalog();
  const { catalogDetails } = useCatalogDetails({
    partnerId: relatedpartnerId,
    catalogId: selectedCatalogId,
  });

  const openModal = (catalogId: string, partnerId: number) => {
    setSelectedCatalogId(catalogId);
    setRelatedPartnerId(partnerId);
    open();
  };

  const handleClose = () => {
    setSelectedCatalogId('');
    close();
  };

  const handleSaveData = () => {
    if (formRef.current) { formRef.current.submitForm(); }
  };

  const handleFormSubmit = (data: CatalogUpdateRequest) => {
    if (data && selectedCatalogId) {
      updateCatalog({ partnerId: relatedpartnerId, catalogId: selectedCatalogId, data }, {
        onSuccess: () => {
          setSelectedCatalogId('');
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
            catalogDetails={catalogDetails as Catalog}
            onSubmit={handleFormSubmit}
          />
        )}
      </ModalLayout>

      {children(openModal)}
    </>
  );
};
