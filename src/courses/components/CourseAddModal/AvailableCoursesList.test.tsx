import { screen, fireEvent } from '@testing-library/react';
import { renderWrapper } from '@src/setupTest';
import AvailableCoursesList from './AvailableCoursesList';

const mockCourses = [
  { id: 'course1', displayName: 'Introduction to React' },
  { id: 'course2', displayName: 'Advanced JavaScript' },
  { id: 'course3', displayName: 'Python Programming' },
];

const defaultProps = {
  courses: mockCourses,
  selectedCourses: new Set<string>(),
  setSelectedCourses: jest.fn(),
};

describe('AvailableCoursesList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search field', () => {
    renderWrapper(<AvailableCoursesList {...defaultProps} />);

    expect(screen.getByPlaceholderText('Search courses by name or ID')).toBeInTheDocument();
  });

  it('renders all courses when no search query', () => {
    renderWrapper(<AvailableCoursesList {...defaultProps} />);

    expect(screen.getByText('Introduction to React')).toBeInTheDocument();
    expect(screen.getByText('Advanced JavaScript')).toBeInTheDocument();
    expect(screen.getByText('Python Programming')).toBeInTheDocument();
  });

  it('filters courses based on search query', () => {
    renderWrapper(<AvailableCoursesList {...defaultProps} />);

    const searchField = screen.getByPlaceholderText('Search courses by name or ID');
    fireEvent.change(searchField, { target: { value: 'react' } });
    fireEvent.submit(searchField);

    expect(screen.getByText('Introduction to React')).toBeInTheDocument();
    expect(screen.queryByText('Advanced JavaScript')).not.toBeInTheDocument();
    expect(screen.queryByText('Python Programming')).not.toBeInTheDocument();
  });

  it('filters courses based on course ID', () => {
    renderWrapper(<AvailableCoursesList {...defaultProps} />);

    const searchField = screen.getByPlaceholderText('Search courses by name or ID');
    fireEvent.change(searchField, { target: { value: 'course1' } });
    fireEvent.submit(searchField);

    expect(screen.getByText('Introduction to React')).toBeInTheDocument();
    expect(screen.queryByText('Advanced JavaScript')).not.toBeInTheDocument();
  });

  it('shows "no courses found" message when search yields no results', () => {
    renderWrapper(<AvailableCoursesList {...defaultProps} />);

    const searchField = screen.getByPlaceholderText('Search courses by name or ID');
    fireEvent.change(searchField, { target: { value: 'nonexistent' } });
    fireEvent.submit(searchField);

    expect(screen.getByText("You've already added all available courses for this section.")).toBeInTheDocument();
  });

  it('renders select all checkbox', () => {
    renderWrapper(<AvailableCoursesList {...defaultProps} />);

    expect(screen.getByLabelText('Select All (3 courses)')).toBeInTheDocument();
  });

  it('selects all courses when select all checkbox is clicked', () => {
    const mockSetSelectedCourses = jest.fn();
    renderWrapper(
      <AvailableCoursesList
        {...defaultProps}
        setSelectedCourses={mockSetSelectedCourses}
      />,
    );

    const selectAllCheckbox = screen.getByLabelText('Select All (3 courses)');
    fireEvent.click(selectAllCheckbox);

    expect(mockSetSelectedCourses).toHaveBeenCalledWith(new Set(['course1', 'course2', 'course3']));
  });

  it('deselects all courses when select all checkbox is unchecked', () => {
    const mockSetSelectedCourses = jest.fn();
    renderWrapper(
      <AvailableCoursesList
        {...defaultProps}
        selectedCourses={new Set(['course1', 'course2', 'course3'])}
        setSelectedCourses={mockSetSelectedCourses}
      />,
    );

    const selectAllCheckbox = screen.getByLabelText('Select All (3 courses)');
    fireEvent.click(selectAllCheckbox);

    expect(mockSetSelectedCourses).toHaveBeenCalledWith(new Set());
  });

  it('selects individual course when checkbox is clicked', () => {
    const mockSetSelectedCourses = jest.fn();
    renderWrapper(
      <AvailableCoursesList
        {...defaultProps}
        setSelectedCourses={mockSetSelectedCourses}
      />,
    );

    const courseCheckbox = screen.getByLabelText('Introduction to React');
    fireEvent.click(courseCheckbox);

    expect(mockSetSelectedCourses).toHaveBeenCalledWith(new Set(['course1']));
  });

  it('deselects individual course when checkbox is unchecked', () => {
    const mockSetSelectedCourses = jest.fn();
    renderWrapper(
      <AvailableCoursesList
        {...defaultProps}
        selectedCourses={new Set(['course1'])}
        setSelectedCourses={mockSetSelectedCourses}
      />,
    );

    const courseCheckbox = screen.getByLabelText('Introduction to React');
    fireEvent.click(courseCheckbox);

    expect(mockSetSelectedCourses).toHaveBeenCalledWith(new Set());
  });

  it('maintains other selections when selecting additional course', () => {
    const mockSetSelectedCourses = jest.fn();
    renderWrapper(
      <AvailableCoursesList
        {...defaultProps}
        selectedCourses={new Set(['course1'])}
        setSelectedCourses={mockSetSelectedCourses}
      />,
    );

    const courseCheckbox = screen.getByLabelText('Advanced JavaScript');
    fireEvent.click(courseCheckbox);

    expect(mockSetSelectedCourses).toHaveBeenCalledWith(new Set(['course1', 'course2']));
  });

  it('shows selected state for pre-selected courses', () => {
    renderWrapper(
      <AvailableCoursesList
        {...defaultProps}
        selectedCourses={new Set(['course1', 'course3'])}
      />,
    );

    expect(screen.getByLabelText('Introduction to React')).toBeChecked();
    expect(screen.getByLabelText('Advanced JavaScript')).not.toBeChecked();
    expect(screen.getByLabelText('Python Programming')).toBeChecked();
  });

  it('clears search when clear button is clicked', () => {
    renderWrapper(<AvailableCoursesList {...defaultProps} />);

    const searchField = screen.getByPlaceholderText('Search courses by name or ID');
    fireEvent.change(searchField, { target: { value: 'react' } });
    fireEvent.submit(searchField);

    expect(screen.getByText('Introduction to React')).toBeInTheDocument();
    expect(screen.queryByText('Advanced JavaScript')).not.toBeInTheDocument();

    const clearButton = screen.getByRole('button', { name: /clear search/i });
    fireEvent.click(clearButton);

    expect(screen.getByText('Introduction to React')).toBeInTheDocument();
    expect(screen.getByText('Advanced JavaScript')).toBeInTheDocument();
    expect(screen.getByText('Python Programming')).toBeInTheDocument();
  });

  it('handles empty courses array', () => {
    renderWrapper(
      <AvailableCoursesList
        {...defaultProps}
        courses={[]}
      />,
    );

    expect(screen.getByText("You've already added all available courses for this section.")).toBeInTheDocument();
    expect(screen.queryByLabelText(/select all/i)).not.toBeInTheDocument();
  });
});
