import { camelCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';

import { getCorporateApiBase } from '@src/constants';
import { CorporatePartner } from '../types';

export const getPartners = async (): Promise<CorporatePartner[]> => {
  const url = `${getCorporateApiBase()}`;
  try {
    const response = await getAuthenticatedHttpClient().get(url);
    return camelCaseObject(response.data.results);
  } catch (error) {
    logError(error);
    return [];
  }
};

export const getPartnerDetails = async (partnerId?: string): Promise<CorporatePartner> => {
  try {
    const url = `${getCorporateApiBase()}${partnerId}/`;
    const response = await getAuthenticatedHttpClient().get(url);
    return camelCaseObject(response.data);
  } catch (error) {
    logError(error);
    return {
      id: 0,
      code: '',
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
