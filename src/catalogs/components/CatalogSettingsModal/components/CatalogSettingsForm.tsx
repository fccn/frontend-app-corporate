import {
  useImperativeHandle, forwardRef,
} from 'react';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Col, Form, Stack } from '@openedx/paragon';

import { yupValidationResolver } from '@src/utils';
import { Catalog, CatalogUpdateRequest } from '@src/types';
import { useCurrentUser } from '@src/hooks';
import { InferType } from 'yup';
import { getCatalogSchema, isoToDateInputValue } from '../utils';
import messages from '../messages';
import RegexInput from './RegexInput';

interface CatalogSettingsFormProps {
  catalogDetails: Catalog;
  onSubmit: (data: CatalogUpdateRequest) => void;
  limitedEditableFields?: string[];
}

export interface CatalogSettingsFormRef {
  submitForm: () => void;
}

const CatalogSettingsForm = forwardRef<CatalogSettingsFormRef, CatalogSettingsFormProps>(
  ({
    catalogDetails,
    onSubmit,
    limitedEditableFields = ['alternativeLink', 'authorizationMessage', 'supportEmail', 'emailRegexes'],
  }, ref) => {
    const intl = useIntl();
    const { isAdmin } = useCurrentUser();

    const schema = getCatalogSchema(intl);
    type CatalogFormValues = InferType<typeof schema>;

    const {
      register, control, handleSubmit, formState: { errors },
    } = useForm<CatalogFormValues>({
      defaultValues: {
        ...catalogDetails,
        availableStartDate: catalogDetails?.availableStartDate ?? '',
        availableEndDate: catalogDetails?.availableEndDate ?? '',
      },
      resolver: yupValidationResolver(schema) as Resolver<CatalogFormValues>,
    });

    const canEditAllFields = isAdmin;
    const isEditable = (fieldName: string) => canEditAllFields || limitedEditableFields.includes(fieldName);

    const handleFormSubmit = (data: CatalogFormValues) => {
      const parsedStartData = new Date(data.availableStartDate).toISOString();
      const parsedEndData = new Date(data.availableEndDate).toISOString();
      onSubmit({
        ...data,
        availableStartDate: parsedStartData,
        availableEndDate: parsedEndData,
        emailRegexes: data.emailRegexes ?? [],
      });
    };

    useImperativeHandle(ref, () => ({
      submitForm: handleSubmit(handleFormSubmit),
    }));

    return (
      <Stack gap={3} className="py-4">
        {/* General Information Section */}
        <h3 className="h3 text-primary-400">
          {intl.formatMessage(messages['corporate.catalog.form.general.information.title'])}
        </h3>

        {/* Catalog Name */}
        <Form.Group controlId="name" isInvalid={!!errors.name}>
          <Form.Label>
            <h5>{intl.formatMessage(messages['corporate.catalog.form.name.field'])}</h5>
          </Form.Label>
          <Form.Control id="name" {...register('name')} type="text" disabled={!isEditable('name')} />
          {errors.name && (
            <Form.Control.Feedback type="invalid">
              {errors.name.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        {/* Alternative Link */}
        <Form.Group controlId="alternativeLink" isInvalid={!!errors.alternativeLink}>
          <Form.Label>
            <h5>{intl.formatMessage(messages['corporate.catalog.form.alternative.link.field'])}</h5>
          </Form.Label>
          <Form.Control
            id="alternativeLink"
            {...register('alternativeLink')}
            type="url"
            disabled={!isEditable('alternativeLink')}
          />
          {errors.alternativeLink && (
            <Form.Control.Feedback type="invalid">
              {errors.alternativeLink.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        {/* Support Email */}
        <Form.Group controlId="supportEmail" isInvalid={!!errors.supportEmail}>
          <Form.Label>
            <h5>{intl.formatMessage(messages['corporate.catalog.form.support.email.field'])}</h5>
          </Form.Label>
          <Form.Control
            id="supportEmail"
            {...register('supportEmail')}
            type="email"
            disabled={!isEditable('supportEmail')}
          />
          {errors.supportEmail && (
            <Form.Control.Feedback type="invalid">
              {errors.supportEmail.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        {/* Divider */}
        <hr className="w-100" />

        {/* Enrollment Settings Section */}
        <h3 className="h3 text-primary-400">
          {intl.formatMessage(messages['corporate.catalog.form.enrollment.settings.title'])}
        </h3>

        {/* Enrollment Limits Group */}
        <Form.Row>
          <Form.Group as={Col} controlId="courseEnrollmentLimit">
            <Form.Label className="font-weight-bold">
              <h5>{intl.formatMessage(messages['corporate.catalog.form.course.enrollment.limit.field'])}</h5>
            </Form.Label>
            <Form.Control
              id="courseEnrollmentLimit"
              {...register('courseEnrollmentsLimit')}
              type="number"
              disabled={!isEditable('courseEnrollmentLimit')}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="userLimit">
            <Form.Label>
              <h5>{intl.formatMessage(messages['corporate.catalog.form.user.limit.field'])}</h5>
            </Form.Label>
            <Form.Control
              id="userLimit"
              {...register('userLimit')}
              type="number"
              disabled={!isEditable('userLimit')}
            />
          </Form.Group>
        </Form.Row>

        {/* Date Range Group */}
        <Form.Row>
          <Controller
            control={control}
            name="availableStartDate"
            render={({ field: { value, onChange } }) => (
              <Form.Group as={Col} controlId="availableStartDate">
                <Form.Label>
                  <h5>{intl.formatMessage(messages['corporate.catalog.form.available.start.date.field'])}</h5>
                </Form.Label>
                <Form.Control
                  id="availableStartDate"
                  value={isoToDateInputValue(value)}
                  onChange={(e) => onChange(e.target.value)}
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
                <Form.Label>
                  <h5>{intl.formatMessage(messages['corporate.catalog.form.available.end.date.field'])}</h5>
                </Form.Label>
                <Form.Control
                  id="availableEndDate"
                  value={isoToDateInputValue(value)}
                  onChange={(e) => onChange(e.target.value)}
                  type="date"
                  disabled={!isEditable('availableEndDate')}
                />
                {error && (
                  <Form.Control.Feedback type="invalid">{error.message}</Form.Control.Feedback>
                )}
              </Form.Group>
            )}
          />
        </Form.Row>

        <h3 className="h3 text-primary-400">
          {intl.formatMessage(messages['corporate.catalog.form.enrollment.authorization.title'])}
        </h3>
        {/* Authorization Message */}
        <Form.Row>
          <Form.Group as={Col} controlId="authorizationMessage">
            <Form.Label>
              <h5>{intl.formatMessage(messages['corporate.catalog.form.authorization.message.field'])}</h5>
            </Form.Label>
            <Form.Control
              id="authorizationMessage"
              {...register('authorizationMessage')}
              as="textarea"
              disabled={!isEditable('authorizationMessage')}
              placeholder={intl.formatMessage(
                messages['corporate.catalog.form.authorization.message.placeholder'],
              )}
            />
          </Form.Group>
        </Form.Row>

        {/* Divider */}
        <hr className="w-100" />

        {/* Advanced Settings Section */}
        <h3 className="h3 text-primary-400">
          {intl.formatMessage(messages['corporate.catalog.form.advanced.settings.title'])}
        </h3>

        {/* Self Enrollment */}
        <Form.Group controlId="isSelfEnrollment" className="d-flex align-items-center">
          <Form.Label className="mb-0 flex-grow-1">
            <h5>{intl.formatMessage(messages['corporate.catalog.form.self.enrollment.field'])}</h5>
          </Form.Label>
          <Form.Switch
            {...register('isSelfEnrollment')}
            floatLabelLeft
            disabled={!isEditable('isSelfEnrollment')}
          />
        </Form.Group>

        {/* Email Regexes */}
        <Controller
          control={control}
          name="emailRegexes"
          render={({ field: { value, onChange } }) => (
            <RegexInput
              value={value}
              onChange={onChange}
              isEditable={isEditable}
            />
          )}
        />

      </Stack>
    );
  },
);

export default CatalogSettingsForm;
