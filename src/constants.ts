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
    path: '/catalogs/:partnerId/',
    buildPath: (partnerId: string) => `/catalogs/${partnerId}/`,
  },

  courses: {
    path: '/catalogs/:partnerId/courses',
    buildPath: (partnerId: string) => `/catalogs/${partnerId}/courses`,
  },

  courseDetail: {
    path: '/catalogs/:partnerId/courses/:courseId/',
    buildPath: (partnerId: string, courseId: string) => `/catalogs/${partnerId}/courses/${courseId}/`,
  },
} as const;
