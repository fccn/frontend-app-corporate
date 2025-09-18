import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';
import { CorporateCourse, PaginatedResponse } from '@src/app/types';

export const getCourses = async (
  partnerId: string,
  catalogId: string,
  pageIndex?: number,
  pageSize?: number,
  courseOverview?: string,
): Promise<PaginatedResponse<CorporateCourse>> => {
  try {
    const url = new URL(`${getConfig().LMS_BASE_URL}/corporate_access/api/v1/partners/${partnerId}/catalogs/${catalogId}/courses/`);
    if (courseOverview) { url.searchParams.append('course_overview', courseOverview); }
    if (pageIndex) { url.searchParams.append('page', String(pageIndex)); }
    if (pageSize) { url.searchParams.append('page_size', String(pageSize)); }

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

export const getCourseDetails = async (partnerId: string, catalogId: string, courseId: number)
: Promise<CorporateCourse | null> => {
  try {
    const { data } = await getAuthenticatedHttpClient().get(`${getConfig().LMS_BASE_URL}/corporate_access/api/v1/partners/${partnerId}/catalogs/${catalogId}/courses/${courseId}/`);
    return camelCaseObject(data);
  } catch (error) {
    logError(error);
    return null;
  }
};
