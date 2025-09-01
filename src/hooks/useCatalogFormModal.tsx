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
  /** Saved in case needed to fetch catalog details from cache */
  const [queryKeyVariables, setQueryKeyVariables] = useState<(number | string)[]>([]);

  /**
   * Called when a catalog is selected from the list.
   * It saves the selected catalog ID and the query key variables (page index and page size)
   * needed to fetch the catalog details from cache.
   *
   * @param {number|string|null} catalogId The ID of the selected catalog.
   * @param {(number|string)[]} queryKey The query key variables (page index and page size)
   * needed to fetch the catalog details from cache.
   */
  const handleChangeSelectedCatalog = (catalogId: number | string | null, queryKey: (number | string)[]) => {
    setSelectedCatalogId(catalogId);
    setQueryKeyVariables(queryKey);
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
      queryKeyVariables,
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
        <CatalogEditForm selectedCatalog={selectedCatalogId} queryKeyVariables={queryKeyVariables} />
      </ModalLayout>

      {children}
    </CatalogEditionModalContext.Provider>
  );
};

export const useCatalogFormModal = () => useContext(CatalogEditionModalContext);
