import { camelCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';
import { LearnerStatus, PaginatedResponse } from '@src/types';
import { getCorporateApi } from '@src/constants';

export const getCourseLearners = async (
  catalogId: string,
  courseId: string,
  pageIndex: number,
  pageSize: number,
  ordering?: string,
  search?: string,
): Promise<PaginatedResponse<LearnerStatus>> => {
  try {
    const url = new URL(getCorporateApi(`manage/catalogs/${catalogId}/courses/${courseId}/enrollments/?active=true`));
    url.searchParams.append('page', pageIndex.toString());
    url.searchParams.append('page_size', pageSize.toString());
    if (ordering) {
      url.searchParams.append('ordering', ordering);
    }
    if (search) {
      url.searchParams.append('search', search);
    }
    const { data } = await getAuthenticatedHttpClient().get(url);
    return camelCaseObject(data);
  } catch (error) {
    logError(error);
    return {
      count: 0, next: null, previous: null, results: [], numPages: 0, currentPage: 1, start: 0,
    };
  }
};
