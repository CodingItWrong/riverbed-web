import Constants from 'expo-constants';
import {GoogleApiWrapper, Map as GoogleMap, Marker} from 'google-maps-react';
import {useMemo} from 'react';
import Text from './Text';

function Map({style, location, disabled, onPressLocation, google}) {
  function handleClick(_props, _marker, event) {
    if (disabled) {
      return;
    }

    const {latLng} = event;
    const clickLocation = {
      lat: String(latLng.lat()),
      lng: String(latLng.lng()),
    };
    onPressLocation(clickLocation);
  }

  const mapLocation = useMemo(
    () => valueToCoords(location ?? defaultLocation),
    [location],
  );
  const markerLocation = useMemo(() => valueToCoords(location), [location]);

  if (window.Cypress) {
    return <Text>(hiding map view in cypress)</Text>;
  }

  return (
    <div style={{position: 'relative', ...style}}>
      <GoogleMap
        google={google}
        zoom={13}
        initialCenter={mapLocation}
        center={mapLocation}
        onClick={handleClick}
        draggable={!disabled}
        zoomControl={false}
        scaleControl={false}
        panControl={false}
        rotateControl={false}
        streetViewControl={false}
        fullscreenControl={false}
      >
        <Marker position={markerLocation} />
      </GoogleMap>
    </div>
  );
}

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
