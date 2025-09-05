import { ReactNode } from 'react';
import { screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';

import { renderWrapper } from '@src/setupTest';
import FormLayout from './index';
import { FormElement } from './types';

// Mock the FormField component
jest.mock('./FormField', () => function FormField({
  name, label, type, as: Component = 'div', ...props
}: any) {
  return (
    <Component>
      <label htmlFor={name}>{label}</label>
      <input id={name} type={type} {...props} />
    </Component>
  );
});

describe('FormLayout', () => {
  const TestWrapper = ({ children, defaultValues = {} }: { children: ReactNode; defaultValues?: any }) => {
    const methods = useForm({ defaultValues });
    return (
      <FormProvider {...methods}>
        {children}
      </FormProvider>
    );
  };

  const renderFormLayout = (form: FormElement[], defaultValues = {}) => renderWrapper(
    <TestWrapper defaultValues={defaultValues}>
      <FormLayout form={form} />
    </TestWrapper>,
  );

  it('renders grouped form fields correctly', () => {
    const form: FormElement[] = [
      {
        type: 'group',
        fields: [
          { type: 'text', name: 'firstName', label: 'First Name' },
          { type: 'text', name: 'lastName', label: 'Last Name' },
        ],
      },
    ];

    renderFormLayout(form);

    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
  });

  it('renders mixed form elements correctly', () => {
    const form: FormElement[] = [
      { type: 'title', label: 'Personal Information' },
      { type: 'text', name: 'fullName', label: 'Full Name' },
      { type: 'divider' },
      { type: 'title', label: 'Contact Details' },
      {
        type: 'group',
        fields: [
          { type: 'email', name: 'email', label: 'Email' },
          { type: 'text', name: 'phone', label: 'Phone' },
        ],
      },
      { type: 'switch', name: 'newsletter', label: 'Subscribe to Newsletter' },
    ];

    const { container } = renderFormLayout(form);

    // Check titles
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Contact Details')).toBeInTheDocument();

    // Check individual field
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();

    // Check divider
    expect(container.querySelectorAll('hr')).toHaveLength(1);

    // Check grouped fields
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone')).toBeInTheDocument();

    // Check switch field
    expect(screen.getByLabelText('Subscribe to Newsletter')).toBeInTheDocument();
  });
});
