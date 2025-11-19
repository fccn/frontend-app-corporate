import { useEffect, useMemo, useState, useRef, useCallback, createContext } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, useToggle } from '@openedx/paragon';

import ModalLayout from '@src/components/ModalLayout';

import { CatalogUpdateRequest, Catalog } from '@src/types';
import CatalogSettingsForm, { CatalogSettingsFormRef } from '../components/CatalogSettingsForm';
import messages from '../messages';
import { useCatalogDetails, useUpdateCatalog } from '@src/catalogs/data/hooks';


export interface CatalogSettingsModalContext {
  isModalOpen: boolean;
  partnerId: number | null,
  catalogId: string | null;
  catalogDetails?: Catalog;
  handleChangeSelectedCatalog: (catalogId: | string | null) => void;
  registerRefetchCallback: (callback: () => void) => void;
}

export const CatalogSettingsModalContext = createContext<CatalogSettingsModalContext>({
  isModalOpen: false,
  partnerId: null,
  catalogId: null,
  handleChangeSelectedCatalog: () => { },
  registerRefetchCallback: () => { },
});


interface CatalogSettingsModalProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

export const CatalogSettingsModalProvider = ({ children }: CatalogSettingsModalProviderProps) => {
  const intl = useIntl();
  const formRef = useRef<CatalogSettingsFormRef>(null);

  const [isModalOpen, openModal, closeModal] = useToggle(false);
  const [selectedCatalogId, setSelectedCatalogId] = useState<string | null>(null);
  const [partnerId, setPartnerId] = useState<number | null>(null);
  const updateCatalog = useUpdateCatalog();
  const { catalogDetails } = useCatalogDetails({
    partnerId,
    selectedCatalogId,
  });
  
  const handleChangeSelectedCatalog = (catalogId: string | null, partnerId: number | null) => {
    setPartnerId(partnerId);
    setSelectedCatalogId(catalogId);
  };
  
  const handleSaveData = () => {
    if (formRef.current) { formRef.current.submitForm(); }
  };
  
  const handleFormSubmit = (data: CatalogUpdateRequest) => {
    if (data && selectedCatalogId) {
      updateCatalog({ partnerId, catalogId: selectedCatalogId, data }, {
        onSuccess: () => {
          setSelectedCatalogId(null);
        },
      });
    }
  };
  useEffect(() => {
    if (selectedCatalogId && catalogDetails) {
      openModal();
    } else {
      closeModal();
    }
  }, [selectedCatalogId, catalogDetails]);

  const value = useMemo(
    () => ({
      isModalOpen,
      selectedCatalog: catalogDetails,
      handleChangeSelectedCatalog,
    }),
    [isModalOpen, catalogDetails],
  );

  return (
    <CatalogSettingsModalContext.Provider value={value}>
      <ModalLayout
        title={intl.formatMessage(messages['corporate.catalog.settings.modal.title'])}
        isOpen={isModalOpen}
        onClose={() => setSelectedCatalogId(null)}
        actions={(
          <Button className="px-5" variant="primary" onClick={handleSaveData}>
            {intl.formatMessage(messages['corporate.catalog.form.save.button'])}
          </Button>
        )}
      >
        {catalogDetails && (
          <CatalogSettingsForm
            ref={formRef}
            catalogDetails={catalogDetails}
            onSubmit={handleFormSubmit}
          />
        )}
      </ModalLayout>

      {children}
    </CatalogSettingsModalContext.Provider>
  );
};
export default CatalogSettingsModalProvider;