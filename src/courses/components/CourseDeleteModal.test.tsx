import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWrapper } from '@src/setupTest';
import * as hooks from '../data/hooks';

import CourseDeleteModal from './CourseDeleteModal';

jest.mock('../data/hooks', () => ({
  useDeleteCatalogCourse: jest.fn(),
}));

const mockUseDeleteCatalogCourse = hooks.useDeleteCatalogCourse as jest.Mock;

describe('CourseDeleteModal', () => {
  const mockOnClose = jest.fn();
  const mockDeleteMutation = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    catalogId: 'catalog-123',
    catalogName: 'Test Catalog',
    selectedCourses: [1, 2, 3],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDeleteCatalogCourse.mockReturnValue({
      mutate: mockDeleteMutation,
      mutateAsync: mockDeleteMutation,
    });
  });

  it('renders modal when isOpen is true', () => {
    renderWrapper(<CourseDeleteModal {...defaultProps} />);

    expect(screen.getByText('Delete Courses from Catalog')).toBeInTheDocument();
    expect(screen.getByText('You are about to delete 3 courses from Test Catalog catalog.')).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    renderWrapper(<CourseDeleteModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText('Delete Courses from Catalog')).not.toBeInTheDocument();
  });

  it('displays correct title for single course', () => {
    renderWrapper(<CourseDeleteModal {...defaultProps} selectedCourses={[1]} />);

    expect(screen.getByText('Delete Course from Catalog')).toBeInTheDocument();
  });

  it('displays correct title for multiple courses', () => {
    renderWrapper(<CourseDeleteModal {...defaultProps} />);

    expect(screen.getByText('Delete Courses from Catalog')).toBeInTheDocument();
  });

  it('displays correct title when no courses selected', () => {
    renderWrapper(<CourseDeleteModal {...defaultProps} selectedCourses={[]} />);

    expect(screen.getByText('Delete Courses from Catalog')).toBeInTheDocument();
  });

  it('displays correct subtitle with course count and catalog name', () => {
    renderWrapper(<CourseDeleteModal {...defaultProps} />);

    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
      'You are about to delete 3 courses from Test Catalog catalog.',
    );
  });

  it('displays correct subtitle for single course', () => {
    renderWrapper(<CourseDeleteModal {...defaultProps} selectedCourses={[1]} />);

    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
      'You are about to delete a course from Test Catalog catalog.',
    );
  });

  it('displays description list items', () => {
    renderWrapper(<CourseDeleteModal {...defaultProps} />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
    expect(listItems[0]).toHaveTextContent('This action will hide the course from learners in this catalog.');
    expect(listItems[1]).toHaveTextContent('Learners already enrolled in this course will keep their progress and certificates, but new enrollments will no longer be possible through this catalog.');
    expect(listItems[2]).toHaveTextContent('This does not delete the course from the platform or from other catalogs.');
  });

  it('renders delete button with correct text', () => {
    renderWrapper(<CourseDeleteModal {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Yes, Delete' })).toBeInTheDocument();
  });

  it('calls delete mutation and onClose when delete button is clicked', async () => {
    const user = userEvent.setup();
    renderWrapper(<CourseDeleteModal {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: 'Yes, Delete' }));

    expect(mockDeleteMutation).toHaveBeenCalledWith({
      catalogId: 'catalog-123',
      data: { catalogCourseIds: [1, 2, 3] },
    });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call delete mutation when no courses selected', async () => {
    const user = userEvent.setup();
    renderWrapper(<CourseDeleteModal {...defaultProps} selectedCourses={[]} />);

    await user.click(screen.getByRole('button', { name: 'Yes, Delete' }));

    expect(mockDeleteMutation).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('does not call delete mutation when selectedCourses is undefined', async () => {
    const user = userEvent.setup();
    renderWrapper(<CourseDeleteModal {...defaultProps} selectedCourses={undefined} />);

    await user.click(screen.getByRole('button', { name: 'Yes, Delete' }));

    expect(mockDeleteMutation).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('handles missing catalogName gracefully', () => {
    renderWrapper(<CourseDeleteModal {...defaultProps} catalogName={undefined} />);

    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
      'You are about to delete 3 courses from catalog.',
    );
  });

  it('calls onClose when modal close button is clicked', async () => {
    const user = userEvent.setup();
    renderWrapper(<CourseDeleteModal {...defaultProps} />);

    await user.click(screen.getByText('Cancel'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('handles null selectedCourses count in title', () => {
    renderWrapper(<CourseDeleteModal {...defaultProps} selectedCourses={undefined} />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Delete Courses from Catalog');
  });

  it('handles null selectedCourses count in subtitle', () => {
    renderWrapper(<CourseDeleteModal {...defaultProps} selectedCourses={undefined} />);

    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
      'You are about to delete 0 courses from Test Catalog catalog.',
    );
  });
});
