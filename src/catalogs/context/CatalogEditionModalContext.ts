import { createContext } from 'react';

import { CorporateCatalog } from '@src/app/types';

export interface TCatalogEditionModalContext {
  isModalOpen: boolean;
  selectedCatalog: CorporateCatalog | null;
  handleChangeSelectedCatalog: (catalogId: number | string | null) => void;
  registerRefetchCallback: (callback: () => void) => void;
}

export const CatalogEditionModalContext = createContext<TCatalogEditionModalContext>({
  isModalOpen: false,
  selectedCatalog: null,
  handleChangeSelectedCatalog: () => {},
  registerRefetchCallback: () => {},
});
