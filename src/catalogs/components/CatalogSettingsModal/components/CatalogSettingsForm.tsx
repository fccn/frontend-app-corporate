import { useImperativeHandle, forwardRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Col, Form, Stack } from '@openedx/paragon';

import { yupValidationResolver } from '@src/utils';

import { Catalog, CatalogUpdateRequest } from '@src/types';
import { getCatalogSchema } from '../utils';
import messages from '../messages';
import { EMPTY_FORM_STATE } from '../constants';
import { useCurrentUser } from '@src/hooks';

interface CatalogSettingsFormProps {
  catalogDetails: Catalog;
  onSubmit: (data: CatalogUpdateRequest) => void;
  limitedEditableFields?: string[];
}

export interface CatalogSettingsFormRef {
  submitForm: () => void;
}
const defaultLimitedEditable = ['alternativeLink', 'authorizationMessage', 'supportEmail', 'emailRegexes'];

const CatalogSettingsForm = forwardRef<CatalogSettingsFormRef, CatalogSettingsFormProps>(
  ({ catalogDetails, onSubmit, limitedEditableFields }, ref) => {
    const intl = useIntl();
    const { isAdmin } = useCurrentUser()

    const resolver = yupValidationResolver(getCatalogSchema(intl));
    const {
      register, control, handleSubmit, formState: { errors },
    } = useForm({
      defaultValues: catalogDetails || EMPTY_FORM_STATE,
      mode: 'onChange',
      resolver,
    });

    const canEditAllFields = isAdmin;
    const allowedEditableFields = limitedEditableFields ?? defaultLimitedEditable;
    const isEditable = (fieldName: string) => canEditAllFields || allowedEditableFields.includes(fieldName);

    useImperativeHandle(ref, () => ({
      submitForm: handleSubmit(onSubmit as any),
    }));

    return (
      <Stack gap={3} className="py-4">
        {/* General Information Section */}
        <h3 className="h3 text-primary-400">{intl.formatMessage(messages['corporate.catalog.form.general.information.title'])}</h3>

        {/* Catalog Name */}
        <Form.Group controlId="name" isInvalid={!!errors.name}>
          <Form.Label className="font-weight-bold">{intl.formatMessage(messages['corporate.catalog.form.name.field'])}</Form.Label>
          <Form.Control id="name" {...register('name')} type="text" disabled={!isEditable('name')} />
          {errors.name && (
            <Form.Control.Feedback type="invalid">
              {errors.name?.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        {/* Alternative Link */}
        <Form.Group controlId="alternativeLink" isInvalid={!!errors.alternativeLink}>
          <Form.Label className="font-weight-bold">{intl.formatMessage(messages['corporate.catalog.form.alternative.link.field'])}</Form.Label>
          <Form.Control id="alternativeLink" {...register('alternativeLink')} type="url" disabled={!isEditable('alternativeLink')} />
          {errors.alternativeLink && (
            <Form.Control.Feedback type="invalid">
              {errors.alternativeLink?.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        {/* Support Email */}
        <Form.Group controlId="supportEmail" isInvalid={!!errors.alternativeLink}>
          <Form.Label className="font-weight-bold">{intl.formatMessage(messages['corporate.catalog.form.support.email.field'])}</Form.Label>
          <Form.Control id="supportEmail" {...register('supportEmail')} type="email" disabled={!isEditable('supportEmail')} />
          {errors.supportEmail && (
            <Form.Control.Feedback type="invalid">
              {errors.supportEmail?.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        {/* Divider */}
        <hr className="w-100" />

        {/* Enrollment Settings Section */}
        <h3 className="h3 text-primary-400">{intl.formatMessage(messages['corporate.catalog.form.enrollment.settings.title'])}</h3>


        {/* Enrollment Limits Group */}
        <Form.Row>
          <Form.Group as={Col} controlId="courseEnrollmentLimit">
            <Form.Label className="font-weight-bold">{intl.formatMessage(messages['corporate.catalog.form.course.enrollment.limit.field'])}</Form.Label>
            <Form.Control id="courseEnrollmentLimit" {...register('courseEnrollmentsLimit')} type="number" disabled={!isEditable('courseEnrollmentLimit')} />
          </Form.Group>
          <Form.Group as={Col} controlId="userLimit">
            <Form.Label className="font-weight-bold">{intl.formatMessage(messages['corporate.catalog.form.user.limit.field'])}</Form.Label>
            <Form.Control id="userLimit" {...register('userLimit')} type="number" disabled={!isEditable('userLimit')} />
          </Form.Group>
        </Form.Row>

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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
                  type="date"
                  disabled={!isEditable('availableStartDate')}
                />
              </Form.Group>
            )}
          />
          <Controller
            control={control}
            name="availableEndDate"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Form.Group isInvalid={!!error} as={Col} controlId="availableEndDate">
                <Form.Label className="font-weight-bold">{intl.formatMessage(messages['corporate.catalog.form.available.end.date.field'])}</Form.Label>
                <Form.Control
                  id="availableEndDate"
                  value={value ? new Date(value).toISOString().split('T')[0] : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
                  type="date"
                  disabled={!isEditable('availableEndDate')}
                />
                {error && <Form.Control.Feedback type="invalid">{error.message}</Form.Control.Feedback>}
              </Form.Group>
            )}
          />
        </Form.Row>
        {/* Divider */}
        <hr className="w-100" />

        {/* Advanced Settings Section */}
        <h3 className="h3 text-primary-400">{intl.formatMessage(messages['corporate.catalog.form.advanced.settings.title'])}</h3>
        <Form.Row>

          <Form.Group as={Col} controlId="authorizationMessage">
            <Form.Label className="font-weight-bold">{intl.formatMessage(messages['corporate.catalog.form.authorization.message.field'])}</Form.Label>
            <Form.Control 
            id="authorizationMessage" 
            {...register('authorizationMessage')} 
            as="textarea" 
            disabled={!isEditable('authorizationMessage')} 
            placeholder={intl.formatMessage(messages['corporate.catalog.form.authorization.message.placeholder'])}/>
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
                disabled={!isEditable('emailRegexes')}
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
            disabled={!isEditable('isSelfEnrollment')}
          />
        </Form.Group>
      </Stack>
    );
  });

export default CatalogSettingsForm;
