import { Card, Form, SearchField } from '@openedx/paragon';
import { CourseRun } from '@src/types';
import { useState } from 'react';

type AvailableCoursesListProps = {
  courses: CourseRun[];
  selectedCourses: Set<string>;
  setSelectedCourses: (courses: Set<string>) => void;
};
const AvailableCoursesList = ({ courses, selectedCourses, setSelectedCourses }: AvailableCoursesListProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter(course => course.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    || course.id.toString().includes(searchQuery));

  const allSelected = filteredCourses.length > 0
    && filteredCourses.every(course => selectedCourses.has(course.id));

  const someSelected = filteredCourses.some(course => selectedCourses.has(course.id));

  const handleSelectAll = (checked: boolean) => {
    setSelectedCourses(prev => {
      const newSet = new Set(prev);
      filteredCourses.forEach(course => (checked ? newSet.add(course.id) : newSet.delete(course.id)));
      return newSet;
    });
  };

  return (
    <div className="py-5">
      <SearchField
        placeholder="Search by name or ID course"
        className="mb-3"
        value={searchQuery}
        onSubmit={value => setSearchQuery(value)}
        onClear={() => setSearchQuery('')}
      />

      {filteredCourses.length > 0 && (
        <Card className="p-3 shadow-none border-bottom rounded-0 bg-light-300">
          <Form.Checkbox
            checked={allSelected}
            indeterminate={someSelected && !allSelected}
            onChange={e => handleSelectAll(e.target.checked)}
          >
            Select All ({filteredCourses.length} courses)
          </Form.Checkbox>
        </Card>
      )}

      {filteredCourses.map(course => (
        <Card key={course.id} className="p-3 shadow-none border-bottom rounded-0">
          <Form.Checkbox
            checked={selectedCourses.has(course.id)}
            onChange={e => {
              setSelectedCourses(prev => {
                const newSet = new Set(prev);
                e.target.checked ? newSet.add(course.id) : newSet.delete(course.id);
                return newSet;
              });
            }}
          >
            {course.displayName}
          </Form.Checkbox>
        </Card>
      ))}
    </div>
  );
};
export default AvailableCoursesList;
