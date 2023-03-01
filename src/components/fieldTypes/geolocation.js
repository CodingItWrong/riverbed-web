import {getCurrentPositionAsync, useForegroundPermissions} from 'expo-location';
import {Platform, StyleSheet, View} from 'react-native';
import MapView, {Marker as NativeMarker} from 'react-native-maps';
import FIELD_DATA_TYPES from '../../enums/fieldDataTypes';
import IconButton from '../IconButton';
import NumberField from '../NumberField';
import Text from '../Text';

const {Marker: WebMarker} = MapView;
const Marker = Platform.select({web: WebMarker, default: NativeMarker});

const geolocationFieldDataType = {
  key: FIELD_DATA_TYPES.GEOLOCATION.key,
  label: 'Geographic Location',
  formatValue: ({value}) =>
    (value?.lat && value?.lng && `(${value.lat}, ${value.lng})`) ?? null,
  getSortValue: ({value}) => value.lat, // arbitrarily chose to sort by latitude
  EditorComponent: GeolocationEditorComponent,
};

const defaultValue = {lat: '33.7489954', lng: '-84.3879824'}; // Atlanta GA

const valueToCoords = value =>
  value
    ? {
        latitude: Number(value.lat),
        longitude: Number(value.lng),
      }
    : null;
const coordsToValue = coords => ({
  lat: String(coords.latitude),
  lng: String(coords.longitude),
});

const valueToRegion = value => ({
  ...valueToCoords(value ? value : defaultValue),
  // TODO: figure out good values for deltas
  latitudeDelta: 0.0147,
  longitudeDelta: 0.0404,
});

function GeolocationEditorComponent({
  field,
  value,
  setValue,
  onBlur,
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
      const newValue = {lat: String(latitude), lng: String(longitude)};
      setValue(newValue);
      onBlur({[field.id]: newValue});
    }
  }

  const markerCoords = valueToCoords(value);
  const region = valueToRegion(value);

  function handleMapPress(event) {
    let newValue;

    if (event.nativeEvent) {
      const {
        nativeEvent: {coordinate},
      } = event;
      newValue = coordsToValue(coordinate);
    } else {
      newValue = {lat: event.latLng.lat(), lng: event.latLng.lng()};
    }

    setValue(newValue);
  }

  return (
    <>
      <View style={styles.geoRow}>
        <View style={styles.coordsFieldContainer}>
          <NumberField
            label={`${name} latitude`}
            value={value?.lat ?? ''}
            onChangeText={newValue => setValue({...value, lat: newValue})}
            onBlur={() => onBlur?.()}
            disabled={disabled}
            testID={`number-input-${field.id}-latitude`}
          />
          <NumberField
            label={`${name} longitude`}
            value={value?.lng ?? ''}
            onChangeText={newValue => setValue({...value, lng: newValue})}
            onBlur={() => onBlur?.()}
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
      {window.Cypress ? (
        <Text>(hiding map view in cypress)</Text>
      ) : (
        <MapView
          style={styles.detailMap}
          region={region}
          onPress={handleMapPress}
          options={{
            disableDefaultUI: true,
          }}
        >
          {markerCoords && <Marker coordinate={markerCoords} />}
        </MapView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  detailMap: {
    height: 250,
  },
  geoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coordsFieldContainer: {
    flex: 1,
  },
});

export default geolocationFieldDataType;
