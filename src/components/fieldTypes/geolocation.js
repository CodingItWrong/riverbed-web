import {View} from 'react-native';
import FIELD_DATA_TYPES from '../../enums/fieldDataTypes';
import NumberField from '../NumberField';

const geolocationFieldDataType = {
  key: FIELD_DATA_TYPES.GEOLOCATION.key,
  label: 'Geographic Location',
  formatValue: ({value}) =>
    (value?.lat && value?.lng && `(${value.lat}, ${value.lng})`) ?? null,
  getSortValue: ({value}) => value.lat, // arbitrarily chose to sort by latitude
  EditorComponent: GeolocationEditorComponent,
};

function GeolocationEditorComponent({
  field,
  value,
  setValue,
  readOnly,
  disabled,
}) {
  const {name} = field.attributes;
  return (
    <View>
      <NumberField
        label={`${name} latitude`}
        value={value?.lat ?? ''}
        onChangeText={newValue => setValue({...value, lat: newValue})}
        disabled={disabled}
        testID={`number-input-${field.id}-latitude`}
      />
      <NumberField
        label={`${name} longitude`}
        value={value?.lng ?? ''}
        onChangeText={newValue => setValue({...value, lng: newValue})}
        disabled={disabled}
        testID={`number-input-${field.id}-longitude`}
      />
    </View>
  );
}

export default geolocationFieldDataType;
