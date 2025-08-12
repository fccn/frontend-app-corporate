import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';

export const getCourses = async (catalogId) => {
  try {
    const { data } = getAuthenticatedHttpClient().get(`/api/courses/${catalogId}`);
    return data.courses;
  } catch (error) {
    logError(error);
    return [];
  }
};

const deleteCourse = async (courseId: number) => {
  try {
    await getAuthenticatedHttpClient().delete(`/api/courses/${courseId}`);
  } catch (error) {
    logError(error);
    throw error;
  }
}