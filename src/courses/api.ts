import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';
import { CorporateCourse, PaginatedResponse } from '@src/app/types';

export const getCourses = async (partnerId: string, catalogId: string, pageIndex, pageSize)
: Promise<PaginatedResponse<CorporateCourse>> => {
  try {
    const url = new URL(`${getConfig().LMS_BASE_URL}/corporate_access/api/v1/partners/${partnerId}/catalogs/${catalogId}/courses/`);
    url.searchParams.append('page', pageIndex);
    url.searchParams.append('page_size', pageSize);
    const { data } = await getAuthenticatedHttpClient().get(url);
    return camelCaseObject(data);
  } catch (error) {
    logError(error);
    return {
      count: 0, next: null, previous: null, results: [], numPages: 0, currentPage: 1, start: 0,
    };
  }
};

export const deleteCourse = async (partnerId: string, catalogId: string, courseId: number) => {
  try {
    await getAuthenticatedHttpClient().delete(`${getConfig().LMS_BASE_URL}/corporate_access/api/v1/partners/${partnerId}/catalogs/${catalogId}/courses/${courseId}/`);
  } catch (error) {
    logError(error);
    throw error;
  }
};
