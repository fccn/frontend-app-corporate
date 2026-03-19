import { useMutation } from '@tanstack/react-query';
import { logError } from '@edx/frontend-platform/logging';
import { downloadBlob, downloadReport } from '@src/catalogs/utils';
import { useNotification } from '@src/notification';

export interface DownloadReportConfig {
  endpoint: string;
  filename: string;
}

export interface UseDownloadReportOptions {
  endpoint: string;
  filename: string;
  successMessage?: string;
  errorMessage?: string;
}

/**
 * Generic hook for downloading CSV reports.
 *
 * This hook provides a reusable way to trigger file downloads
 * across the application. Each report type just needs to provide
 * the endpoint and filename.
 *
 * @example
 * ```ts
 * const downloadCoursesReport = useDownloadReport({
 *   endpoint: `manage/catalogs/${catalogId}/courses/`,
 *   filename: 'courses_report.csv',
 * });
 *
 * // Usage:
 * downloadCoursesReport.mutate();
 * ```
 */
export const useDownloadReport = ({
  endpoint,
  filename,
  successMessage = 'Report downloaded successfully',
  errorMessage = 'Failed to download report',
}: UseDownloadReportOptions) => {
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: async () => downloadReport(endpoint, filename),
    onSuccess: ({ blob }) => {
      downloadBlob(blob, filename);
      showNotification(successMessage, 'success');
    },
    onError: (error) => {
      logError(error);
      showNotification(errorMessage, 'error');
    },
  });
};
