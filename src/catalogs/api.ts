import { getConfig, camelCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';

import { CorporateCatalog, PaginatedResponse } from '../app/types';

export const getPartnerCatalogs = async (
  partnerId: string,
  page: number,
  pageSize: number,
): Promise<PaginatedResponse<CorporateCatalog>> => {
  try {
    const url = new URL(`${getConfig().LMS_BASE_URL}/corporate_access/api/v1/partners/${partnerId}/catalogs/`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('page_size', pageSize.toString());

    const response = await getAuthenticatedHttpClient().get(url);
    return camelCaseObject(response.data);
  } catch (error) {
    logError(error);
    return {
      next: null,
      previous: null,
      count: 0,
      numPages: 0,
      currentPage: 0,
      start: 0,
      results: [],
    };
  }
};
