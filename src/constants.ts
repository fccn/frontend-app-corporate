/**
 * Centralized route definitions.
 * Each route provides a path template and a builder for concrete URLs.
 */
export const paths = {
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
