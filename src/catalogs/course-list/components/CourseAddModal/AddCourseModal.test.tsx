import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWrapper } from '@src/setupTest';
import CourseAddModal from './AddCourseModal';
import * as hooks from '../../data/hooks';

// Mock the hooks
jest.mock('../../data/hooks', () => ({
  useAvailableCourses: jest.fn(),
  useAddCoursesToCatalog: jest.fn(),
}));

const mockUseAvailableCourses = hooks.useAvailableCourses as jest.Mock;
const mockUseAddCoursesToCatalog = hooks.useAddCoursesToCatalog as jest.Mock;

const mockCourses = {
  base: [
    { id: 'course1', displayName: 'Course 1' },
    { id: 'course2', displayName: 'Course 2' },
  ],
  organization: [
    { id: 'course3', displayName: 'Course 3' },
  ],
};

const defaultProps = {
  isOpen: true,
  onClose: jest.fn(),
  catalogId: 'catalog-123',
};

describe('CourseAddModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAvailableCourses.mockReturnValue({
      data: mockCourses,
      isLoading: false,
    });
    mockUseAddCoursesToCatalog.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
  });

  it('renders the modal with title and tabs', () => {
    renderWrapper(<CourseAddModal {...defaultProps} />);

    expect(screen.getByText('Add Courses to Catalog')).toBeInTheDocument();
    expect(screen.getByText('Base Catalog Courses')).toBeInTheDocument();
    expect(screen.getByText("My Organization's Courses")).toBeInTheDocument();
  });

  it('displays loading state when courses are loading', () => {
    mockUseAvailableCourses.mockReturnValue({
      data: { base: [], organization: [] },
      isLoading: true,
    });

    renderWrapper(<CourseAddModal {...defaultProps} />);

    const spinners = screen.getAllByRole('status');
    expect(spinners).toHaveLength(1);
  });

  it('renders courses in base catalog tab', () => {
    renderWrapper(<CourseAddModal {...defaultProps} />);

    expect(screen.getByText('Course 1')).toBeInTheDocument();
    expect(screen.getByText('Course 2')).toBeInTheDocument();
  });

  it('renders base courses by default', () => {
    renderWrapper(<CourseAddModal {...defaultProps} />);

    expect(screen.getByText('Course 1')).toBeInTheDocument();
    expect(screen.getByText('Course 2')).toBeInTheDocument();
  });

  it('calls onClose when modal is closed', async () => {
    const user = userEvent.setup();
    renderWrapper(<CourseAddModal {...defaultProps} />);

    // Click the close button (assuming ModalLayout has a close button)
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls add mutation when save button is clicked', async () => {
    const user = userEvent.setup();
    const mockMutate = jest.fn();
    mockUseAddCoursesToCatalog.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    renderWrapper(<CourseAddModal {...defaultProps} />);

    // Select a course first
    const courseCheckbox = screen.getByLabelText(/Course 1/i);
    await user.click(courseCheckbox);

    // Click save button
    const saveButton = screen.getByText('Add Selected Courses');
    await user.click(saveButton);

    expect(mockMutate).toHaveBeenCalledWith(
      {
        catalogId: 'catalog-123',
        courseIds: ['course1'],
      },
      {
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      },
    );
  });

  it('disables save button when mutation is pending', () => {
    mockUseAddCoursesToCatalog.mockReturnValue({
      mutate: jest.fn(),
      isPending: true,
    });

    renderWrapper(<CourseAddModal {...defaultProps} />);

    const saveButton = screen.getByRole('button', { name: /add selected courses/i });
    expect(saveButton).toBeDisabled();
  });

  it('shares selected courses between tabs', async () => {
    const user = userEvent.setup();
    renderWrapper(<CourseAddModal {...defaultProps} />);

    // Select a course from base tab
    const course1Checkbox = screen.getByLabelText(/Course 1/i);
    await user.click(course1Checkbox);

    // Switch to organization tab
    await user.click(screen.getByText("My Organization's Courses"));

    // Select a course from organization tab
    const course3Checkbox = screen.getByLabelText(/Course 3/i);
    await user.click(course3Checkbox);
    // Click save button
    const saveButton = screen.getByRole('button', { name: /add selected courses/i });
    await user.click(saveButton);

    const mockMutate = mockUseAddCoursesToCatalog.mock.results[0].value.mutate;
    expect(mockMutate).toHaveBeenCalledWith(
      {
        catalogId: 'catalog-123',
        courseIds: ['course1', 'course3'],
      },
      {
        onError: expect.any(Function),
        onSuccess: expect.any(Function),
      },
    );
  });
  it('shows notification on successful addition of courses', async () => {
    const user = userEvent.setup();

    const mockMutate = jest.fn().mockImplementationOnce(
      (_, { onSuccess }) => {
        onSuccess([mockCourses.base[0]]);
      },
    );

    mockUseAddCoursesToCatalog.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    renderWrapper(<CourseAddModal {...defaultProps} />);

    // Select a course
    await user.click(screen.getByLabelText(/Course 1/i));

    // Submit
    await user.click(
      screen.getByRole('button', { name: /add selected courses/i }),
    );

    expect(mockMutate).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        /1 course.*successfully added to the catalog/i,
      );
    });
  });
});
