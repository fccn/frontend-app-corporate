import {
  FC, useContext, useEffect, useMemo, useState,
} from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, useToggle } from '@openedx/paragon';

import ModalLayout from '@src/app/ModalLayout';
import { CatalogEditionModalContext } from '@src/context/CatalogEditionModalContext';

import messages from './messages';

interface CatalogEditModalProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

export const CatalogEditModalProvider: FC<CatalogEditModalProviderProps> = ({ children }) => {
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
        title={`Edit Catalog - ${selectedCatalogId}`}
        isOpen={isOpen}
        onClose={handleCloseModal}
        actions={(
          <Button variant="primary" onClick={handleCloseModal}>
            {intl.formatMessage(messages.saveButton)}
          </Button>
        )}
      >
        <p>
          I&apos;m baby palo santo ugh celiac fashion axe. La croix lo-fi venmo whatever.
          Beard man braid migas single-origin coffee forage ramps. Tumeric messenger
          bag bicycle rights wayfarers, try-hard cronut blue bottle health goth.
          Sriracha tumblr cardigan, cloud bread succulents tumeric copper mug marfa
          semiotics woke next level organic roof party +1 try-hard.
        </p>
      </ModalLayout>

      {children}
    </CatalogEditionModalContext.Provider>
  );
};

export const useCatalogFormModal = () => useContext(CatalogEditionModalContext);
