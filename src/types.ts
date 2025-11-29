export type Partner = {
  id: number;
  slug: string;
  name: string;
  logo: string;
  homepageUrl: string;
  catalogs: number;
  courses: number;
  enrollments: number;
  certified: number;
};

export type Learner = {
  id: number;
  active: boolean;
  user: {
    id: number;
    username: string;
    email: string;
    fullName: string;
  },
  inviteSentAt: string;
  acceptedAt: string;
  removedAt: string;
  enrollments: number;
  certified: number;
};

export interface CourseRun {
  id: string;
  displayName: string;
  start: string | null;
  end: string | null;
  enrollmentStart: string | null;
  enrollmentEnd: string | null;
}

export interface Course {
  id: number;
  catalogId: number;
  position: number;
  enrollments: number;
  certified: number;
  completionRate: number;
  courseRun: CourseRun;
}

export interface CatalogBase {
  id: string;
  name: string;
  slug: string;
  emailRegexes: string[];
  isSelfEnrollment: boolean;
  courseEnrollmentsLimit: number;
  userLimit: number;
  availableStartDate: string;
  availableEndDate: string;
  partnerId: number;
}

export interface CatalogStats {
  enrollments: number;
  certified: number;
  completionRate: number;
  courses: number;
}

export interface Catalog extends CatalogBase, CatalogStats {
  supportEmail: string;
  authorizationMessage: string;
  alternativeLink: string;
}

export type CatalogUpdateRequest = Partial<
Omit<Catalog, 'id' | 'slug' | 'enrollments' | 'certified' | 'completionRate' | 'courses' | 'partnerId'>
>;

export interface PaginatedResponse<T> {
  next: string | null;
  previous: string | null;
  count: number;
  numPages: number;
  currentPage: number;
  start: number;
  results: T[];
}

export interface CellValue<T> {
  row: {
    original: T;
  };
}
