export type CorporatePartner = {
  code: string;
  name: string;
  logo: string;
  homepage: string;
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
  isPublic: boolean;
  supportEmail: string;
  userLimit: number;
  enrollmentLimit: number;
  availableStartDate: Date;
  availableEndDate: Date;
  alternativeLink: string;
  courses: number;
};
