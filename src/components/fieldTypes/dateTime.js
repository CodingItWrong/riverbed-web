import {Suspense, lazy} from 'react';
import FIELD_DATA_TYPES from '../../enums/fieldDataTypes';
import dateTimeUtils from '../../utils/dateTimeUtils';

const LazyDateTimeEditorComponent = lazy(
  () => import('./lazy/DateTimeEditorComponent'),
);

const dateTimeFieldDataType = {
  key: FIELD_DATA_TYPES.DATETIME.key,
  label: 'Date and Time',
  isTemporal: true,
  isValidValue: value => !!dateTimeUtils.serverStringToObject(value),
  formatValue: ({value}) => dateTimeUtils.serverStringToHumanString(value),
  getSortValue: ({value}) => value, // datetimes are stored as strings that sort lexicographically
  EditorComponent: DateTimeEditorComponent,
};

function DateTimeEditorComponent(props) {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <LazyDateTimeEditorComponent {...props} />
    </Suspense>
  );
}

export default dateTimeFieldDataType;
