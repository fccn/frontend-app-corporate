import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'wouter';
import { useIntl } from '@edx/frontend-platform/i18n';

import FormLayout from '@src/app/FormLayout';
import { FormElement } from '@src/app/FormLayout/types';
import { useCatalogDetails } from '@src/catalogs/hooks';

import { EMPTY_FORM_STATE } from './constants';
import messages from './messages';

interface CatalogEditFormProps {
  selectedCatalog: string | number;
}

const CatalogEditForm: FC<CatalogEditFormProps> = ({ selectedCatalog }) => {
  const intl = useIntl();
  const { partnerId } = useParams<{ partnerId: string }>();
  const { catalogDetails } = useCatalogDetails({
    partnerId,
    selectedCatalog,
  });

  const methods = useForm({
    defaultValues: catalogDetails ?? EMPTY_FORM_STATE,
    mode: 'onChange',
  });

  const CATALOG_FORM_CONFIG: FormElement[] = [
    { type: 'title', label: intl.formatMessage(messages.formGeneralInformation) },
    { name: 'isPublic', type: 'switch', label: intl.formatMessage(messages.formIsPublic) },
    { name: 'name', type: 'text', label: intl.formatMessage(messages.formName) },
    { name: 'catalogAlternativeLink', type: 'text', label: intl.formatMessage(messages.formCatalogAlternativeLink) },
    { name: 'supportEmail', type: 'email', label: intl.formatMessage(messages.formSupportEmail) },
    {
      type: 'group',
      fields: [
        { name: 'availableStartDate', type: 'date', label: intl.formatMessage(messages.formAvailableStartDate) },
        { name: 'availableEndDate', type: 'date', label: intl.formatMessage(messages.formAvailableEndDate) },
      ],
    },
    { type: 'divider' },

    { type: 'title', label: intl.formatMessage(messages.formEnrollmentSettings) },
    {
      type: 'group',
      fields: [
        { name: 'courseEnrollmentLimit', type: 'number', label: intl.formatMessage(messages.formCourseEnrollmentLimit) },
        { name: 'userLimit', type: 'number', label: intl.formatMessage(messages.formUserLimit) },
      ],
    },
    { type: 'divider' },

    { type: 'title', label: intl.formatMessage(messages.formAdvancedSettings) },
    { name: 'emailRegexes', type: 'multiple-text', label: intl.formatMessage(messages.formEmailRegexes) },
    { name: 'customCourses', type: 'switch', label: intl.formatMessage(messages.formCustomCourses) },
    { name: 'isSelfEnrollment', type: 'switch', label: intl.formatMessage(messages.formIsSelfEnrollment) },
  ];

  return (
    <FormProvider {...methods}>
      <FormLayout form={CATALOG_FORM_CONFIG} />
    </FormProvider>
  );
};

export default CatalogEditForm;
