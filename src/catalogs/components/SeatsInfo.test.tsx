import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWrapper } from '@src/setupTest';
import SeatsInfo from './SeatsInfo';

const detailsButton = () => screen.getByRole('button', { name: 'Seat breakdown' });

describe('SeatsInfo', () => {
  it('leads with the seats still free, out of the limit', () => {
    renderWrapper(<SeatsInfo userLimit={50} activeLearners={3} pendingInvitations={1} />);
    expect(screen.getByText('47 / 50')).toBeInTheDocument();
  });

  it('shows no limit instead of a seat count when the catalog is unlimited', () => {
    renderWrapper(<SeatsInfo userLimit={0} activeLearners={3} pendingInvitations={1} />);
    expect(screen.getByText('No limit')).toBeInTheDocument();
  });

  it('never reports negative free seats when the catalog is over its limit', () => {
    renderWrapper(<SeatsInfo userLimit={50} activeLearners={60} pendingInvitations={5} />);
    expect(screen.getByText('0 / 50')).toBeInTheDocument();
  });

  describe('breakdown tooltip', () => {
    it('counts only accepted learners against the limit', async () => {
      const user = userEvent.setup();
      renderWrapper(<SeatsInfo userLimit={50} activeLearners={3} pendingInvitations={1} />);

      // A seat is consumed on acceptance, so the pending invitation does not
      // reduce the 47 seats that can still be filled.
      await user.hover(detailsButton());
      expect(await screen.findByRole('tooltip'))
        .toHaveTextContent('3 accepted · 1 pending · 47 free of 50');
    });

    it('explains when a seat is consumed', async () => {
      const user = userEvent.setup();
      renderWrapper(<SeatsInfo userLimit={50} activeLearners={3} pendingInvitations={1} />);

      await user.hover(detailsButton());
      expect(await screen.findByRole('tooltip'))
        .toHaveTextContent('A seat is taken when an invitation is accepted');
    });

    it('reports a catalog with no seat limit', async () => {
      const user = userEvent.setup();
      renderWrapper(<SeatsInfo userLimit={0} activeLearners={3} pendingInvitations={1} />);

      await user.hover(detailsButton());
      expect(await screen.findByRole('tooltip'))
        .toHaveTextContent('This catalog has no seat limit');
    });

    it('warns when pending invitations outnumber the free seats', async () => {
      const user = userEvent.setup();
      renderWrapper(<SeatsInfo userLimit={50} activeLearners={3} pendingInvitations={60} />);

      await user.hover(detailsButton());
      expect(await screen.findByRole('tooltip'))
        .toHaveTextContent('further acceptances are rejected');
    });

    it('does not warn when pending invitations exactly fill the free seats', async () => {
      const user = userEvent.setup();
      renderWrapper(<SeatsInfo userLimit={50} activeLearners={3} pendingInvitations={47} />);

      await user.hover(detailsButton());
      expect(await screen.findByRole('tooltip'))
        .not.toHaveTextContent('further acceptances are rejected');
    });
  });

  describe('accessibility', () => {
    it('exposes the breakdown through a named, focusable control', () => {
      renderWrapper(<SeatsInfo userLimit={50} activeLearners={3} pendingInvitations={1} />);
      // A button rather than a hover-only span: named for screen readers and
      // reachable without a mouse.
      expect(detailsButton()).toHaveAttribute('type', 'button');
    });

    it('opens the tooltip on keyboard focus, not just on hover', async () => {
      const user = userEvent.setup();
      renderWrapper(<SeatsInfo userLimit={50} activeLearners={3} pendingInvitations={1} />);

      await user.tab();
      expect(detailsButton()).toHaveFocus();
      expect(await screen.findByRole('tooltip')).toBeInTheDocument();
    });

    it('announces the breakdown once, as the description of the control', async () => {
      const user = userEvent.setup();
      renderWrapper(<SeatsInfo userLimit={50} activeLearners={3} pendingInvitations={1} />);

      await user.tab();
      const tooltip = await screen.findByRole('tooltip');
      // The name stays short and the breakdown is the description, so a screen
      // reader does not read the whole sentence twice.
      expect(detailsButton()).toHaveAccessibleName('Seat breakdown');
      expect(detailsButton()).toHaveAttribute('aria-describedby', tooltip.id);
    });
  });
});
