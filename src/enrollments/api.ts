import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';
import { Learner, PaginatedResponse } from '../app/types';

export const getCourseEnrollments = async ({
  partnerId, catalogId, courseId, pageIndex, pageSize,
}:{
  partnerId: string,
  catalogId: string,
  courseId: number,
  pageIndex?: number,
  pageSize?: number,
}): Promise<PaginatedResponse<Learner>> => {
  try {
    const url = new URL(`${getConfig().LMS_BASE_URL}/corporate_access/api/v1/partners/${partnerId}/catalogs/${catalogId}/courses/${courseId}/enrollments/`);
    if (pageIndex) { url.searchParams.append('page', String(pageIndex)); }
    if (pageSize) { url.searchParams.append('page_size', String(pageSize)); }

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
