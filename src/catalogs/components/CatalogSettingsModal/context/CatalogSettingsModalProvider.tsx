import { createContext, useEffect, useMemo, useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, useToggle } from '@openedx/paragon';

import { CorporateCatalog } from '@src/types';
import ModalLayout from '@src/components/ModalLayout';

import CatalogEditForm from '../components/CatalogSettingsForm';
import messages from '../messages';

export interface TCatalogESettingsModalContext {
  isOpen: boolean;
  selectedCatalog: CorporateCatalog | null;
  handleChangeSelectedCatalog: (catalogId: number | string | null) => void;
}

export const CatalogSettingsModalContext = createContext<TCatalogESettingsModalContext>({
  isOpen: false,
  selectedCatalog: null,
  handleChangeSelectedCatalog: () => {},
});

interface CatalogSettingsModalProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

export const CatalogSettingsModalProvider = ({ children }:CatalogSettingsModalProviderProps) => {
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
    <CatalogSettingsModalContext.Provider value={value}>
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
        {selectedCatalogId && <CatalogEditForm selectedCatalog={selectedCatalogId} />}
      </ModalLayout>

      {children}
    </CatalogSettingsModalContext.Provider>
  );
};