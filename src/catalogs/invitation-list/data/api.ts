import { camelCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';

import { CatalogInvitation, PaginatedResponse } from '@src/types';
import { getCorporateApi } from '@src/constants';

export const getCatalogInvitations = async (
  catalogId: string | number,
  pageIndex: number,
  pageSize: number,
  ordering?: string,
  search?: string,
  status?: string,
): Promise<PaginatedResponse<CatalogInvitation>> => {
  try {
    const url = new URL(getCorporateApi(`manage/catalogs/${catalogId}/invitations/`));
    url.searchParams.append('page', pageIndex.toString());
    url.searchParams.append('page_size', pageSize.toString());
    if (ordering) { url.searchParams.append('ordering', ordering); }
    if (search) { url.searchParams.append('search', search); }
    if (status) { url.searchParams.append('status', status); }
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
