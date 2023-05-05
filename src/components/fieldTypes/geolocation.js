import * as Linking from 'expo-linking';
import {getCurrentPositionAsync, useForegroundPermissions} from 'expo-location';
import {useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import FIELD_DATA_TYPES from '../../enums/fieldDataTypes';
import IconButton from '../IconButton';
import LoadingIndicator from '../LoadingIndicator';
import Map from '../Map';
import NumberField from '../NumberField';
import sharedStyles from '../sharedStyles';

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
  label,
  value,
  setValue,
  disabled,
  style,
}) {
  const [status, requestPermission] = useForegroundPermissions();
  const [isLoadingCurrentPosition, setIsLoadingCurrentPosition] =
    useState(false);

  async function fillCurrentLocation() {
    let statusToUse = status;

    if (!status.granted && status.canAskAgain) {
      statusToUse = await requestPermission();
    }

    if (statusToUse.granted) {
      setIsLoadingCurrentPosition(true);
      try {
        const {
          coords: {latitude, longitude},
        } = await getCurrentPositionAsync({});
        setValue({lat: String(latitude), lng: String(longitude)});
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingCurrentPosition(false);
      }
    }
  }

  function handlePressLocation(newLocation) {
    setValue(newLocation);
  }

  function openMapsApp() {
    const daddr = `${value.lat},${value.lng}`;
    const company = Platform.OS === 'ios' ? 'apple' : 'google';
    Linking.openURL(`http://maps.${company}.com/maps?daddr=${daddr}`);
  }

  return (
    <>
      <View style={[styles.geoRow, style]}>
        <View style={styles.coordsFieldContainer}>
          <NumberField
            label={`${label} latitude`}
            value={value?.lat ?? ''}
            onChangeText={newValue => setValue({...value, lat: newValue})}
            disabled={disabled}
            testID={`number-input-${field.id}-latitude`}
          />
          <NumberField
            label={`${label} longitude`}
            value={value?.lng ?? ''}
            onChangeText={newValue => setValue({...value, lng: newValue})}
            disabled={disabled}
            style={sharedStyles.mt}
            testID={`number-input-${field.id}-longitude`}
          />
        </View>
        <View>
          <View>
            <IconButton
              accessibilityLabel="Use current location"
              icon="compass"
              disabled={
                disabled || !status || (!status.granted && !status.canAskAgain)
              }
              onPress={fillCurrentLocation}
              style={[isLoadingCurrentPosition && styles.hidden]}
            />
            {isLoadingCurrentPosition && (
              <View style={styles.currentLocationLoadingContainer}>
                <LoadingIndicator />
              </View>
            )}
          </View>
          <IconButton
            accessibilityLabel="Get directions"
            icon="directions"
            disabled={disabled || value?.lat == null || value?.lng == null}
            onPress={openMapsApp}
          />
        </View>
      </View>
      <Map
        location={value}
        onPressLocation={handlePressLocation}
        style={[styles.detailMap, sharedStyles.mt]}
        disabled={disabled}
      />
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
  hidden: {
    opacity: 0,
  },
  currentLocationLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default geolocationFieldDataType;
