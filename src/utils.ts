import { Resolver } from 'react-hook-form';
import { FieldValues, FieldErrorsImpl } from 'react-hook-form';
import { SchemaOf, ValidationError } from 'yup';

export function yupValidationResolver<TFieldValues extends FieldValues>(
  validationSchema: SchemaOf<TFieldValues>,
): Resolver<TFieldValues> {
  return async (values) => {
    try {
      const validatedValues = await validationSchema.validate(values, {
        abortEarly: false,
      });

      return {
        values: validatedValues as TFieldValues,
        errors: {},
      };
    } catch (err) {
      const validationError = err as ValidationError;
      const errors: FieldErrorsImpl<TFieldValues> = {};

      validationError.inner.forEach((error) => {
        if (error.path) {
          errors[error.path as keyof TFieldValues] = {
            type: error.type ?? 'validation',
            message: error.message,
          } as any;
        }
      });

      return {
        values: {} as TFieldValues,
        errors,
      };
    }
  };
}
