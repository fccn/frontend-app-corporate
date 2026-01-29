import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWrapper } from '@src/setupTest';
import { CELERY_STATUS } from '@src/constants';
import LearnerDeleteModal from './LearnerDeleteModal';
import * as hooks from '../data/hooks';

// Mock the hooks
jest.mock('../data/hooks', () => ({
  useRemoveLearners: jest.fn(),
}));

const mockUseRemoveLearners = hooks.useRemoveLearners as jest.Mock;

const renderLearnerDeleteModal = (props: any) => renderWrapper(<LearnerDeleteModal {...props} />);

describe('LearnerDeleteModal', () => {
  const mockOnClose = jest.fn();
  const mockMutate = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    catalogId: 'test-catalog-123',
    catalogName: 'Test Catalog',
    selectedLearners: [
      {
        id: 1,
        user: {
          fullName: 'John Doe',
          email: 'john@example.com',
        },
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockMutate.mockImplementation((_variables, options) => {
      if (options?.onSuccess) {
        options.onSuccess({ status: CELERY_STATUS.SUCCESS });
      }
    });
    mockUseRemoveLearners.mockReturnValue({
      mutate: mockMutate,
    });
  });

  it('renders modal when isOpen is true', () => {
    renderLearnerDeleteModal(defaultProps);

    expect(screen.getByRole('presentation')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Delete Learners from Catalog');
  });

  it('does not render modal when isOpen is false', () => {
    renderLearnerDeleteModal({ ...defaultProps, isOpen: false });

    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
  });

  it('displays correct confirmation message with learner details', () => {
    renderLearnerDeleteModal(defaultProps);

    expect(screen.getByText(/You are about to remove John Doe \(john@example\.com\) from "Test Catalog" catalog\./i)).toBeInTheDocument();
  });

  it('displays description list with consequences', () => {
    renderLearnerDeleteModal(defaultProps);

    expect(screen.getByText('The learner will lose access to this catalog and will no longer see its courses.')).toBeInTheDocument();
    expect(screen.getByText('Any active enrollments in open/free courses will be preserved (progress and certificates remain intact).')).toBeInTheDocument();
    expect(screen.getByText('If the learner was enrolled in paid or verified-mode courses only through this catalog, their enrollment may be downgraded to audit mode.')).toBeInTheDocument();
  });

  it('renders delete button with correct text', () => {
    renderLearnerDeleteModal(defaultProps);

    expect(screen.getByRole('button', { name: 'Delete Learner' })).toBeInTheDocument();
  });

  it('calls removeLearners and onClose when delete button is clicked', async () => {
    const user = userEvent.setup();
    renderLearnerDeleteModal(defaultProps);

    const deleteButton = screen.getByRole('button', { name: 'Delete Learner' });
    await user.click(deleteButton);

    expect(mockMutate).toHaveBeenCalledWith(
      {
        catalogId: 'test-catalog-123',
        learnerIds: [1],
      },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('handles multiple selected learners', async () => {
    const user = userEvent.setup();
    const propsWithMultipleLearners = {
      ...defaultProps,
      selectedLearners: [
        {
          id: 1,
          user: { fullName: 'John Doe', email: 'john@example.com' },
        },
        {
          id: 2,
          user: { fullName: 'Jane Smith', email: 'jane@example.com' },
        },
      ],
    };

    renderLearnerDeleteModal(propsWithMultipleLearners);

    expect(screen.getByText(/You are about to remove 2 learners from "Test Catalog" catalog\./i)).toBeInTheDocument();

    const deleteButton = screen.getByRole('button', { name: 'Delete Learner' });
    await user.click(deleteButton);

    expect(mockMutate).toHaveBeenCalledWith(
      {
        catalogId: 'test-catalog-123',
        learnerIds: [1, 2],
      },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });

  it('does not call removeLearners when selectedLearners is empty', async () => {
    const user = userEvent.setup();
    renderLearnerDeleteModal({ ...defaultProps, selectedLearners: [] });

    const deleteButton = screen.getByRole('button', { name: 'Delete Learner' });
    await user.click(deleteButton);

    expect(mockMutate).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('does not call removeLearners when selectedLearners is undefined', async () => {
    const user = userEvent.setup();
    renderLearnerDeleteModal({ ...defaultProps, selectedLearners: undefined });

    const deleteButton = screen.getByRole('button', { name: 'Delete Learner' });
    await user.click(deleteButton);

    expect(mockMutate).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('calls onClose when modal close button is clicked', async () => {
    const user = userEvent.setup();
    renderLearnerDeleteModal(defaultProps);

    const closeButton = screen.getByLabelText('Close');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
