import { camelCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';

import { getCorporateApi } from '@src/constants';
import { Catalog, Course } from '@src/types';

export const getCatalogDetails = async (
  catalogSlug: string | undefined,
): Promise<Catalog | null> => {
  try {
    const url = new URL(getCorporateApi('manage/catalogs/'));
    url.searchParams.append('search', catalogSlug || '');
    const response = await getAuthenticatedHttpClient().get(url);
    return camelCaseObject(response.data.results[0]) || null;
  } catch (error) {
    logError(error);
    return null;
  }
};

export const getCourseDetails = async (catalogId: string, courseId: string): Promise<Course | null> => {
  try {
    const url = getCorporateApi(`manage/catalogs/${catalogId}/courses/${courseId}/`);
    const { data } = await getAuthenticatedHttpClient().get(url);
    return camelCaseObject(data) || null;
  } catch (error) {
    logError(error);
    return null;
  }
};
