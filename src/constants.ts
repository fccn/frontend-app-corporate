import { getConfig } from '@edx/frontend-platform';

/**
 * Centralized route definitions.
 * Each route provides a path template and a builder for concrete URLs.
 */
export const paths = {
  base: getConfig().PUBLIC_PATH.endsWith('/') ? getConfig().PUBLIC_PATH.slice(0, -1) : getConfig().PUBLIC_PATH,
  partners: {
    path: 'partners/',
    buildPath: () => '/partners/',
  },

  catalogs: {
    path: '/:partnerSlug/catalogs/',
    buildPath: (partnerSlug: string) => `/${partnerSlug}/catalogs/`,
  },

  courses: {
    path: '/:partnerSlug/catalogs/:catalogSlug/courses/',
    buildPath: (partnerSlug: string, catalogSlug: string) => `/${partnerSlug}/catalogs/${catalogSlug}/courses/`,
  },

  courseDetail: {
    path: '/:partnerSlug/catalogs/:catalogSlug/courses/:courseId/',
    buildPath: (partnerSlug: string, catalogSlug: string, courseId: string) => `/${partnerSlug}/catalogs/${catalogSlug}/courses/${courseId}/`,
  },
  notFound: {
    path: '/not-found',
  },
} as const;

export const appId = 'org.nau.frontend.app.corporate';

export const CORPORATE_MANAGER_ROLE = 'catalog_manager:active';

export const getlmsBaseUrl = () => getConfig().LMS_BASE_URL;
export const CORPORATE_API_BASE = '/partner_catalog/api/v1/';
export const getCorporateApi = (path) => `${getlmsBaseUrl()}${CORPORATE_API_BASE}${path}`;

// Cache configuration
export const STALE_TIME = 60 * 60_000; // 1 hour
export const CACHE_TIME = 2 * 60 * 60_000; // 2 hours

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Date format
export const DATE_FORMAT = 'YYYY-MM-DD';

// Form validation
export const MIN_NAME_LENGTH = 3;
export const MAX_NAME_LENGTH = 255;
export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const CELERY_STATUS = {
  PENDING: 'PENDING',
  STARTED: 'STARTED',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
  RETRY: 'RETRY',
  REVOKED: 'REVOKED',
};
