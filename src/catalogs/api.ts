import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';
import { CorporateCatalog } from '../app/types';

export const getPartnerCatalogs = async (): Promise<CorporateCatalog[]> => {
  try {
    const response = await getAuthenticatedHttpClient().get('/api/catalogs');
    return response.data.catalogs;
  } catch (error) {
    logError(error);
    return [];
  }
};
