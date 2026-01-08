// Entity types
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
    lastLogin: string;
  },
  inviteSentAt: string;
  acceptedAt: string;
  removedAt: string;
  enrollments: number;
  certified: number;
};

export interface LearnerUser {
  fullName: string;
  email: string;
}

export interface LearnerStatus {
  user: LearnerUser;
  completedAssessments: number;
  assessmentsToComplete: number;
  progress: number;
  hasCertificate: boolean;
}

export interface CourseRun {
  id: string;
  displayName: string;
  courseImageUrl: string | null;
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
  image: string | null;
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
  totalLearners: number;
  activeLearners: number;
}

export interface Catalog extends CatalogBase, CatalogStats {
  supportEmail: string | null;
  authorizationMessage: string | null;
  alternativeLink: string | null;
}

export type CatalogUpdateRequest = Partial<
Omit<Catalog, 'id' | 'slug' | 'enrollments' | 'certified' | 'completionRate' | 'courses' | 'partnerId'>
>;

export interface CourseOverview {
  id: string;
  display_name: string;
}

export interface CatalogCourseEnrollment {
  id: number;
  active: boolean;
  progress: number;
  has_certificate: boolean;
  catalog_course: number;
  user: Partial<Learner['user']>;
  course_overview: CourseOverview;
}

// API response types
export interface PaginatedResponse<T> {
  next: string | null;
  previous: string | null;
  count: number;
  numPages: number;
  currentPage: number;
  start: number;
  results: T[];
}

// Paragon types
export interface CellValue<T> {
  row: {
    original: T;
  };
}

// Hooks types
export interface UseQueryResult<T> {
  data: T;
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  isSuccess: boolean;
}
