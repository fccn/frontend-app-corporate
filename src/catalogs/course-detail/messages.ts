import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'corporate.course.learners.table.header.name': {
    id: 'corporate.course.learners.table.header.name',
    defaultMessage: 'Learner Username/Name',
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
  'corporate.course.learners.table.certificate.yes': {
    id: 'corporate.courses.learners.table.certificate.yes',
    defaultMessage: 'Yes',
    description: 'Text to indicate the user has a certificate',
  },
  'corporate.course.learners.table.certificate.no': {
    id: 'corporate.courses.learners.table.certificate.no',
    defaultMessage: 'No',
    description: 'Text to indicate the user has not get the certificate',
  },
});

export default messages;
