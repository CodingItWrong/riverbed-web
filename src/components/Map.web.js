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

  return (
    <View style={style}>
      <GoogleMap
        google={google}
        zoom={14}
        initialCenter={location}
        center={location}
        onClick={handleClick}
        zoomControl={false}
        scaleControl={false}
        panControl={false}
        rotateControl={false}
        streetViewControl={false}
        fullscreenControl={false}
      >
        <Marker position={location} />
      </GoogleMap>
    </View>
  );
}

export default GoogleApiWrapper({
  apiKey: Constants.expoConfig.extra.googleMapsApiKeyWeb,
})(Map);
