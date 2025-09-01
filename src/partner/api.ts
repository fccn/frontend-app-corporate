import { getConfig, camelCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';

import { CorporatePartner } from '../app/types';

export const getPartners = async (): Promise<CorporatePartner[]> => {
  const url = `${getConfig().LMS_BASE_URL}/corporate_access/api/v1/partners/`;
  try {
    const response = await getAuthenticatedHttpClient().get(url);
    return camelCaseObject(response.data.results);
  } catch (error) {
    logError(error);
    return [];
  }
};
