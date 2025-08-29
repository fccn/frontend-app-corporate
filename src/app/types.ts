export type CorporatePartner = {
  id: number;
  code: string;
  name: string;
  logo: string;
  homepageUrl: string;
  catalogs: number;
  courses: number;
  enrollments: number;
  certified: number;
};

export type Learner = {
  name: string;
  email: string;
  assesmentDone: number;
  assesmentToComplete: number;
};

export type CorporateCourse = {
  name: string;
  link: string;
  logo: string;
  students: Learner[];
};

export type CorporateCatalog = {
  id: string;
  name: string;
  slug: string;
  enrollments: number;
  certified: number;
  completionRate: number;
  supportEmail: string;
  emailRegexes: string[];
  courseEnrollmentLimit: number;
  userLimit: number;
  availableStartDate: Date;
  availableEndDate: Date;
  catalogAlternativeLink: string;
  isSelfEnrollment: boolean;
  customCourses: boolean;
  authorizationAdditionalMessage: string;
  isPublic: boolean;
  courses: number;
  corporatePartner: number;
};

export interface Paginated<T> {
  next: string | null;
  previous: string | null;
  count: number;
  numPages: number;
  currentPage: number;
  start: number;
  results: T[];
}
