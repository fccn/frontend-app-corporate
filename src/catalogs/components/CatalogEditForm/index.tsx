import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'wouter';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Col, Form, Stack } from '@openedx/paragon';

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

  const { register, control } = useForm({
    defaultValues: catalogDetails ?? EMPTY_FORM_STATE,
    mode: 'onChange',
  });

  return (
    <Stack gap={3} className="py-4">
      {/* General Information Section */}
      <h3 className="h3 text-primary-400">{intl.formatMessage(messages.formGeneralInformation)}</h3>

      {/* Public Catalog Switch */}
      <Form.Group controlId="isPublic" className="d-flex align-items-center">
        <Form.Label className="mb-0 flex-grow-1 font-weight-bold">
          {intl.formatMessage(messages.formIsPublic)}
        </Form.Label>
        <Form.Switch
          {...register('isPublic', {
            onChange: (e) => e.target.checked,
          })}
          floatLabelLeft
        />
      </Form.Group>

      {/* Catalog Name */}
      <Form.Group controlId="name">
        <Form.Label className="font-weight-bold">{intl.formatMessage(messages.formName)}</Form.Label>
        <Form.Control id="name" {...register('name')} type="text" />
      </Form.Group>

      {/* Alternative Link */}
      <Form.Group controlId="catalogAlternativeLink">
        <Form.Label className="font-weight-bold">{intl.formatMessage(messages.formCatalogAlternativeLink)}</Form.Label>
        <Form.Control id="catalogAlternativeLink" {...register('catalogAlternativeLink')} type="text" />
      </Form.Group>

      {/* Support Email */}
      <Form.Group controlId="supportEmail">
        <Form.Label className="font-weight-bold">{intl.formatMessage(messages.formSupportEmail)}</Form.Label>
        <Form.Control id="supportEmail" {...register('supportEmail')} type="email" />
      </Form.Group>

      {/* Date Range Group */}
      <Form.Row>
        <Controller
          control={control}
          name="availableStartDate"
          render={({ field: { value, onChange } }) => (
            <Form.Group as={Col} controlId="availableStartDate">
              <Form.Label className="font-weight-bold">{intl.formatMessage(messages.formAvailableStartDate)}</Form.Label>
              <Form.Control
                id="availableStartDate"
                value={value ? new Date(value).toISOString().split('T')[0] : ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
                type="date"
              />
            </Form.Group>
          )}
        />
        <Controller
          control={control}
          name="availableEndDate"
          render={({ field: { value, onChange } }) => (
            <Form.Group as={Col} controlId="availableEndDate">
              <Form.Label className="font-weight-bold">{intl.formatMessage(messages.formAvailableEndDate)}</Form.Label>
              <Form.Control
                id="availableEndDate"
                value={value ? new Date(value).toISOString().split('T')[0] : ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
                type="date"
              />
            </Form.Group>
          )}
        />
      </Form.Row>

      {/* Divider */}
      <hr className="w-100" />

      {/* Enrollment Settings Section */}
      <h3 className="h3 text-primary-400">{intl.formatMessage(messages.formEnrollmentSettings)}</h3>

      {/* Enrollment Limits Group */}
      <Form.Row>
        <Form.Group as={Col} controlId="courseEnrollmentLimit">
          <Form.Label className="font-weight-bold">{intl.formatMessage(messages.formCourseEnrollmentLimit)}</Form.Label>
          <Form.Control id="courseEnrollmentLimit" {...register('courseEnrollmentLimit')} type="number" />
        </Form.Group>
        <Form.Group as={Col} controlId="userLimit">
          <Form.Label className="font-weight-bold">{intl.formatMessage(messages.formUserLimit)}</Form.Label>
          <Form.Control id="userLimit" {...register('userLimit')} type="number" />
        </Form.Group>
      </Form.Row>

      {/* Divider */}
      <hr className="w-100" />

      {/* Advanced Settings Section */}
      <h3 className="h3 text-primary-400">{intl.formatMessage(messages.formAdvancedSettings)}</h3>

      {/* Email Regexes */}
      <Controller
        control={control}
        name="emailRegexes"
        render={({ field: { value, onChange } }) => (
          <Form.Group controlId="emailRegexes">
            <Form.Label className="font-weight-bold">{intl.formatMessage(messages.formEmailRegexes)}</Form.Label>
            <Form.Control
              id="emailRegexes"
              type="text"
              value={Array.isArray(value) ? value.join(', ') : value || ''}
              onChange={(e) => onChange(e.target.value.split(',').map((v) => v.trim()))}
            />
          </Form.Group>
        )}
      />

      {/* Custom Courses Switch */}
      <Form.Group controlId="customCourses" className="d-flex align-items-center">
        <Form.Label className="mb-0 flex-grow-1 font-weight-bold">
          {intl.formatMessage(messages.formCustomCourses)}
        </Form.Label>
        <Form.Switch
          {...register('customCourses', {
            onChange: (e) => e.target.checked,
          })}
          floatLabelLeft
        />
      </Form.Group>

      {/* Self Enrollment Switch */}
      <Form.Group controlId="isSelfEnrollment" className="d-flex align-items-center">
        <Form.Label className="mb-0 flex-grow-1 font-weight-bold">
          {intl.formatMessage(messages.formIsSelfEnrollment)}
        </Form.Label>
        <Form.Switch
          {...register('isSelfEnrollment', {
            onChange: (e) => e.target.checked,
          })}
          floatLabelLeft
        />
      </Form.Group>
    </Stack>
  );
};

export default CatalogEditForm;
