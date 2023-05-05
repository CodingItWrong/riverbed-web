import Constants from 'expo-constants';
import {GoogleApiWrapper, Map as GoogleMap, Marker} from 'google-maps-react';
import {View} from 'react-native';
import Text from './Text';

function Map({style, location, disabled, onPressLocation, google}) {
  if (window.Cypress) {
    return <Text>(hiding map view in cypress)</Text>;
  }

  function handleClick(_props, _marker, event) {
    const {latLng} = event;
    const clickLocation = {
      lat: String(latLng.lat()),
      lng: String(latLng.lng()),
    };
    onPressLocation(clickLocation);
  }

  const mapLocation = valueToCoords(location ?? defaultLocation);
  const markerLocation = valueToCoords(location);

  return (
    <View style={style}>
      <GoogleMap
        google={google}
        zoom={13}
        initialCenter={mapLocation}
        center={mapLocation}
        onClick={handleClick}
        zoomControl={false}
        scaleControl={false}
        panControl={false}
        rotateControl={false}
        streetViewControl={false}
        fullscreenControl={false}
      >
        <Marker position={markerLocation} />
      </GoogleMap>
    </View>
  );
}

// TODO: remove duplication with native map
const defaultLocation = {lat: '33.7489954', lng: '-84.3879824'}; // Atlanta GA

export default GoogleApiWrapper({
  apiKey: Constants.expoConfig.extra.googleMapsApiKeyWeb,
})(Map);

const valueToCoords = value =>
  value
    ? {
        lat: Number(value.lat),
        lng: Number(value.lng),
      }
    : null;
