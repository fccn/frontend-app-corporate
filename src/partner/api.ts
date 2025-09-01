import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';

import { CorporatePartner, ApiResponse } from '../app/types';

interface PartnersApiResponse extends ApiResponse {
  results: CorporatePartner[];
}
export const getPartners = async ({ pageSize, pageIndex }): Promise<PartnersApiResponse> => {
  const url = `${getConfig().LMS_BASE_URL}/corporate_access/api/v1/partners/?page_size=${pageSize}&page=${pageIndex}`;
  try {
    const response = await getAuthenticatedHttpClient().get(url);
    return response.data;
  } catch (error) {
    logError(error);
    return { results: [], count: 0 };
  }
};
