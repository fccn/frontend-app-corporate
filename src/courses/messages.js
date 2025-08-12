import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  headerAction: {
    id: 'corporate.partner.table.header.action',
    defaultMessage: 'Action',
    description: 'Header for the action column',
  },
  headerName: {
    id: 'corporate.courses.table.header.name',
    defaultMessage: 'Course Name',
    description: 'Header for the partner name column',
  },
  headerPosition: {
    id: 'corporate.partner.table.header.position',
    defaultMessage: 'Position',
    description: 'Header for the position column, describing the order of the courses',
  },
  headerCourseDates: {
    id: 'corporate.partner.table.header.course.dates',
    defaultMessage: 'Course Dates',
    description: 'Header for the course dates column, describing the start and end dates of the courses',
  },
  headerEnrollmentDates: {
    id: 'corporate.partner.table.header.enrollment.dates',
    defaultMessage: 'Enrollment Dates',
    description: 'Header for the number of enrollments dates column, describing the dates when students enrolled in the courses',
  },
  headerEnrollment: {
    id: 'corporate.partner.table.header.enrollment',
    defaultMessage: 'Enrollments',
    description: 'Header for the number of enrollments column, describing the number of students enrolled in the courses',
  },
  headerCertified: {
    id: 'corporate.partner.table.header.certified',
    defaultMessage: 'Certified Learners',
    description: 'Header for the number of certified students column',
  },
  headerCompletion: {
    id: 'corporate.partner.table.header.completion',
    defaultMessage: 'Certified Learners',
    description: 'Header for the completion rate column, describing the percentage of students who completed the course',
  },
});

export default messages;
