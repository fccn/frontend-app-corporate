import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWrapper } from '@src/setupTest';
import ActionItem from './ActionItem';

describe('ActionItem', () => {
  const types = ['view', 'edit', 'delete', 'analytics'] as const;

  types.forEach((type) => {
    it(`renders correctly for type "${type}"`, async () => {
      renderWrapper(<ActionItem type={type} />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', `${type}-action`);
      fireEvent.mouseOver(button);

      // Tooltip appears asynchronously
      await waitFor(() => {
        const tooltip = screen.getByText(type.replace(/^\w/, (c) => c.toUpperCase()));
        expect(tooltip).toBeInTheDocument();
      });
    });
  });

  it('calls onClick when button is clicked', () => {
    const onClick = jest.fn();
    renderWrapper(<ActionItem type="view" onClick={onClick} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  it('uses custom ariaLabel when provided', () => {
    renderWrapper(<ActionItem type="edit" ariaLabel="Custom Label" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Custom Label');
  });
});
