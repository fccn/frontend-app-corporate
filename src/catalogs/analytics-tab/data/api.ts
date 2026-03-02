import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';
import { getlmsBaseUrl } from '@src/constants';

export const fetchGuestToken = async (
  filters: { catalog_id?: string; org?: string },
): Promise<string> => {
  try {
    const url = `${getlmsBaseUrl()}/aspects/superset_guest_token_global/`;

    const response = await getAuthenticatedHttpClient().post(url, filters);
    return response.data.guestToken;
  } catch (error) {
    logError(error);
    throw error;
  }
};
