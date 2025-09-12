import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  titleCorporatePage: {
    id: 'course.enrollments.page.title',
    defaultMessage: 'Course Enrollments',
    description: 'Page title for the course enrollments page',
  },
  headerStudentName: {
    id: 'course.enrollments.table.header.student_name',
    defaultMessage: 'Student Name',
    description: 'Header for the student name column',
  },
  headerEmail: {
    id: 'course.enrollments.table.header.email',
    defaultMessage: 'Email',
    description: 'Header for the email column',
  },
  headerCompletedAssessments: {
    id: 'course.enrollments.table.header.completed_assessments',
    defaultMessage: 'Completed Assessments',
    description: 'Header for the completed assessments column',
  },
  headerDueAssessments: {
    id: 'course.enrollments.table.header.due_assessments',
    defaultMessage: 'Assessments to be done',
    description: 'Header for the due assessments column',
  },
  headerProgress: {
    id: 'course.enrollments.table.header.progress',
    defaultMessage: 'Progress',
    description: 'Header for the progress column',
  },
  infoEnrollments: {
    id: 'course.enrollments.info.enrollments',
    defaultMessage: 'Enrollments',
    description: 'Info for the number of enrollments',
  },
  infoCertified: {
    id: 'course.enrollments.info.certified',
    defaultMessage: 'Certified students',
    description: 'Info for the number of certified students',
  },
  infoCompletion: {
    id: 'course.enrollments.info.completion',
    defaultMessage: 'Completion rate',
    description: 'Info for the completion rate',
  },
});

export default messages;
