import { camelCaseObject, snakeCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';

import { getCorporateApiBase } from '@src/constants';
import {
  Catalog, CatalogUpdateRequest, Learner, PaginatedResponse,
} from '../../types';

export const getPartnerCatalogs = async (
  partnerId: number,
  page: number,
  pageSize: number,
): Promise<PaginatedResponse<Catalog>> => {
  try {
    const url = new URL(`${getCorporateApiBase()}${partnerId}/catalogs/`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('page_size', pageSize.toString());

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

export const getCatalogDetails = async (
  partnerId: number,
  catalogId: string | undefined,
): Promise<Catalog | null> => {
  try {
    const url = `${getCorporateApiBase()}${partnerId}/catalogs/${catalogId}/`;
    const response = await getAuthenticatedHttpClient().get(url);
    return camelCaseObject(response.data);
  } catch (error) {
    logError(error);
    return null;
  }
};

export const updateCatalog = async (
  partnerId: number,
  catalogId: string | number,
  data: CatalogUpdateRequest,
): Promise<Catalog | null> => {
  try {
    const url = `${getCorporateApiBase()}${partnerId}/catalogs/${catalogId}/`;
    const response = await getAuthenticatedHttpClient().put(url, snakeCaseObject(data));
    return camelCaseObject(response.data);
  } catch (error) {
    logError(error);
    return null;
  }
};

export const getCatalogsLearners = async (
  partnerId: number,
  catalogId: string | number,
): Promise<PaginatedResponse<Learner>> => {
  try {
    const url = `${getCorporateApiBase()}${partnerId}/catalogs/${catalogId}/learners/`;
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
