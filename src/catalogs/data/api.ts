import { camelCaseObject, snakeCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';

import { getCorporateApi } from '@src/constants';
import {
  Catalog, CatalogCourseEnrollment, CatalogUpdateRequest, Learner, PaginatedResponse,
} from '../../types';

export const getPartnerCatalogs = async (
  partnerId: number,
  page: number,
  pageSize: number,
  ordering?: string,
  search?: string,
): Promise<PaginatedResponse<Catalog>> => {
  try {
    const url = new URL(getCorporateApi('manage/catalogs/'));
    url.searchParams.append('page', page.toString());
    url.searchParams.append('page_size', pageSize.toString());
    url.searchParams.append('partner', partnerId.toString());
    if (ordering) {
      url.searchParams.append('ordering', ordering);
    }
    if (search) {
      url.searchParams.append('search', search);
    }
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

export const updateCatalog = async (
  catalogId: string | number,
  data: CatalogUpdateRequest,
): Promise<Catalog | null> => {
  try {
    const url = getCorporateApi(`manage/catalogs/${catalogId}/`);
    const response = await getAuthenticatedHttpClient().patch(url, snakeCaseObject(data));
    return camelCaseObject(response.data);
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const getCatalogsLearners = async (
  catalogId: string | number,
  pageIndex: number,
  pageSize: number,
  ordering?: string,
  search?: string,
  active?: string,
): Promise<PaginatedResponse<Learner>> => {
  try {
    const url = new URL(getCorporateApi(`manage/catalogs/${catalogId}/learners/`));
    url.searchParams.append('page', pageIndex.toString());
    url.searchParams.append('page_size', pageSize.toString());
    if (ordering) {
      url.searchParams.append('ordering', ordering);
    }
    if (search) {
      url.searchParams.append('search', search);
    }
    if (active && active !== 'all') {
      url.searchParams.append('active', active);
    }
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

export const postCatalogInviteLearners = async (
  catalogId: string | number,
  data: { catalogId: string, inviteEmail: string[] },
): Promise<void> => {
  try {
    const url = getCorporateApi(`manage/catalogs/${catalogId}/invitations/`);
    await getAuthenticatedHttpClient().post(url, snakeCaseObject(data));
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const postBulkCatalogInviteLearners = async (
  catalogId: string | number,
  data: { csvFile: File },
): Promise<void> => {
  try {
    const url = getCorporateApi(`manage/catalogs/${catalogId}/invitations/bulk_invite/`);
    const formData = new FormData();
    formData.append('file', data.csvFile);
    await getAuthenticatedHttpClient().post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const deleteLearnersFromCatalog = async (
  catalogId: string,
  data: { learnerIds: number[] },
): Promise<{
  taskId: string;
  status: string;
}> => {
  try {
    const url = getCorporateApi(`manage/catalogs/${catalogId}/invitations/bulk_remove/`);
    const response = await getAuthenticatedHttpClient().post(url, snakeCaseObject(data));
    return camelCaseObject(response.data);
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const getCatalogEnrrollements = async (
  catalogId: string | number,
  pageIndex: number,
  pageSize: number,
  ordering?: string,
  search?: string,
  active?: string,
): Promise<PaginatedResponse<CatalogCourseEnrollment>> => {
  try {
    const url = new URL(getCorporateApi(`manage/catalogs/${catalogId}/enrollments/`));
    url.searchParams.append('page', pageIndex.toString());
    url.searchParams.append('page_size', pageSize.toString());
    if (ordering) {
      url.searchParams.append('ordering', ordering);
    }
    if (search) {
      url.searchParams.append('search', search);
    }
    if (active && active !== 'all') {
      url.searchParams.append('active', active);
    }
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
