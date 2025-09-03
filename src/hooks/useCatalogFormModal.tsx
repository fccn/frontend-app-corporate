import {
  FC, useContext, useEffect, useMemo, useState,
} from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, useToggle } from '@openedx/paragon';

import ModalLayout from '@src/app/ModalLayout';
import { CatalogEditionModalContext } from '@src/context/CatalogEditionModalContext';

import CatalogEditForm from '@src/app/CatalogEditForm';
import messages from './messages';

interface CatalogEditModalProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

export const CatalogEditModalProvider: FC<CatalogEditModalProviderProps> = ({ children }) => {
  const intl = useIntl();

  const [isOpen, open, close] = useToggle(false);
  const [selectedCatalogId, setSelectedCatalogId] = useState<number | string | null>(null);

  /**
   * Called when a catalog is selected from the list.
   * Opens the edit modal for the selected catalog.
   *
   * @param {number|string|null} catalogId The ID of the selected catalog.
   */
  const handleChangeSelectedCatalog = (catalogId: number | string | null) => {
    setSelectedCatalogId(catalogId);
  };

  const handleCloseModal = () => {
    setSelectedCatalogId(null);
    close();
  };

  useEffect(() => {
    if (selectedCatalogId) { open(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCatalogId]);

  const value = useMemo(
    () => ({
      isOpen,
      selectedCatalog: null,
      handleChangeSelectedCatalog,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isOpen],
  );
  return (
    <CatalogEditionModalContext.Provider value={value}>
      <ModalLayout
        title={intl.formatMessage(messages.editCatalogTitle)}
        isOpen={isOpen}
        onClose={handleCloseModal}
        actions={(
          <Button className="px-5" variant="primary" onClick={handleCloseModal}>
            {intl.formatMessage(messages.saveButton)}
          </Button>
        )}
      >
        <CatalogEditForm selectedCatalog={selectedCatalogId} />
      </ModalLayout>

      {children}
    </CatalogEditionModalContext.Provider>
  );
};

export const useCatalogFormModal = () => useContext(CatalogEditionModalContext);
