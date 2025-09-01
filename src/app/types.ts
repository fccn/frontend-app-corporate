export type CorporatePartner = {
  code: string;
  name: string;
  logo: string;
  homepage: string;
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
  name: string;
  supportEmail: string;
  emailDomainRegex: string[];
  userLimit: number;
  enrollmentLimit: number;
  availableStartDate: Date;
  availableEndDate: Date;
  alternativeLink: string;
  isSelfEnrollment: boolean;
  isPublic: boolean;
  enableCustomCourses: boolean;
  additionalAuthorizationMessage: string;
  courses: CorporateCourse[];
};

export interface ApiResponse<T = any> {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
  currentPage?: number;
  numPages?: number;
}
