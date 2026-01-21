import { useIntl, FormattedMessage } from '@edx/frontend-platform/i18n';
import { Button, DataTableContext } from '@openedx/paragon';
import { TableContext } from '@src/types';
import { useContext, useMemo } from 'react';
import messages from './messages';

const FilterStatus = () => {
  const intl = useIntl();
  const {
    state, setAllFilters, headers, columns,
  } = useContext(DataTableContext) as TableContext;

  const headersMap = useMemo(() => (
    headers.reduce((cur, acc) => ({
      ...cur, [acc.id]: acc.Header,
    }), {})
  ), [headers]);

  const searchIds = useMemo(() => (
    columns.find(col => col.meta?.searchIds)?.meta?.searchIds || []
  ), [columns]);

  const filterTexts = useMemo(() => {
    if (!state.filters?.length) { return null; }

    const filterNames = state.filters.map(filter => {
      if (searchIds.includes(filter.id)) {
        return searchIds.map(id => headersMap[id]).join(', ');
      }
      return headersMap[filter.id];
    });

    return intl.formatMessage(messages['table.filter.status'], { filterNames: filterNames.join(', ') });
  }, [intl, state.filters, headersMap, searchIds]);

  if (!setAllFilters) {
    return null;
  }

  return (
    <div>
      <p>{filterTexts}</p>
      <Button
        variant="link"
        size="inline"
        onClick={() => state.filters?.length && setAllFilters([])}
      >
        <FormattedMessage
          id="pgn.DataTable.FilterStatus.clearFiltersText"
          defaultMessage="Clear filters"
          description="A text that appears on the `Clear filters` button"
        />
      </Button>
    </div>
  );
};

export default FilterStatus;
