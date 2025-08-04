import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';
import { CorporatePartner } from '../app/types';

export const getPartners = async (): Promise<CorporatePartner[] > => {
  try {
    const response = await getAuthenticatedHttpClient().get('/api/partners');
    return response.data.partners;
  } catch (error) {
    logError(error);
    return [];
  }
};
