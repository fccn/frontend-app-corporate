import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';
import { Learner, PaginatedResponse } from '../app/types';

export const getCourseEnrollments = async (
  partnerId: string,
  catalogId: string,
  courseId: string,
  page: number,
  pageSize: number,
): Promise<PaginatedResponse<Learner>> => {
  try {
    const url = `${getConfig().LMS_BASE_URL}/corporate_access/api/v1/partners/${partnerId}/catalogs/${catalogId}/courses/${courseId}/enrollments/?page=${page}&page_size=${pageSize}`;
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
