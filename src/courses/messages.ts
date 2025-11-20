import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'corporate.courses.page.totalCourses': {
    id: 'corporate.courses.page.totalCourses',
    defaultMessage: 'Courses',
    description: 'Label for stats total courses',

  },
  'corporate.courses.page.enrolledUsers': {
    id: 'corporate.courses.page.enrolledUsers',
    defaultMessage: 'Enrollments',
    description: 'Label for stats total user enrrolled',

  },
  'corporate.courses.page.certifiedUsers': {
    id: 'corporate.courses.page.certifiedUsers',
    defaultMessage: 'Certified Learners',
    description: 'Label for stats total certified learners',
  },
  'corporate.courses.page.completionRate': {
    id: 'corporate.courses.page.completionRate',
    defaultMessage: 'Completion Rate',
    description: 'Label for stats completation rate',
  },
  'corporate.courses.page.tab.courses': {
    id: 'corporate.courses.page.tab.courses',
    defaultMessage: 'Courses',
    description: 'Tab title for courses',
  },
  'corporate.courses.page.tab.learners': {
    id: 'corporate.courses.page.tab.learners',
    defaultMessage: 'Learners',
    description: 'Tab title for learners',
  },
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
