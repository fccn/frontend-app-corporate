import { Col, Form, Stack } from '@openedx/paragon';
import { FC } from 'react';
import { BaseFormField, FormElement } from './types';
import FormField from './FormField';

interface FormLayoutProps {
  form: FormElement[];
}

const FormLayout: FC<FormLayoutProps> = ({ form }) => (
  <Stack gap={3} className="py-4">
    {form.map((field) => {
      if (field.type === 'title') {
        return <h3 className="h3 text-primary-400">{field.label}</h3>;
      }

      if (field.type === 'divider') {
        return <hr className="w-100" />;
      }

      if (field.type === 'group') {
        return (
          <Form.Row>
            {field.fields.map((groupField) => (
              <FormField {...groupField as BaseFormField} as={Col} />
            ))}
          </Form.Row>
        );
      }

      return (<FormField {...field as BaseFormField} />);
    })}
  </Stack>
);

export default FormLayout;
