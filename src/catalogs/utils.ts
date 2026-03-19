import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getCorporateApi } from '@src/constants';

export const dateFormat = (isoDateString: string | null) => {
  if (!isoDateString) {
    return null;
  }
  const date = new Date(isoDateString);
  const pad = (n: number) => n.toString().padStart(2, '0');
  const formatted = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} `
        + `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  return formatted;
};

/**
 * Utility function to trigger a blob download in the browser.
 *
 * @param blob - The blob to download
 * @param filename - The name of the file to save as
 */
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Generic report downloader for CSV reports.
 *
 * @param endpoint - The API endpoint path (e.g., 'manage/catalogs/123/courses/')
 * @param filename - The filename to save as (e.g., 'courses_report.csv')
 * @returns Promise with blob and filename
 */
export const downloadReport = async (endpoint: string, filename: string) => {
  const config = { responseType: 'blob' as const };
  const url = new URL(getCorporateApi(endpoint));
  url.searchParams.append('format', 'csv');

  const { data } = await getAuthenticatedHttpClient().get(url.toString(), config);
  return { blob: data, filename };
};
