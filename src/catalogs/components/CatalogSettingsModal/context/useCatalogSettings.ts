import { useContext } from 'react';
import { CatalogSettingsModalContext } from './CatalogSettingsModalProvider';

export const useCatalogSettingsModal = () => useContext(CatalogSettingsModalContext);
