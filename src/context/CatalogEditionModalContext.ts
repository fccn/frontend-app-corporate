import { createContext } from 'react';

import { CorporateCatalog } from '@src/app/types';

export interface TCatalogEditionModalContext {
  isOpen: boolean;
  selectedCatalog: CorporateCatalog | null;
  queryKeyVariables: (number | string)[];
  handleChangeSelectedCatalog: (
    catalogId: number | string | null,
    queryKeyVariables: (number | string)[]
  ) => void;
}

export const CatalogEditionModalContext = createContext<TCatalogEditionModalContext>({
  isOpen: false,
  selectedCatalog: null,
  queryKeyVariables: [],
  handleChangeSelectedCatalog: () => {},
});
