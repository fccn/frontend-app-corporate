import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';
import { CorporateCourse, PaginatedResponse } from '@src/app/types';

export const getCourses = async (partnerId:string, catalogId:string):Promise<PaginatedResponse<CorporateCourse>> => {
  try {
    const { data } = await getAuthenticatedHttpClient().get(`${getConfig().LMS_BASE_URL}/corporate_access/api/v1/partners/${partnerId}/catalogs/${catalogId}/courses/`);
    return camelCaseObject(data);
  } catch (error) {
    logError(error);
    return { count: 0, next: null, previous: null, results: []};
  }
};

export const deleteCourse = async (partnerId:string, catalogId:string, courseId: number) => {
  try {
    await getAuthenticatedHttpClient().delete(`/corporate_access/api/v1/partners/${partnerId}/catalogs/${catalogId}/courses/${courseId}/`);
  } catch (error) {
    logError(error);
    throw error;
  }
}