import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'wouter';
import { useCatalogDetails } from '@src/catalogs/hooks';
import { useCatalogFormModal } from '@src/hooks/useCatalogFormModal';
import FormLayout from '../FormLayout';
import { FormElement } from '../FormLayout/types';

interface CatalogEditFormProps {
  selectedCatalog: string | number | null;
}

const CATALOG_FORM_CONFIG: FormElement[] = [
  { type: 'title', label: 'General Information' },
  { name: 'isPublic', type: 'switch', label: 'Public Catalog' },
  { name: 'name', type: 'text', label: 'Catalog Name' },
  { name: 'catalogAlternativeLink', type: 'text', label: 'Alternative Link' },
  { name: 'supportEmail', type: 'email', label: 'Support Email' },
  {
    type: 'group',
    fields: [
      { name: 'availableStartDate', type: 'date', label: 'Start Date' },
      { name: 'availableEndDate', type: 'date', label: 'End Date' },
    ],
  },
  { type: 'divider' },

  { type: 'title', label: 'Enrollment Settings' },
  {
    type: 'group',
    fields: [
      { name: 'courseEnrollmentLimit', type: 'number', label: 'Course Enrollment Limit' },
      { name: 'userLimit', type: 'number', label: 'User Limit' },
    ],
  },
  { type: 'divider' },

  { type: 'title', label: 'Advanced Settings' },
  { name: 'emailRegexes', type: 'multiple-text', label: 'Partner Email Regex' },
  { name: 'customCourses', type: 'switch', label: 'Enable Custom Courses' },
  { name: 'isSelfEnrollment', type: 'switch', label: 'Self Enrollment' },
];

const CatalogEditForm: FC<CatalogEditFormProps> = ({ selectedCatalog }) => {
  const { partnerId } = useParams<{ partnerId: string }>();
  const { queryKeyVariables } = useCatalogFormModal();

  const { partnerDetails } = useCatalogDetails({ partnerId, selectedCatalog, queryKeyVariables });

  const methods = useForm({
    defaultValues: partnerDetails,
    mode: 'onChange',
  });

  return (
    <FormProvider {...methods}>
      <FormLayout form={CATALOG_FORM_CONFIG} />
    </FormProvider>
  );
};

export default CatalogEditForm;
