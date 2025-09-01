import { Form } from '@openedx/paragon';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { BaseFormField } from './types';

const FormField: FC<BaseFormField> = ({
  type, label, name, as, ...props
}) => {
  const { register, control } = useFormContext();

  if (type === 'multiple-text') {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => (
          <Form.Group as={as} controlId={name}>
            <Form.Label className="font-weight-bold">{label}</Form.Label>
            <Form.Control
              id={name}
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value.split(',').map((v) => v.trim()))}
              {...props}
            />
          </Form.Group>
        )}
      />
    );
  }

  if (type === 'switch') {
    return (
      <Form.Group controlId={name} className="d-flex align-items-center">
        <Form.Label className="mb-0 flex-grow-1 font-weight-bold">{label}</Form.Label>
        <Form.Switch
          {...register(name, {
            onChange: (e) => e.target.checked,
          })}
          floatLabelLeft
          {...props}
        />
      </Form.Group>
    );
  }

  return (
    <Form.Group as={as} controlId={name}>
      <Form.Label className="font-weight-bold">{label}</Form.Label>
      <Form.Control id={name} {...register(name)} type={type} {...props} />
    </Form.Group>
  );
};

export default FormField;
