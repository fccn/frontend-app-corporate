import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWrapper } from '@src/setupTest';
import RegexInput from './RegexInput';

const renderRegexInput = (props = {}) => renderWrapper(
  <RegexInput
    value={['@example.com$', '^user@domain.org$']}
    onChange={jest.fn()}
    isEditable={jest.fn().mockReturnValue(true)}
    {...props}
  />,
);

describe('RegexInput', () => {
  it('renders with initial value formatted correctly', () => {
    renderRegexInput();

    const input = screen.getByDisplayValue('@example.com, user@domain.org');
    expect(input).toBeInTheDocument();
  });

  it('displays label and description', () => {
    renderRegexInput();

    expect(screen.getByText('Allowed email domains')).toBeInTheDocument();
    expect(screen.getByText(/Add comma-separated email domains allowed to self-enroll/)).toBeInTheDocument();
  });

  it('calls onChange with parsed array on blur', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    renderRegexInput({ onChange: mockOnChange });

    const input = screen.getByDisplayValue('@example.com, user@domain.org');
    await user.clear(input);
    await user.type(input, 'newdomain.com, another.org');
    await user.tab();

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(['newdomain.com', 'another.org']);
    });
  });

  it('handles empty values correctly', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    renderRegexInput({ onChange: mockOnChange, value: [] });

    const input = screen.getByDisplayValue('');
    await user.type(input, 'test.com');
    await user.tab();

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(['test.com']);
    });
  });

  it('filters out empty strings when parsing, adding to previous values', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    renderRegexInput({ onChange: mockOnChange });

    const input = screen.getByDisplayValue('@example.com, user@domain.org');
    await user.type(input, ',test.com, , another.com, ');
    await user.tab();

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(['@example.com', 'user@domain.org', 'test.com', 'another.com']);
    });
  });

  it('respects disabled state', () => {
    const mockIsEditable = jest.fn().mockReturnValue(false);
    renderRegexInput({ isEditable: mockIsEditable });

    const input = screen.getByDisplayValue('@example.com, user@domain.org');
    expect(input).toBeDisabled();
  });
});
