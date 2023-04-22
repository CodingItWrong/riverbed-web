import {Platform} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

export default function Map({style, location, disabled, onPressLocation}) {
  const markerCoords = valueToCoords(location);
  const region = valueToRegion(location);

  function handlePress(event) {
    const {
      nativeEvent: {
        coordinate: {latitude, longitude},
      },
    } = event;
    const newLocation = {
      lat: String(latitude),
      lng: String(longitude),
    };

    onPressLocation(newLocation);
  }

  return (
    <MapView
      provider={Platform.select({
        android: PROVIDER_GOOGLE,
        default: undefined,
      })}
      style={style}
      region={region}
      onPress={handlePress}
      options={{disableDefaultUI: true}}
      toolbarEnabled={false}
      zoomEnabled={!disabled}
      zoomControlEnabled={!disabled}
      rotateEnabled={!disabled}
      scrollEnabled={!disabled}
      pitchEnabled={!disabled}
    >
      {markerCoords && <Marker coordinate={markerCoords} />}
    </MapView>
  );
}

const defaultValue = {lat: '33.7489954', lng: '-84.3879824'}; // Atlanta GA

const valueToCoords = value =>
  value
    ? {
        latitude: Number(value.lat),
        longitude: Number(value.lng),
      }
    : null;

const valueToRegion = value => ({
  ...valueToCoords(value ? value : defaultValue),
  // TODO: figure out good values for deltas
  latitudeDelta: 0.0147,
  longitudeDelta: 0.0404,
});
