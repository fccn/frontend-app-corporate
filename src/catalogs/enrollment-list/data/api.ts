import { camelCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';

import { getCorporateApi } from '@src/constants';
import { CatalogCourseEnrollment, PaginatedResponse } from '@src/types';

export const getCatalogEnrrollements = async (
  catalogId: string | number,
  pageIndex: number,
  pageSize: number,
  ordering?: string,
  search?: string,
  active?: string,
): Promise<PaginatedResponse<CatalogCourseEnrollment>> => {
  try {
    const url = new URL(getCorporateApi(`manage/catalogs/${catalogId}/enrollments/`));
    url.searchParams.append('page', pageIndex.toString());
    url.searchParams.append('page_size', pageSize.toString());
    if (ordering) {
      url.searchParams.append('ordering', ordering);
    }
    if (search) {
      url.searchParams.append('search', search);
    }
    if (active) {
      url.searchParams.append('active', active);
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
