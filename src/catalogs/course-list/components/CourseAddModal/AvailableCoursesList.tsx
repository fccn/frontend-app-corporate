import { useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Card, Form, SearchField } from '@openedx/paragon';
import messages from '../../messages';

type CourseListItem = {
  id: string;
  displayName: string;
};

type AvailableCoursesListProps = {
  courses: CourseListItem[];
  selectedCourses: Set<string>;
  setSelectedCourses: (courses: Set<string>) => void;
};
const AvailableCoursesList = ({ courses, selectedCourses, setSelectedCourses }: AvailableCoursesListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const intl = useIntl();

  const filteredCourses = courses.filter(course => course.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    || course.id.toString().includes(searchQuery));

  const allSelected = filteredCourses.length > 0
    && filteredCourses.every(course => selectedCourses.has(course.id));

  const someSelected = filteredCourses.some(course => selectedCourses.has(course.id));
  const hasCourses = filteredCourses.length > 0;
  const isEmptySearch = searchQuery.trim() === '';

  const handleSelectAll = (checked: boolean) => {
    const newSet = new Set(selectedCourses);
    filteredCourses.forEach(course => (checked ? newSet.add(course.id) : newSet.delete(course.id)));
    setSelectedCourses(newSet);
  };

  return (
    <div className="py-5">
      <SearchField
        placeholder={intl.formatMessage(messages['corporate.courses.modal.add.search.placeholder'])}
        className="mb-3"
        value={searchQuery}
        onChange={value => setSearchQuery(value)}
        onClear={() => setSearchQuery('')}
      />

      {hasCourses && (
        <Card className="p-3 shadow-none border-bottom rounded-0 bg-light-300">
          <Form.Checkbox
            checked={allSelected}
            indeterminate={(someSelected && !allSelected).toString()}
            onChange={e => handleSelectAll(e.target.checked)}
          >
            {intl.formatMessage(
              messages['corporate.courses.modal.add.select.all'],
              { count: filteredCourses.length },
            )}
          </Form.Checkbox>
        </Card>
      )}

      {!hasCourses && (
        <p className="text-center text-muted my-5">
          {intl.formatMessage(
            messages[
              isEmptySearch
                ? 'corporate.courses.modal.add.all.courses.added'
                : 'corporate.courses.modal.add.no.courses'
            ],
          )}
        </p>
      )}

      {filteredCourses.map(course => (
        <Card key={course.id} className="p-3 shadow-none border-bottom rounded-0">
          <Form.Checkbox
            checked={selectedCourses.has(course.id)}
            onChange={e => {
              const newSet = new Set(selectedCourses);
              if (e.target.checked) {
                newSet.add(course.id);
              } else {
                newSet.delete(course.id);
              }
              setSelectedCourses(newSet);
            }}
          >
            <div className="d-flex flex-column">
              <span>{course.displayName}</span>
              <span className="text-muted x-small">{course.id}</span>
            </div>
          </Form.Checkbox>
        </Card>
      ))}
    </div>
  );
};
export default AvailableCoursesList;
