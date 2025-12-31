import { camelCaseObject, snakeCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';
import { Course, CourseRun, PaginatedResponse } from '@src/types';
import { getCorporateApi } from '@src/constants';

export const getCourses = async (catalogId: string, pageIndex, pageSize)
: Promise<PaginatedResponse<Course>> => {
  try {
    const url = new URL(getCorporateApi(`manage/catalogs/${catalogId}/courses/`));
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

export const getCourseDetails = async (catalogId: string, courseId: string): Promise<Course | null> => {
  try {
    const url = getCorporateApi(`manage/catalogs/${catalogId}/courses/${courseId}/`);
    const { data } = await getAuthenticatedHttpClient().get(url);
    return camelCaseObject(data);
  } catch (error) {
    logError(error);
    return null;
  }
};

export const deleteCourse = async (catalogId: string, data: { catalogCourseIds: number[] }) => {
  try {
    const url = getCorporateApi(`manage/catalogs/${catalogId}/remove_courses/`);
    await getAuthenticatedHttpClient().post(url, snakeCaseObject(data));
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const updateCourse = async (catalogId: string, courseId: string, data: { position: number }) => {
  try {
    await getAuthenticatedHttpClient().patch(getCorporateApi(`manage/catalogs/${catalogId}/courses/${courseId}/`), data);
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const getAvailableCourses = async (catalogId: string): Promise<{
  base: CourseRun[]; organization: CourseRun[];
}> => {
  try {
    const url = getCorporateApi(`manage/catalogs/${catalogId}/available_courses/`);
    const response = await getAuthenticatedHttpClient().get(url);
    return camelCaseObject(response.data);
  } catch (error) {
    logError(error);
    return { base: [], organization: [] };
  }
};

export const addCoursesToCatalog = async (catalogId: string, data: { courseIds: string[] }): Promise<void> => {
  try {
    const url = getCorporateApi(`manage/catalogs/${catalogId}/add_courses/`);
    await getAuthenticatedHttpClient().post(url, snakeCaseObject(data));
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const getCourseLearnersStatus = async (catalogId: string, courseId: string, pageIndex, pageSize)
: Promise<PaginatedResponse<any>> => {
  try {
    const url = new URL(getCorporateApi(`manage/catalogs/${catalogId}/courses/${courseId}/enrollments/`));
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
