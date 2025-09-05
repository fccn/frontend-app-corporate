import {
  FC, useContext, useEffect, useMemo, useState,
} from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, useToggle } from '@openedx/paragon';

import ModalLayout from '@src/app/ModalLayout';

import CatalogEditForm from './components/CatalogEditForm';
import messages from './messages';
import { CatalogEditionModalContext } from './context/CatalogEditionModalContext';

interface CatalogEditionModalProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

export const CatalogEditionModalProvider: FC<CatalogEditionModalProviderProps> = ({ children }) => {
  const intl = useIntl();

  const [isOpen, open, close] = useToggle(false);
  const [selectedCatalogId, setSelectedCatalogId] = useState<number | string | null>(null);

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

export const useCatalogEditionModal = () => useContext(CatalogEditionModalContext);
