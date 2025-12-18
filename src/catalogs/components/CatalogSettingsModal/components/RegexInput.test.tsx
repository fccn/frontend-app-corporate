import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';

import { renderWrapper } from '../../../../setupTest';
import RegexInput from './RegexInput';

const renderRegexInput = (props = {}) => renderWrapper(
  <RegexInput
    value={['@example\\.com$', '^user@domain\\.org$']}
    onChange={jest.fn()}
    isEditable={jest.fn().mockReturnValue(true)}
    {...props}
  />,
);

describe('RegexInput', () => {
  it('renders with initial value formatted correctly', () => {
    renderRegexInput();

    const input = screen.getByDisplayValue('@example\\.com, user@domain\\.org');
    expect(input).toBeInTheDocument();
  });

  it('displays label and description', () => {
    renderRegexInput();

    expect(screen.getByText('Allowed email domains')).toBeInTheDocument();
    expect(screen.getByText(/Add the email domains allowed to self-enroll/)).toBeInTheDocument();
  });

  it('calls onChange with parsed array on blur', async () => {
    const mockOnChange = jest.fn();
    renderRegexInput({ onChange: mockOnChange });

    const input = screen.getByDisplayValue('@example\\.com, user@domain\\.org');
    fireEvent.change(input, { target: { value: 'newdomain.com, another.org' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(['newdomain.com', 'another.org']);
    });
  });

  it('handles empty values correctly', async () => {
    const mockOnChange = jest.fn();
    renderRegexInput({ onChange: mockOnChange, value: [] });

    const input = screen.getByDisplayValue('');
    fireEvent.change(input, { target: { value: 'test.com' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(['test.com']);
    });
  });

  it('filters out empty strings when parsing', async () => {
    const mockOnChange = jest.fn();
    renderRegexInput({ onChange: mockOnChange });

    const input = screen.getByDisplayValue('@example\\.com, user@domain\\.org');
    fireEvent.change(input, { target: { value: 'test.com, , another.com, ' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(['test.com', 'another.com']);
    });
  });

  it('respects disabled state', () => {
    const mockIsEditable = jest.fn().mockReturnValue(false);
    renderRegexInput({ isEditable: mockIsEditable });

    const input = screen.getByDisplayValue('@example\\.com, user@domain\\.org');
    expect(input).toBeDisabled();
  });
});
