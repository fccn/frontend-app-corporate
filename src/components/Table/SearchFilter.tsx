import { useIntl } from '@edx/frontend-platform/i18n';
import { DataTableContext, Form, Icon } from '@openedx/paragon';

import { useContext, useMemo } from 'react';
import { TableContext } from '@src/types';
import { Search } from '@openedx/paragon/icons';
import messages from './messages';

const SearchFilter = ({
  column: { filterValue, setFilter, meta },
}) => {
  const intl = useIntl();
  const { searchIds = [] } = meta;

  const { headers } = useContext(DataTableContext) as TableContext;

  const headersMap = useMemo(() => headers.reduce((cur, acc) => ({
    ...cur, [acc.id]: acc.Header,
  }), {}), [headers]);

  const searchFilds = useMemo(() => (
    searchIds
      .map(id => headersMap[id])
      .filter(Boolean)
      .map(h => h.toLowerCase())
      .join(', ')
  ), [headersMap, searchIds]);

  const handleChange = (e) => {
    const nextValue = e.target.value || undefined;

    if (nextValue !== filterValue) {
      setFilter(nextValue);
    }
  };

  return (
    <Form.Control
      type="text"
      trailingElement={<Icon src={Search} size="sm" screenReaderText="Search" />}
      value={filterValue || ''}
      onChange={handleChange}
      placeholder={intl.formatMessage(messages['table.search.filter.placeholder'], { searchFilds })}
    />
  );
};

export default SearchFilter;
