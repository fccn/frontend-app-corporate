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

export type CorporateCatalog = {
  name: string;
  courses: number;
  enrollments: number;
  certifiedLearners: number;
  completionRate: number;
};

export type CorporateDetails = {
  name: string;
  description?: string;
  image: string;
  catalogsQuantity: number;
  coursesQuantity: number;
  enrollmentsQuantity: number;
  certifiedLearnersQuantity: number;
};
