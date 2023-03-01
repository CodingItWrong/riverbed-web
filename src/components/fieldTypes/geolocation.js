import {getCurrentPositionAsync, useForegroundPermissions} from 'expo-location';
import {StyleSheet, View} from 'react-native';
import FIELD_DATA_TYPES from '../../enums/fieldDataTypes';
import IconButton from '../IconButton';
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
  const [status, requestPermission] = useForegroundPermissions();

  const {name} = field.attributes;

  async function fillCurrentLocation() {
    let statusToUse = status;

    if (!status.granted && status.canAskAgain) {
      statusToUse = await requestPermission();
    }

    if (statusToUse.granted) {
      const {
        coords: {latitude, longitude},
      } = await getCurrentPositionAsync({});
      setValue({lat: String(latitude), lng: String(longitude)});
    }
  }

  return (
    <View style={styles.geoRow}>
      <View style={styles.coordsFieldContainer}>
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
      <IconButton
        accessibilityLabel="Use current location"
        icon="compass"
        disabled={!status || (!status.granted && !status.canAskAgain)}
        onPress={fillCurrentLocation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  geoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coordsFieldContainer: {
    flex: 1,
  },
});

export default geolocationFieldDataType;
