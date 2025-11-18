import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'wouter';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Col, Form, Stack } from '@openedx/paragon';

import { useCatalogDetails } from '@src/catalogs/data/hooks';

import { EMPTY_FORM_STATE } from '../constants';
import messages from '../messages';

interface CatalogEditFormProps {
  selectedCatalog: string | number;
}

const defaultLimitedEditable = ['catalogAlternativeLink', 'supportEmail', 'authorizationMessage', 'emailRegexes'];

const CatalogEditForm = ({ selectedCatalog }: CatalogEditFormProps) => {
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
      <h3 className="h3 text-primary-400">{intl.formatMessage(messages['corporate.catalog.form.general.information.title'])}</h3>

      {/* Catalog Name */}
      <Form.Group controlId="name">
        <Form.Label className="font-weight-bold">{intl.formatMessage(messages['corporate.catalog.form.name.field'])}</Form.Label>
        <Form.Control id="name" {...register('name')} type="text" />
      </Form.Group>

      {/* Alternative Link */}
      <Form.Group controlId="catalogAlternativeLink">
        <Form.Label className="font-weight-bold">{intl.formatMessage(messages['corporate.catalog.form.alternative.link.field'])}</Form.Label>
        <Form.Control id="catalogAlternativeLink" {...register('alternativeLink')} type="text" />
      </Form.Group>

      {/* Support Email */}
      <Form.Group controlId="supportEmail">
        <Form.Label className="font-weight-bold">{intl.formatMessage(messages['corporate.catalog.form.support.email.field'])}</Form.Label>
        <Form.Control id="supportEmail" {...register('supportEmail')} type="email" />
      </Form.Group>

      {/* Date Range Group */}
      <Form.Row>
        <Controller
          control={control}
          name="availableStartDate"
          render={({ field: { value, onChange } }) => (
            <Form.Group as={Col} controlId="availableStartDate">
              <Form.Label className="font-weight-bold">{intl.formatMessage(messages['corporate.catalog.form.available.start.date.field'])}</Form.Label>
              <Form.Control
                id="availableStartDate"
                value={value ? new Date(value).toISOString().split('T')[0] : ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(new Date(e.target.value).toISOString())}
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
              <Form.Label className="font-weight-bold">{intl.formatMessage(messages['corporate.catalog.form.available.end.date.field'])}</Form.Label>
              <Form.Control
                id="availableEndDate"
                value={value ? new Date(value).toISOString().split('T')[0] : ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const date = e.target.value;
                  // Set time to 23:59:59.999 for the selected day
                  const endDate = new Date(date);
                  endDate.setHours(23, 59, 59, 999);
                  onChange(endDate.toISOString());
                }}
                type="date"
              />
            </Form.Group>
          )}
        />
      </Form.Row>

      {/* Divider */}
      <hr className="w-100" />

      {/* Enrollment Settings Section */}
      <h3 className="h3 text-primary-400">{intl.formatMessage(messages['corporate.catalog.form.enrollment.settings.title'])}</h3>

      {/* Enrollment Limits Group */}
      <Form.Row>
        <Form.Group as={Col} controlId="courseEnrollmentLimit">
          <Form.Label className="font-weight-bold">{intl.formatMessage(messages['corporate.catalog.form.course.enrollment.limit.field'])}</Form.Label>
          <Form.Control id="courseEnrollmentLimit" {...register('courseEnrollmentsLimit')} type="number" />
        </Form.Group>
        <Form.Group as={Col} controlId="userLimit">
          <Form.Label className="font-weight-bold">{intl.formatMessage(messages['corporate.catalog.form.user.limit.field'])}</Form.Label>
          <Form.Control id="userLimit" {...register('userLimit')} type="number" />
        </Form.Group>
      </Form.Row>

      {/* Divider */}
      <hr className="w-100" />

      {/* Advanced Settings Section */}
      <h3 className="h3 text-primary-400">{intl.formatMessage(messages['corporate.catalog.form.advanced.settings.title'])}</h3>
      <Form.Row>

        <Form.Group as={Col} controlId="authorizationMessage">
          <Form.Label className="font-weight-bold">{intl.formatMessage(messages['corporate.catalog.form.authorization.message.field'])}</Form.Label>
          <Form.Control id="authorizationMessage" {...register('authorizationMessage')} as="textarea" />
        </Form.Group>
      </Form.Row>

      {/* Email Regexes */}
      <Controller
        control={control}
        name="emailRegexes"
        render={({ field: { value, onChange } }) => (
          <Form.Group controlId="emailRegexes">
            <Form.Label className="font-weight-bold">{intl.formatMessage(messages['corporate.catalog.form.email.regexes.field'])}</Form.Label>
            <Form.Control
              id="emailRegexes"
              type="text"
              value={Array.isArray(value) ? value.join(', ') : value || ''}
              onChange={(e) => onChange(e.target.value.split(',').map((v) => v.trim()))}
            />
          </Form.Group>
        )}
      />
      {/* Self Enrollment Switch */}
      <Form.Group controlId="isSelfEnrollment" className="d-flex align-items-center">
        <Form.Label className="mb-0 flex-grow-1 font-weight-bold">
          {intl.formatMessage(messages['corporate.catalog.form.is.self.enrollment.field'])}
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
