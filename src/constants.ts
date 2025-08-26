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
    buildPath: (partnerId: string) => `/${partnerId}/`,
  },

  courses: {
    path: '/:partnerId/:catalogId/',
    buildPath: (partnerId: string, catalogId: string) => `/${partnerId}/${catalogId}/`,
  },

  courseDetail: {
    path: '/:partnerId/:catalogId/:courseId/',
    buildPath: (partnerId: string, catalogId: string, courseId: string) => `/${partnerId}/${catalogId}/${courseId}/`,
  },
} as const;
