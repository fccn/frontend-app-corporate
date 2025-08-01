import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

export const renderWrapper = (children) => render(
  // eslint-disable-next-line react/jsx-filename-extension
  <IntlProvider locale="en">
    {children}
  </IntlProvider>,
);
