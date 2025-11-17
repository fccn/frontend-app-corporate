import { getConfig } from '@edx/frontend-platform';

/**
 * Centralized route definitions.
 * Each route provides a path template and a builder for concrete URLs.
 */
export const paths = {
  base: getConfig().PUBLIC_PATH.endsWith('/') ? getConfig().PUBLIC_PATH.slice(0, -1) : getConfig().PUBLIC_PATH,
  partners: {
    path: '/',
    buildPath: () => '/',
  },

  catalogs: {
    path: '/:partnerId/',
    buildPath: (partnerId: string | number) => `/${partnerId}/`,
  },

  courses: {
    path: '/:partnerId/:catalogId/',
    buildPath: (partnerId: string | number, catalogId: string) => `/${partnerId}/${catalogId}/`,
  },

  courseDetail: {
    path: '/:partnerId/:catalogId/:courseId/',
    buildPath: (partnerId: string | number, catalogId: string, courseId: string) => `/${partnerId}/${catalogId}/${courseId}/`,
  },
} as const;

const getlmsBaseUrl = () => getConfig().LMS_BASE_URL;
const CORPORATE_API_BASE = '/partner_catalog/api/v1/partners/';
const getCorporateApiBase = () => `${getlmsBaseUrl()}${CORPORATE_API_BASE}`;

// Cache configuration
const STALE_TIME = 60 * 60_000; // 1 hour
const CACHE_TIME = 2 * 60 * 60_000; // 2 hours
  
  // Pagination defaults
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

  // Date format
const DATE_FORMAT = 'YYYY-MM-DD';
  
  // Form validation
const MIN_NAME_LENGTH = 3;
const MAX_NAME_LENGTH = 255;
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export {
  STALE_TIME,
  CACHE_TIME,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
  DATE_FORMAT,
  MIN_NAME_LENGTH,
  MAX_NAME_LENGTH,
  EMAIL_REGEX,
  getCorporateApiBase,
};