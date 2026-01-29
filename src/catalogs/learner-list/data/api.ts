import { camelCaseObject, snakeCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';

import { Learner, PaginatedResponse } from '@src/types';
import { getCorporateApi } from '@src/constants';

export const getCatalogsLearners = async (
  catalogId: string | number,
  pageIndex: number,
  pageSize: number,
  ordering?: string,
  search?: string,
  active?: string,
): Promise<PaginatedResponse<Learner>> => {
  try {
    const url = new URL(getCorporateApi(`manage/catalogs/${catalogId}/learners/`));
    url.searchParams.append('page', pageIndex.toString());
    url.searchParams.append('page_size', pageSize.toString());
    if (ordering) {
      url.searchParams.append('ordering', ordering);
    }
    if (search) {
      url.searchParams.append('search', search);
    }
    if (active && active !== 'all') {
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

export const deleteLearnersFromCatalog = async (
  catalogId: string,
  data: { learnerIds: number[] },
): Promise<{
  taskId: string;
  status: string;
}> => {
  try {
    const url = getCorporateApi(`manage/catalogs/${catalogId}/invitations/bulk_remove/`);
    const response = await getAuthenticatedHttpClient().post(url, snakeCaseObject(data));
    return camelCaseObject(response.data);
  } catch (error) {
    logError(error);
    throw error;
  }
};
