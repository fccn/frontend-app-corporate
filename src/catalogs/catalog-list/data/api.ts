import { camelCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';

import { getCorporateApi } from '@src/constants';
import { Catalog, PaginatedResponse } from '@src/types';

export const getPartnerCatalogs = async (
  partnerId: number,
  page: number,
  pageSize: number,
  ordering?: string,
  search?: string,
): Promise<PaginatedResponse<Catalog>> => {
  try {
    const url = new URL(getCorporateApi('manage/catalogs/'));
    url.searchParams.append('page', page.toString());
    url.searchParams.append('page_size', pageSize.toString());
    url.searchParams.append('partner', partnerId.toString());
    if (ordering) {
      url.searchParams.append('ordering', ordering);
    }
    if (search) {
      url.searchParams.append('search', search);
    }
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
