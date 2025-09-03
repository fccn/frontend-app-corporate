import { createContext } from 'react';

import { CorporateCatalog } from '@src/app/types';

export interface TCatalogEditionModalContext {
  isOpen: boolean;
  selectedCatalog: CorporateCatalog | null;
  handleChangeSelectedCatalog: (catalogId: number | string | null) => void;
}

export const CatalogEditionModalContext = createContext<TCatalogEditionModalContext>({
  isOpen: false,
  selectedCatalog: null,
  handleChangeSelectedCatalog: () => {},
});
