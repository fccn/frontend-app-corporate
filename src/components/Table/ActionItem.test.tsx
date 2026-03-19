import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWrapper } from '@src/setupTest';
import ActionItem from './ActionItem';

describe('ActionItem', () => {
  const types = ['view', 'delete', 'analytics'] as const;

  types.forEach((type) => {
    it(`renders correctly for type "${type}"`, async () => {
      const user = userEvent.setup();
      renderWrapper(<ActionItem type={type} />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', expect.stringMatching(new RegExp(type, 'i')));
      await user.hover(button);

      // Tooltip appears asynchronously
      await waitFor(() => {
        const tooltip = screen.getByText(type.replace(/^\w/, (c) => c.toUpperCase()));
        expect(tooltip).toBeInTheDocument();
      });
    });
  });

  it('calls onClick when button is clicked', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    renderWrapper(<ActionItem type="view" onClick={onClick} />);
    const button = screen.getByRole('button');
    await user.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  it('uses custom ariaLabel when provided', () => {
    renderWrapper(<ActionItem type="view" ariaLabel="Custom Label" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Custom Label');
  });
});
