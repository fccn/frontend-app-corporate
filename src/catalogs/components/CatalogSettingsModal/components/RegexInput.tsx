import { useEffect, useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';

import messages from '../messages';

type RegexInputProps = {
  value: string[] | undefined;
  onChange: (newValue) => void;
  isEditable: (key) => boolean;
};

const RegexInput = ({ value, onChange, isEditable }: RegexInputProps) => {
  const intl = useIntl();

  const [displayValue, setDisplayValue] = useState('');

  // Sync displayValue when value changes (e.g., from backend or reset)
  useEffect(() => {
    if (Array.isArray(value)) {
      setDisplayValue(
        value.map(item => item.replace(/^\^/, '').replace(/\$$/, '')).join(', '),
      );
    }
  }, [value]);

  const handleInputChange = (e) => {
    setDisplayValue(e.target.value); // allow typing commas freely
  };
  const handleBlur = () => {
    // Parse into clean array when user leaves the input
    const parsed = displayValue
      .split(',')
      .map(v => v.trim())
      .filter(Boolean);
    onChange(parsed);
  };

  return (
    <Form.Group controlId="emailRegexes">
      <Form.Label>
        <h5>{intl.formatMessage(messages['corporate.catalog.form.email.regexes.field'])}</h5>
      </Form.Label>
      <Form.Control
        id="emailRegexes"
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        onBlur={handleBlur} // only parse array on blur
        disabled={!isEditable('emailRegexes')}
      />
      <Form.Text>
        {intl.formatMessage(messages['corporate.catalog.form.email.regexes.description'])}
      </Form.Text>
    </Form.Group>
  );
};

export default RegexInput;
