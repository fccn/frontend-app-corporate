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
  id: string | number;
  name: string;
  logo: string;
  homepage: string;
  enrollments: number;
  certifiedLearners: number;
  completionRate: number;
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
