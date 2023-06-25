import {Suspense, lazy} from 'react';
import FIELD_DATA_TYPES from '../../enums/fieldDataTypes';
import dateUtils from '../../utils/dateUtils';

const LazyDateEditorComponent = lazy(() =>
  import('./lazy/DateEditorComponent'),
);

const dateFieldDataType = {
  key: FIELD_DATA_TYPES.DATE.key,
  label: 'Date',
  isTemporal: true,
  isValidValue: value => !!dateUtils.serverStringToObject(value),
  formatValue: ({value}) => dateUtils.serverStringToHumanString(value),
  getSortValue: ({value}) => value, // dates are stored as strings that sort lexicographically
  EditorComponent: DateEditorComponent,
};

function DateEditorComponent(props) {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <LazyDateEditorComponent {...props} />
    </Suspense>
  );
}

export default dateFieldDataType;
