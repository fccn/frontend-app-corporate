import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'corporate.catalog.header.info.name': {
    id: 'corporate.catalog.table.info.name',
    defaultMessage: 'Catalog',
    description: 'Info for the catalog name',
  },
  'corporate.catalog.header.info.courses': {
    id: 'corporate.catalog.table.info.courses',
    defaultMessage: 'Courses',
    description: 'Info for the number of courses',
  },
  'corporate.catalog.header.info.enrollments': {
    id: 'corporate.catalog.table.info.enrollments',
    defaultMessage: 'Enrollments',
    description: 'Info for the number of enrollments',
  },
  'corporate.catalog.header.info.certified': {
    id: 'corporate.catalog.table.info.certified',
    defaultMessage: 'Certified Learners',
    description: 'Info for the number of certified learners',
  },
  'corporate.catalog.header.info.completionRate': {
    id: 'corporate.catalog.table.info.completionRate',
    defaultMessage: 'Completion Rate',
    description: 'Info for the percentage of completion',
  },
  'corporate.catalog.header.info.seats': {
    // Unchanged id and default: the headline still means seats still free, so
    // existing translations stay correct.
    id: 'corporate.catalog.table.info.seats',
    defaultMessage: 'Available Seats',
    description: 'Info for the number of available seats in the catalog',
  },
  'corporate.catalog.header.info.seats.value.unlimited': {
    id: 'corporate.catalog.header.info.seats.value.unlimited',
    defaultMessage: 'No limit',
    description: 'Shown in place of a seat count when the catalog has no seat limit',
  },
  'corporate.catalog.header.info.seats.details': {
    id: 'corporate.catalog.header.info.seats.details',
    defaultMessage: 'Seat breakdown',
    description: 'Accessible name for the button that reveals the seat breakdown tooltip',
  },
  'corporate.catalog.header.info.seats.tooltip': {
    id: 'corporate.catalog.header.info.seats.tooltip',
    defaultMessage: '{accepted} accepted \u00b7 {pending} pending \u00b7 {free} free of {limit}. Invitations do not reserve seats \u2014 a seat is taken when an invitation is accepted.',
    description: 'Tooltip breaking the seat count down and explaining when a seat is consumed',
  },
  'corporate.catalog.header.info.seats.tooltip.unlimited': {
    id: 'corporate.catalog.header.info.seats.tooltip.unlimited',
    defaultMessage: '{accepted} accepted \u00b7 {pending} pending. This catalog has no seat limit.',
    description: 'Tooltip breaking the seat count down for a catalog with no seat limit',
  },
  'corporate.catalog.header.info.seats.tooltip.oversubscribed': {
    id: 'corporate.catalog.header.info.seats.tooltip.oversubscribed',
    defaultMessage: '{accepted} accepted \u00b7 {pending} pending \u00b7 {free} free of {limit}. Invitations do not reserve seats \u2014 a seat is taken when an invitation is accepted, so once the limit is reached further acceptances are rejected.',
    description: 'Tooltip shown when more invitations are pending than there are free seats',
  },
  'corporate.catalog.header.info.learners': {
    id: 'corporate.catalog.header.info.learners',
    defaultMessage: 'Learners',
    description: 'Info for the number of learners within the catalog',
  },
  'corporate.catalog.detail.page.tab.courses': {
    id: 'corporate.courses.page.tab.courses',
    defaultMessage: 'Courses',
    description: 'Catalog detail page tab title for courses',
  },
  'corporate.catalog.detail.page.tab.learners': {
    id: 'corporate.courses.page.tab.learners',
    defaultMessage: 'Learners',
    description: 'Catalog detail page tab title for learners',
  },
  'corporate.catalog.detail.page.tab.enrollments': {
    id: 'corporate.courses.page.tab.enrollments',
    defaultMessage: 'Enrollments',
    description: 'Catalog detail page tab title for enrollments',
  },
  'corporate.catalog.detail.page.tab.invitations': {
    id: 'corporate.courses.page.tab.invitations',
    defaultMessage: 'Invitations',
    description: 'Catalog detail page tab title for invitations',
  },
  'corporate.courses.page.tab.analytics': {
    id: 'corporate.courses.page.tab.analytics',
    defaultMessage: 'Analytics',
    description: 'Tab title for analytics',
  },
  'corporate.tables.action.download.report': {
    id: 'corporate.tables.action.download.report',
    defaultMessage: 'Download Report',
    description: 'Text for the download report button',
  },
});

export default messages;
