import { getConfig, camelCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';

import { CorporateCatalog, CorporatePartner, Paginated } from '../app/types';

export const getPartnerCatalogs = async (
  partnerId: string,
  page: number,
  pageSize: number,
): Promise<Paginated<CorporateCatalog>> => {
  try {
    const url = `${getConfig().LMS_BASE_URL}/corporate_access/api/v1/partners/${partnerId}/catalogs/?page=${page + 1}&page_size=${pageSize}`;
    const response = await getAuthenticatedHttpClient().get(url);
    return {
      next: response.data.next,
      previous: response.data.previous,
      count: response.data.count,
      numPages: response.data.num_pages,
      currentPage: response.data.current_page,
      start: response.data.start,
      results: camelCaseObject(response.data.results),
    };
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

export const getPartnerDetails = async (partnerId?: string): Promise<CorporatePartner> => {
  try {
    const url = `${getConfig().LMS_BASE_URL}/corporate_access/api/v1/partners/${partnerId}/`;
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
