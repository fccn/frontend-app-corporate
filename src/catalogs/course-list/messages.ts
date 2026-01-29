import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'corporate.courses.table.action.add.course': {
    id: 'corporate.courses.table.action.add.course',
    defaultMessage: 'Add Courses',
    description: 'Button text to add a course to the catalog',
  },
  'corporate.courses.table.action.delete.selected': {
    id: 'corporate.courses.table.action.delete.selected',
    defaultMessage: 'Delete Selected Courses',
    description: 'Button text to delete selected courses',
  },
  'corporate.courses.table.header.name': {
    id: 'corporate.courses.table.header.name',
    defaultMessage: 'Course Name',
    description: 'Header for the course name column',
  },
  'corporate.courses.table.header.position': {
    id: 'corporate.courses.table.header.position',
    defaultMessage: 'Position',
    description: 'Header for the course position column',
  },
  'corporate.courses.table.header.course.dates': {
    id: 'corporate.courses.table.header.course.dates',
    defaultMessage: 'Course Dates',
    description: 'Header for the course dates column',
  },
  'corporate.courses.table.header.enrollment.dates': {
    id: 'corporate.courses.table.header.enrollment.dates',
    defaultMessage: 'Enrollment Dates',
    description: 'Header for the number of enrollments dates column',
  },
  'corporate.courses.table.header.enrollment': {
    id: 'corporate.courses.table.header.enrollment',
    defaultMessage: 'Enrollments',
    description: 'Header for the number of enrollments column',
  },
  'corporate.courses.table.header.certified': {
    id: 'corporate.courses.table.header.certified',
    defaultMessage: 'Certified Learners',
    description: 'Header for the number of certified students column',
  },
  'corporate.courses.table.header.completion': {
    id: 'corporate.courses.table.header.completion',
    defaultMessage: 'Completion Rate',
    description: 'Header for the completion rate column',
  },
  'corporate.courses.table.header.action': {
    id: 'corporate.courses.table.header.action',
    defaultMessage: 'Actions',
    description: 'Header for the action column',
  },
  'corporate.courses.table.empty.content': {
    id: 'corporate.courses.table.empty.content',
    defaultMessage: 'No courses found.',
    description: 'Message displayed when there are no courses in the catalog',
  },
  'corporate.courses.table.position.notification.update.success': {
    id: 'corporate.courses.notification.position.update.success',
    defaultMessage: 'Course position updated successfully.',
    description: 'Notification message displayed when course position is successfully updated',
  },
  'corporate.courses.table.position.notification.update.error': {
    id: 'corporate.courses.notification.position.update.error',
    defaultMessage: 'An error occurred while updating course position. Please try again.',
    description: 'Notification message displayed when there is an error updating course positions',
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
    defaultMessage: 'Organization Courses',
    description: 'Tab title for organization courses',
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
  'corporate.courses.modal.add.search.placeholder': {
    id: 'corporate.courses.modal.add.search.placeholder',
    defaultMessage: 'Search courses by name or ID',
    description: 'Placeholder for the search input in the add courses modal',
  },
  'corporate.courses.modal.add.all.courses.added': {
    id: 'corporate.courses.modal.add.all.courses.added',
    defaultMessage: 'You\'ve already added all available courses for this section.',
    description: 'Message displayed when all available courses are already in the catalog',
  },
  'corporate.courses.modal.add.no.courses': {
    id: 'corporate.courses.modal.add.no.courses',
    defaultMessage: 'No courses found. Try adjusting your search.',
    description: 'Message displayed when no courses are found',
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
  'corporate.courses.modal.add.notification.success': {
    id: 'corporate.courses.modal.add.notification.success',
    defaultMessage: '{count, plural, one {# course has} other {# courses have}} been successfully added to the catalog.',
    description: 'Notification message displayed when courses are successfully added to the catalog',
  },
  'corporate.courses.modal.delete.notification.error': {
    id: 'corporate.courses.modal.delete.notification.error',
    defaultMessage: 'An error occurred while deleting courses from the catalog. Please try again.',
    description: 'Notification message displayed when there is an error deleting courses',
  },
  'corporate.courses.modal.delete.button.delete': {
    id: 'corporate.courses.modal.delete.button.delete',
    defaultMessage: 'Yes, delete',
    description: 'Action button text for deleting courses',
  },
  'corporate.courses.modal.delete.notification.success': {
    id: 'corporate.courses.modal.delete.notification.success',
    defaultMessage: '{count, plural, one {# course has} other {# courses have}} been successfully removed from the catalog.',
    description: 'Notification message displayed when courses are successfully deleted from the catalog',
  },
});

export default messages;
