import {
  FC, useContext, useEffect, useMemo, useState, useRef, useCallback,
} from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, useToggle } from '@openedx/paragon';

import ModalLayout from '@src/app/ModalLayout';

import { CorporateCatalogForm } from '@src/app/types';
import { useParams } from 'wouter';
import CatalogEditForm, { CatalogEditFormRef } from './components/CatalogEditForm';
import messages from './messages';
import { CatalogEditionModalContext } from './context/CatalogEditionModalContext';
import { useCatalogDetails, useUpdateCatalog } from './hooks';

interface CatalogEditionModalProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

export const CatalogEditionModalProvider: FC<CatalogEditionModalProviderProps> = ({ children }) => {
  const intl = useIntl();

  const { partnerId } = useParams<{ partnerId: string }>();
  const formRef = useRef<CatalogEditFormRef>(null);

  const [isModalOpen, openModal, closeModal] = useToggle(false);
  const [selectedCatalogId, setSelectedCatalogId] = useState<string | null>(null);
  const [refetchCallback, setRefetchCallback] = useState<(() => void) | null>(null);

  const updateCatalog = useUpdateCatalog();
  const { catalogDetails, refetchCatalogDetails } = useCatalogDetails({
    partnerId,
    selectedCatalog: selectedCatalogId,
  });

  const handleChangeSelectedCatalog = (catalogId: string | null) => {
    setSelectedCatalogId(catalogId);
  };

  const handleCloseModal = () => {
    closeModal();
    setSelectedCatalogId(null);
  };

  const registerRefetchCallback = useCallback((callback: () => void) => {
    setRefetchCallback(() => callback);
  }, []);

  const handleSaveData = () => {
    if (formRef.current) { formRef.current.submitForm(); }
  };

  const handleFormSubmit = (data: CorporateCatalogForm) => {
    if (data && selectedCatalogId) {
      updateCatalog({ partnerId, catalogId: selectedCatalogId, data }, {
        onSuccess: () => {
          if (refetchCallback) { refetchCallback(); }
          refetchCatalogDetails();
          handleCloseModal();
        },
      });
    }
  };

  useEffect(() => {
    if (selectedCatalogId) { openModal(); }
    if (!selectedCatalogId) { handleCloseModal(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCatalogId]);

  const value = useMemo(
    () => ({
      isModalOpen,
      selectedCatalog: catalogDetails,
      handleChangeSelectedCatalog,
      registerRefetchCallback,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isModalOpen, catalogDetails, registerRefetchCallback],
  );
  return (
    <CatalogEditionModalContext.Provider value={value}>
      <ModalLayout
        title={intl.formatMessage(messages.editCatalogTitle)}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        actions={(
          <Button className="px-5" variant="primary" onClick={handleSaveData}>
            {intl.formatMessage(messages.saveButton)}
          </Button>
        )}
      >
        {catalogDetails && (
          <CatalogEditForm
            ref={formRef}
            catalogDetails={catalogDetails}
            onSubmit={handleFormSubmit}
          />
        )}
      </ModalLayout>

      {children}
    </CatalogEditionModalContext.Provider>
  );
};

export const useCatalogEditionModal = () => useContext(CatalogEditionModalContext);
