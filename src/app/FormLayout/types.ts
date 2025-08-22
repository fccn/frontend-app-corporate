export type FormFieldType = 'text' | 'email' | 'number' | 'date' | 'switch' | 'multiple-text';

export interface BaseFormField {
  name: string;
  label: string;
  type: FormFieldType;
  as?: React.ElementType;
}

export interface FormGroup {
  type: 'group';
  fields: BaseFormField[];
}

export interface FormTitle {
  type: 'title';
  label: string;
}

export interface FormDivider {
  type: 'divider';
}

export type FormElement = BaseFormField | FormGroup | FormTitle | FormDivider;
