import { screen, fireEvent } from '@testing-library/react';
import { renderWrapper } from '@src/setupTest';
import ModalLayout from './ModalLayout';

describe('ModalLayout', () => {
  const defaultProps = {
    title: 'Test Modal Title',
    isOpen: true,
    onClose: jest.fn(),
    actions: <button type="button">Save</button>,
    children: <div>Modal content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when modal is open', () => {
    renderWrapper(<ModalLayout {...defaultProps} />);

    expect(screen.getByText('Test Modal Title')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('does not render when modal is closed', () => {
    renderWrapper(
      <ModalLayout {...defaultProps} isOpen={false} />,
    );

    expect(screen.queryByText('Test Modal Title')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    const onCloseMock = jest.fn();
    renderWrapper(
      <ModalLayout {...defaultProps} onClose={onCloseMock} />,
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('renders multiple actions correctly', () => {
    const multipleActions = [
      <button key="jump" type="button">Jump</button>,
      <button key="listen" type="button">Listen</button>,
    ];

    renderWrapper(
      <ModalLayout {...defaultProps} actions={multipleActions} />,
    );

    expect(screen.getByText('Listen')).toBeInTheDocument();
    expect(screen.getByText('Jump')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('renders with complex children content', () => {
    const complexChildren = (
      <div>
        <h2>Form Title</h2>
        <form>
          <input type="text" placeholder="Enter name" />
          <textarea placeholder="Enter description" />
        </form>
      </div>
    );

    renderWrapper(
      <ModalLayout {...defaultProps}>
        {complexChildren}
      </ModalLayout>,
    );

    expect(screen.getByText('Form Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
  });
});
