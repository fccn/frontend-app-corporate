import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'corporate.courses.table.header.action': {
    id: 'corporate.courses.table.header.action',
    defaultMessage: 'Actions',
    description: 'Header for the action column',
  },
  'corporate.courses.table.header.name': {
    id: 'corporate.courses.table.header.name',
    defaultMessage: 'Course Name',
    description: 'Header for the partner name column',
  },
  'corporate.courses.table.header.position': {
    id: 'corporate.courses.table.header.position',
    defaultMessage: 'Position',
    description: 'Header for the position column, describing the order of the courses',
  },
  'corporate.courses.table.header.course.dates': {
    id: 'corporate.courses.table.header.course.dates',
    defaultMessage: 'Course Dates',
    description: 'Header for the course dates column, describing the start and end dates of the courses',
  },
  'corporate.courses.table.header.enrollment.dates': {
    id: 'corporate.courses.table.header.enrollment.dates',
    defaultMessage: 'Enrollment Dates',
    description: 'Header for the number of enrollments dates column, describing the dates when students enrolled in the courses',
  },
  'corporate.courses.table.header.enrollment': {
    id: 'corporate.courses.table.header.enrollment',
    defaultMessage: 'Enrollments',
    description: 'Header for the number of enrollments column, describing the number of students enrolled in the courses',
  },
  'corporate.courses.table.header.certified': {
    id: 'corporate.courses.table.header.certified',
    defaultMessage: 'Certified Learners',
    description: 'Header for the number of certified students column',
  },
  'corporate.courses.table.header.completion': {
    id: 'corporate.courses.table.header.completion',
    defaultMessage: 'Completion Rate',
    description: 'Header for the completion rate column, describing the percentage of students who completed the course',
  },
});

export default messages;
