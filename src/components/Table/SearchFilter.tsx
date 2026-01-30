import { useIntl } from '@edx/frontend-platform/i18n';
import { DataTableContext, Form, Icon } from '@openedx/paragon';
import {
  useContext, useMemo, useState, useEffect,
} from 'react';
import { TableContext } from '@src/types';
import { Search } from '@openedx/paragon/icons';
import messages from './messages';

const SearchFilter = ({
  column: { filterValue, setFilter, meta },
}) => {
  const intl = useIntl();
  const { searchIds = [] } = meta;
  const { headers } = useContext(DataTableContext) as TableContext;

  const [value, setValue] = useState(filterValue || '');

  // keep local state in sync if filterValue changes externally
  useEffect(() => {
    setValue(filterValue || '');
  }, [filterValue]);

  // debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      const nextValue = value || undefined;
      if (nextValue !== filterValue) {
        setFilter(nextValue);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [value, filterValue, setFilter]);

  const headersMap = useMemo(
    () => headers.reduce(
      (cur, acc) => ({ ...cur, [acc.id]: acc.Header }),
      {},
    ),
    [headers],
  );

  const searchFilds = useMemo(
    () => searchIds
      .map(id => headersMap[id])
      .filter(Boolean)
      .map(h => h.toLowerCase())
      .join(', '),
    [headersMap, searchIds],
  );

  const inputText = intl.formatMessage(
    messages['table.search.filter.placeholder'],
    { searchFilds },
  );

  return (
    <Form.Group controlId="search-input-table">
      <Form.Label className="sr-only">{inputText}</Form.Label>
      <Form.Control
        type="text"
        trailingElement={<Icon src={Search} size="sm" screenReaderText="Search" />}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={inputText}
      />
    </Form.Group>
  );
};

export default SearchFilter;
