import { camelCaseObject, snakeCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';

import { getCorporateApi } from '@src/constants';
import {
  CatalogInvitation, CatalogInviteResponse, CatalogBulkInviteResponse, PaginatedResponse,
} from '@src/types';

export const postCatalogInviteLearners = async (
  catalogId: string,
  data: { catalogId: string, inviteEmail: string[] },
): Promise<CatalogInviteResponse> => {
  try {
    const url = getCorporateApi(`manage/catalogs/${catalogId}/invitations/`);
    const response = await getAuthenticatedHttpClient().post(url, snakeCaseObject(data));
    return camelCaseObject(response.data);
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const postBulkCatalogInviteLearners = async (
  catalogId: string,
  data: { csvFile: File },
): Promise<CatalogBulkInviteResponse> => {
  try {
    const url = getCorporateApi(`manage/catalogs/${catalogId}/invitations/bulk_invite/`);
    const formData = new FormData();
    formData.append('file', data.csvFile);
    const response = await getAuthenticatedHttpClient().post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return camelCaseObject(response.data);
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const getBulkInviteTaskStatus = async (
  catalogId: string,
  taskId: string,
): Promise<CatalogBulkInviteResponse> => {
  try {
    const url = getCorporateApi(`manage/catalogs/${catalogId}/invitations/bulk_task/status/${taskId}/`);
    const response = await getAuthenticatedHttpClient().get(url);
    return camelCaseObject(response.data);
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const getCatalogInvitations = async (
  catalogId: string | number,
  pageIndex: number,
  pageSize: number,
  ordering?: string,
  search?: string,
  status?: number,
): Promise<PaginatedResponse<CatalogInvitation>> => {
  try {
    const url = new URL(getCorporateApi(`manage/catalogs/${catalogId}/invitations/`));
    url.searchParams.append('page', pageIndex.toString());
    url.searchParams.append('page_size', pageSize.toString());
    if (ordering) { url.searchParams.append('ordering', ordering); }
    if (search) { url.searchParams.append('search', search); }
    if (status !== undefined) { url.searchParams.append('status', status.toString()); }
    const response = await getAuthenticatedHttpClient().get(url);
    return camelCaseObject(response.data);
  } catch (error) {
    logError(error);
    return {
      next: null, previous: null, count: 0, numPages: 0, currentPage: 0, start: 0, results: [],
    };
  }
};

export const resendInvitation = async (
  catalogId: string | number,
  invitationId: number,
): Promise<CatalogInvitation> => {
  const url = getCorporateApi(`manage/catalogs/${catalogId}/invitations/${invitationId}/resend/`);
  const response = await getAuthenticatedHttpClient().post(url);
  return camelCaseObject(response.data);
};

export const cancelInvitation = async (
  catalogId: string | number,
  invitationId: number,
): Promise<CatalogInvitation> => {
  const url = getCorporateApi(`manage/catalogs/${catalogId}/invitations/${invitationId}/cancel/`);
  const response = await getAuthenticatedHttpClient().post(url);
  return camelCaseObject(response.data);
};
