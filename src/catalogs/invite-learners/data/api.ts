import { camelCaseObject, snakeCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';

import { getCorporateApi } from '@src/constants';
import {
  CatalogInviteResponse, CatalogBulkInviteResponse,
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
