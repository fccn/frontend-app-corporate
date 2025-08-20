import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';
import { CorporateCatalog, CorporatePartner } from '../app/types';

export const getPartnerCatalogs = async (partnerId?: string): Promise<CorporateCatalog[]> => {
  try {
    const response = await getAuthenticatedHttpClient().get(`/api/catalogs${partnerId ? `/${partnerId}` : ''}`);
    return response.data.catalogs;
  } catch (error) {
    logError(error);
    return [];
  }
};

export const getPartnerDetails = async (partnerId?: string): Promise<CorporatePartner> => {
  try {
    const response = await getAuthenticatedHttpClient().get(`/api/partner${partnerId ? `/${partnerId}` : ''}`);
    return response.data;
  } catch (error) {
    logError(error);
    return {
      code: '0', name: '', logo: '', homepage: '', catalogs: 0, courses: 0, enrollments: 0, certified: 0,
    };
  }
};
