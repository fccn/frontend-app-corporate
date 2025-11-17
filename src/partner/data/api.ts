import { camelCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';

import { getCorporateApiBase } from '@src/constants';
import { PaginatedResponse, Partner } from '@src/types';

export const getPartners = async (): Promise<PaginatedResponse<Partner>> => {
  const url = `${getCorporateApiBase()}`;
  try {
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

export const getPartnerDetails = async (partnerId?: string): Promise<Partner> => {
  try {
    const url = `${getCorporateApiBase()}${partnerId}/`;
    const response = await getAuthenticatedHttpClient().get(url);
    return camelCaseObject(response.data);
  } catch (error) {
    logError(error);
    return {
      id: 0,
      slug: '',
      name: '',
      logo: '',
      homepageUrl: '',
      catalogs: 0,
      courses: 0,
      enrollments: 0,
      certified: 0,
    };
  }
};
