import { camelCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';

import { getCorporateApi } from '@src/constants';
import { PaginatedResponse, Partner } from '@src/types';

export const getPartners = async (
  page: number,
  pageSize: number,
  ordering?: string,
  search?: string,
): Promise<PaginatedResponse<Partner>> => {
  try {
    const url = new URL(getCorporateApi('partners/'));
    url.searchParams.append('page', page.toString());
    url.searchParams.append('page_size', pageSize.toString());
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

export const getPartnerDetails = async (partnerSlug?: string): Promise<Partner | null> => {
  try {
    const url = new URL(getCorporateApi('partners/'));
    url.searchParams.append('slug', partnerSlug || '');
    const response = await getAuthenticatedHttpClient().get(url);
    return camelCaseObject(response.data.results[0]) || null;
  } catch (error) {
    logError(error);
    return null
  }
};
