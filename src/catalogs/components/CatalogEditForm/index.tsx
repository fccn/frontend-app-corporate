import { useImperativeHandle, forwardRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'wouter';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Col, Form, Stack } from '@openedx/paragon';

import { useCatalogDetails, useYupValidationResolver } from '@src/catalogs/hooks';

import { CorporateCatalogForm } from '@src/app/types';
import { getCatalogSchema } from './validationSchema';
import { EMPTY_FORM_STATE } from './constants';
import messages from './messages';

interface CatalogEditFormProps {
  selectedCatalog: string | number;
  onSubmit: (data: CorporateCatalogForm) => void;
}

export interface CatalogEditFormRef {
  submitForm: () => void;
}

const CatalogEditForm = forwardRef<CatalogEditFormRef, CatalogEditFormProps>(
  ({ selectedCatalog, onSubmit }, ref) => {
    const intl = useIntl();
    const { partnerId } = useParams<{ partnerId: string }>();
    const { catalogDetails } = useCatalogDetails({
      partnerId,
      selectedCatalog,
    });

    const resolver = useYupValidationResolver(getCatalogSchema(intl));
    const {
      register, control, handleSubmit, formState: { errors },
    } = useForm({
      defaultValues: catalogDetails ?? EMPTY_FORM_STATE,
      mode: 'onChange',
      resolver,
    });

    // Expose a form submit function to parent component
    useImperativeHandle(ref, () => ({
      submitForm: handleSubmit(onSubmit),
    }));

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
        <Form.Group isInvalid={!!errors.name} controlId="name">
          <Form.Label className="font-weight-bold">{intl.formatMessage(messages.formName)}</Form.Label>
          <Form.Control id="name" {...register('name')} type="text" />
          {errors.name && (
          <Form.Control.Feedback type="invalid">
            {errors.name?.message}
          </Form.Control.Feedback>
          )}
        </Form.Group>

        {/* Alternative Link */}
        <Form.Group isInvalid={!!errors.catalogAlternativeLink} controlId="catalogAlternativeLink">
          <Form.Label className="font-weight-bold">{intl.formatMessage(messages.formCatalogAlternativeLink)}</Form.Label>
          <Form.Control id="catalogAlternativeLink" {...register('catalogAlternativeLink')} type="text" />
          {errors.catalogAlternativeLink && (
          <Form.Control.Feedback type="invalid">
            {errors.catalogAlternativeLink?.message}
          </Form.Control.Feedback>
          )}
        </Form.Group>

        {/* Support Email */}
        <Form.Group isInvalid={!!errors.supportEmail} controlId="supportEmail">
          <Form.Label className="font-weight-bold">{intl.formatMessage(messages.formSupportEmail)}</Form.Label>
          <Form.Control id="supportEmail" {...register('supportEmail')} type="email" />
          {errors.supportEmail && (
          <Form.Control.Feedback type="invalid">
            {errors.supportEmail?.message}
          </Form.Control.Feedback>
          )}
        </Form.Group>

        {/* Date Range Group */}
        <Form.Row>
          <Controller
            control={control}
            name="availableStartDate"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Form.Group isInvalid={!!error} as={Col} controlId="availableStartDate">
                <Form.Label className="font-weight-bold">{intl.formatMessage(messages.formAvailableStartDate)}</Form.Label>
                <Form.Control
                  id="availableStartDate"
                  value={value ? new Date(value).toISOString().split('T')[0] : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const dateValue = e.target.value;
                    if (dateValue) {
                      const date = new Date(dateValue);
                      // Check if the date is valid
                      if (!Number.isNaN(date.getTime())) {
                        onChange(date.toISOString());
                      }
                    } else {
                      // Handle empty date input
                      onChange(null);
                    }
                  }}
                  type="date"
                />
                {error && <Form.Control.Feedback type="invalid">{error.message}</Form.Control.Feedback>}
              </Form.Group>
            )}
          />
          <Controller
            control={control}
            name="availableEndDate"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Form.Group isInvalid={!!error} as={Col} controlId="availableEndDate">
                <Form.Label className="font-weight-bold">{intl.formatMessage(messages.formAvailableEndDate)}</Form.Label>
                <Form.Control
                  id="availableEndDate"
                  value={value ? new Date(value).toISOString().split('T')[0] : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const dateValue = e.target.value;
                    if (dateValue) {
                      const date = new Date(dateValue);
                      // Check if the date is valid
                      if (!Number.isNaN(date.getTime())) {
                        // Set time to 23:59:59.999 for the selected day
                        date.setHours(23, 59, 59, 999);
                        onChange(date.toISOString());
                      }
                    } else {
                      // Handle empty date input
                      onChange(null);
                    }
                  }}
                  type="date"
                />
                {error && <Form.Control.Feedback type="invalid">{error.message}</Form.Control.Feedback>}
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
          <Form.Group isInvalid={!!errors.courseEnrollmentLimit} as={Col} controlId="courseEnrollmentLimit">
            <Form.Label className="font-weight-bold">{intl.formatMessage(messages.formCourseEnrollmentLimit)}</Form.Label>
            <Form.Control id="courseEnrollmentLimit" {...register('courseEnrollmentLimit')} type="number" />
            {errors.courseEnrollmentLimit && (
              <Form.Control.Feedback type="invalid">
                {errors.courseEnrollmentLimit?.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Form.Group isInvalid={!!errors.userLimit} as={Col} controlId="userLimit">
            <Form.Label className="font-weight-bold">{intl.formatMessage(messages.formUserLimit)}</Form.Label>
            <Form.Control id="userLimit" {...register('userLimit')} type="number" />
            {errors.userLimit && (
              <Form.Control.Feedback type="invalid">
                {errors.userLimit?.message}
              </Form.Control.Feedback>
            )}
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
  },
);

CatalogEditForm.displayName = 'CatalogEditForm';

export default CatalogEditForm;
