import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'corporate.courses.page.seats': {
    id: 'corporate.courses.page.seats',
    defaultMessage: 'Available Seats',
    description: 'Label for stats total seats',

  },
  'corporate.courses.page.learners': {
    id: 'corporate.courses.page.learners',
    defaultMessage: 'Total Learners',
    description: 'Label for stats total learners',

  },
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
  'corporate.courses.page.tab.enrollments': {
    id: 'corporate.courses.page.tab.enrollments',
    defaultMessage: 'Enrollments',
    description: 'Tab title for enrollments',
  },
  'corporate.courses.page.tab.analytics': {
    id: 'corporate.courses.page.tab.analytics',
    defaultMessage: 'Analytics',
    description: 'Tab title for analytics',
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
  'corporate.courses.table.action.add.course': {
    id: 'corporate.courses.table.action.add.course',
    defaultMessage: 'Add Course',
    description: 'Action button to add a course',
  },
  'corporate.courses.table.action.download.report': {
    id: 'corporate.courses.table.action.download.report',
    defaultMessage: 'Download Report',
    description: 'Action button to download a report',
  },
  'corporate.courses.modal.add.title': {
    id: 'corporate.courses.modal.add.title',
    defaultMessage: 'Add Courses to Catalog',
    description: 'Title for the add courses modal',
  },
  'corporate.courses.modal.add.tab.base': {
    id: 'corporate.courses.modal.add.tab.base',
    defaultMessage: 'Base Catalog Courses',
    description: 'Tab title for base courses',
  },
  'corporate.courses.modal.add.tab.organization': {
    id: 'corporate.courses.modal.add.tab.organization',
    defaultMessage: "My Organization's Courses",
    description: 'Tab title for organization courses',
  },
  'corporate.courses.modal.add.all.courses.added': {
    id: 'corporate.courses.modal.add.all.courses.added',
    defaultMessage: 'You\'ve already added all available courses for this section.',
    description: 'Message when no courses are available to add',
  },
  'corporate.courses.modal.add.no.courses': {
    id: 'corporate.courses.modal.add.no.courses',
    defaultMessage: 'No courses found. Try adjusting your search.',
    description: 'Message when no courses match the search criteria',
  },
  'corporate.courses.modal.add.search.placeholder': {
    id: 'corporate.courses.modal.add.search.placeholder',
    defaultMessage: 'Search courses by name or ID',
    description: 'Placeholder text for the course search field in the add courses modal',
  },
  'corporate.courses.modal.add.button.add': {
    id: 'corporate.courses.modal.add.button.add',
    defaultMessage: 'Add Selected Courses',
    description: 'Button text to add selected courses',
  },
  'corporate.courses.modal.add.select.all': {
    id: 'corporate.courses.modal.add.select.all',
    defaultMessage: 'Select All ({count} courses)',
    description: 'Checkbox text to select all courses',
  },
  'corporate.courses.table.action.delete.selected': {
    id: 'corporate.courses.table.action.delete.selected',
    defaultMessage: 'Delete Selected Courses',
    description: 'Action button to delete selected courses',
  },
  'corporate.courses.modal.delete.title': {
    id: 'corporate.courses.modal.delete.title',
    defaultMessage: 'Delete {count, plural, one {Course} other {Courses}} from Catalog',
    description: 'Title for the delete courses modal',
  },
  'corporate.courses.modal.delete.subtitle': {
    id: 'corporate.courses.modal.delete.subtitle',
    defaultMessage: 'You are about to delete {count, plural, one {{courseName}} other {# courses}} from "{catalogName}" catalog.',
    description: 'Subtitle for the delete courses modal',
  },
  'corporate.courses.modal.delete.description': {
    id: 'corporate.courses.modal.delete.description',
    defaultMessage: `
    <li>This action will hide the course from learners in this catalog.</li>
    <li>Learners already enrolled in this course will keep their progress and certificates, but new enrollments will no longer be possible through this catalog.</li>
    <li>This does not delete the course from the platform or from other catalogs.</li>
    `,
    description: 'Description for the delete courses modal',
  },
  'corporate.courses.modal.delete.button.delete': {
    id: 'corporate.courses.modal.delete.button.delete',
    defaultMessage: 'Yes, Delete',
    description: 'Button text to delete selected courses',
  },
  'corporate.course.learners.table.header.name': {
    id: 'corporate.course.learners.table.header.name',
    defaultMessage: 'Learner Name',
    description: 'Header for the learner name column',
  },
  'corporate.course.learners.table.header.email': {
    id: 'corporate.course.learners.table.header.email',
    defaultMessage: 'Email',
    description: 'Header for the learner email column',
  },
  'corporate.course.learners.table.header.completed.assessments': {
    id: 'corporate.course.learners.table.header.completed.assessments',
    defaultMessage: 'Completed Assessments',
    description: 'Header for the completed assessments column',
  },
  'corporate.course.learners.table.header.assessments.to.complete': {
    id: 'corporate.course.learners.table.header.assessments.to.complete',
    defaultMessage: 'Assessments to Complete',
    description: 'Header for the assessments to complete column',
  },
  'corporate.course.learners.table.header.progress': {
    id: 'corporate.course.learners.table.header.progress',
    defaultMessage: 'Progress',
    description: 'Header for the learner progress column',
  },
  'corporate.course.learners.table.header.certificate': {
    id: 'corporate.course.learners.table.header.certificate',
    defaultMessage: 'Certificate',
    description: 'Header for the learner certificate column',
  },
  'corporate.course.learners.table.empty.content': {
    id: 'corporate.course.learners.table.empty.content',
    defaultMessage: 'No learners found for this course.',
    description: 'Message displayed when there are no learners for the course',
  },
  'corporate.courses.table.empty.content': {
    id: 'corporate.courses.table.empty.content',
    defaultMessage: 'No courses found.',
    description: 'Message displayed when there are no courses in the catalog',
  },
  'corporate.courses.modal.add.notification.success': {
    id: 'corporate.courses.modal.add.notification.success',
    defaultMessage: '{count, plural, one {# course} other {# courses}} have been successfully added to the catalog.',
    description: 'Notification message displayed when courses are successfully added to the catalog',
  },
  'corporate.courses.modal.add.notification.error': {
    id: 'corporate.courses.modal.add.notification.error',
    defaultMessage: 'An error occurred while adding courses to the catalog. Please try again.',
    description: 'Notification message displayed when there is an error adding courses to the catalog',
  },
  'corporate.courses.modal.delete.notification.success': {
    id: 'corporate.courses.modal.delete.notification.success',
    defaultMessage: '{count, plural, one {# course} other {# courses}} have been successfully removed from the catalog.',
    description: 'Notification message displayed when courses are successfully deleted from the catalog',
  },
  'corporate.courses.modal.delete.notification.error': {
    id: 'corporate.courses.modal.delete.notification.error',
    defaultMessage: 'An error occurred while deleting courses from the catalog. Please try again.',
    description: 'Notification message displayed when there is an error deleting courses from the catalog',
  },
  'corporate.courses.notification.position.update.success': {
    id: 'corporate.courses.notification.position.update.success',
    defaultMessage: 'Course position have been changed.',
    description: 'Notification message displayed when course positions are successfully updated',
  },
  'corporate.courses.notification.position.update.error': {
    id: 'corporate.courses.notification.position.update.error',
    defaultMessage: 'An error occurred while updating course position. Please try again.',
    description: 'Notification message displayed when there is an error updating course positions',
  },
});

export default messages;
