import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';
import { getlmsBaseUrl } from '@src/constants';

export const fetchGuestToken = async (courseId: string): Promise<string> => {
  try {
    const url = `${getlmsBaseUrl()}/aspects/superset_guest_token/${courseId}/`;

    const response = await getAuthenticatedHttpClient().get(url);
    return response.data.guestToken;
  } catch (error) {
    logError(error);
    throw error;
  }
};
