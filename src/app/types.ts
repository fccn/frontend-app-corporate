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
  courseId: string;
  name: string;
  link: string;
  logo: string;
  enrollments: number;
  certified: number;
  completionRate: number;
  position: number;
  courseDates: string;
  enrollmentDates: string;
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

export interface CellValue {
  row: {
    original: object;
  }
};