import {
  screen, waitFor, act, render,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWrapper } from '@src/setupTest';
import { useNotification } from './NotificationProvider';

const TestComponent = () => {
  const { showNotification } = useNotification();

  return (
    <div>
      <button type="button" onClick={() => showNotification('Success message', 'success')}>
        Show Success
      </button>
      <button type="button" onClick={() => showNotification('Error message', 'error')}>
        Show Error
      </button>
      <button type="button" onClick={() => showNotification('Default message')}>
        Show Default
      </button>
    </div>
  );
};

describe('NotificationProvider', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders children correctly', () => {
    // Render wrapper has the Notification Provider by default
    renderWrapper(<div>Test Content</div>);

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('shows success notification when showNotification is called', async () => {
    const user = userEvent.setup({ delay: null });
    renderWrapper(<TestComponent />);

    const button = screen.getByText('Show Success');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('Success message')).toBeInTheDocument();
    });
  });

  it('shows error notification when showNotification is called with error type', async () => {
    const user = userEvent.setup({ delay: null });
    renderWrapper(<TestComponent />);

    const button = screen.getByText('Show Error');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });
  });

  it('shows default notification when type is not specified', async () => {
    const user = userEvent.setup({ delay: null });
    renderWrapper(<TestComponent />);

    const button = screen.getByText('Show Default');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('Default message')).toBeInTheDocument();
    });
  });

  it('allows multiple notifications to be displayed', async () => {
    const user = userEvent.setup({ delay: null });
    renderWrapper(<TestComponent />);

    await user.click(screen.getByText('Show Success'));
    await user.click(screen.getByText('Show Error'));

    await waitFor(() => {
      expect(screen.getByText('Success message')).toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });
  });

  it('throws error when useNotification is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useNotification must be used within a NotificationProvider');

    consoleSpy.mockRestore();
  });

  it('closes notification when onClose is called', async () => {
    const user = userEvent.setup({ delay: null });
    renderWrapper(<TestComponent />);

    await user.click(screen.getByText('Show Success'));

    await waitFor(() => {
      expect(screen.getByText('Success message')).toBeInTheDocument();
    });

    // Find and click the close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    // Advance timers to trigger the setTimeout cleanup
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Notification should be removed from DOM after cleanup
    await waitFor(() => {
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    });
  });
});
