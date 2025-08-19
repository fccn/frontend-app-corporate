import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';
import { CorporateCatalog, CorporateDetails } from '../app/types';

export const getPartnerCatalogs = async (partnerId?: string): Promise<CorporateCatalog[]> => {
  try {
    const response = await getAuthenticatedHttpClient().get(`/api/catalogs${partnerId ? `/${partnerId}` : ''}`);
    return response.data.catalogs;
  } catch (error) {
    logError(error);
    return [];
  }
};

export const getPartnerDetails = async (partnerId?: string): Promise<CorporateDetails> => {
  try {
    const response = await getAuthenticatedHttpClient().get(`/api/partner${partnerId ? `/${partnerId}` : ''}`);
    return response.data;
  } catch (error) {
    logError(error);
    return {
      name: '', image: '', catalogsQuantity: 0, coursesQuantity: 0, enrollmentsQuantity: 0, certifiedLearnersQuantity: 0,
    };
  }
};
