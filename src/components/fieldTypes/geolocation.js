import {useState} from 'react';
import FIELD_DATA_TYPES from '../../enums/fieldDataTypes';
import IconButton from '../IconButton';
import LoadingIndicator from '../LoadingIndicator';
import Map from '../Map';
import NumberField from '../NumberField';
import Stack from '../Stack';
import Text from '../Text';
import sharedStyles from '../sharedStyles';

const geolocationFieldDataType = {
  key: FIELD_DATA_TYPES.GEOLOCATION.key,
  label: 'Geographic Location',
  formatValue: ({value}) =>
    (value?.lat && value?.lng && `(${value.lat}, ${value.lng})`) ?? null,
  getSortValue: ({value}) => value.lat, // arbitrarily chose to sort by latitude
  EditorComponent: GeolocationEditorComponent,
};

function GeolocationEditorComponent({field, label, value, setValue, disabled}) {
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);
  const [isLoadingCurrentPosition, setIsLoadingCurrentPosition] =
    useState(false);

  async function fillCurrentLocation() {
    function onSuccess({coords: {latitude, longitude}}) {
      setIsLoadingCurrentPosition(false);
      setValue({lat: String(latitude), lng: String(longitude)});
    }

    function onError(error) {
      setIsLoadingCurrentPosition(false);
      console.error(error);
      if (error.code === error.PERMISSION_DENIED) {
        setIsPermissionDenied(true);
      }
    }

    setIsLoadingCurrentPosition(true);
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }

  function handlePressLocation(newLocation) {
    setValue(newLocation);
  }

  function openMapsApp() {
    const daddr = `${value.lat},${value.lng}`;
    const company = 'google';
    window.open(`http://maps.${company}.com/maps?daddr=${daddr}`);
  }

  return (
    <div>
      <Stack direction="row" alignItems="center">
        <Text style={styles.grow}>{label}</Text>
        <div style={styles.currentLocationWrapper}>
          <IconButton
            accessibilityLabel="Use current location"
            icon="compass"
            disabled={disabled || isPermissionDenied}
            onPress={fillCurrentLocation}
            style={isLoadingCurrentPosition ? styles.hidden : null}
          />
          {isLoadingCurrentPosition && (
            <div style={styles.currentLocationLoadingContainer}>
              <LoadingIndicator small />
            </div>
          )}
        </div>
        <IconButton
          accessibilityLabel="Get directions"
          icon="directions"
          disabled={disabled || value?.lat == null || value?.lng == null}
          onPress={openMapsApp}
        />
      </Stack>
      <Stack direction="row" spacing={1}>
        <NumberField
          label="latitude"
          value={value?.lat ?? ''}
          onChangeText={newValue => setValue({...value, lat: newValue})}
          disabled={disabled}
          testID={`number-input-${field.id}-latitude`}
          style={styles.grow}
        />
        <NumberField
          label="longitude"
          value={value?.lng ?? ''}
          onChangeText={newValue => setValue({...value, lng: newValue})}
          disabled={disabled}
          testID={`number-input-${field.id}-longitude`}
          style={styles.grow}
        />
      </Stack>
      <Map
        location={value}
        onPressLocation={handlePressLocation}
        style={{...styles.detailMap, ...sharedStyles.mt}}
        disabled={disabled}
      />
    </div>
  );
}

const styles = {
  detailMap: {
    height: 250,
  },
  geoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coordsFieldContainer: {
    flexDirection: 'row',
  },
  hidden: {
    opacity: 0,
  },
  currentLocationWrapper: {
    position: 'relative',
  },
  currentLocationLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  grow: {
    flexGrow: 1,
  },
};

export default geolocationFieldDataType;
