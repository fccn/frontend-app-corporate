import { camelCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';

import { getCorporateApiBase } from '@src/constants';
import { CorporateCatalog, PaginatedResponse } from '../../types';

export const getPartnerCatalogs = async (
  partnerId: string,
  page: number,
  pageSize: number,
): Promise<PaginatedResponse<CorporateCatalog>> => {
  try {
    const url = new URL(`${getCorporateApiBase()}${partnerId}/catalogs/`);
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

export const getCatalogDetails = async (
  partnerId: string,
  catalogId: string | number,
): Promise<CorporateCatalog | null> => {
  try {
    const url = `${getCorporateApiBase()}${partnerId}/catalogs/${catalogId}/`;
    const response = await getAuthenticatedHttpClient().get(url);
    return camelCaseObject(response.data);
  } catch (error) {
    logError(error);
    return null;
  }
};
