import {APIProvider, Map as GoogleMap, Marker} from '@vis.gl/react-google-maps';
import {useMemo} from 'react';

import Constants from '../constants';
import Text from './Text';

export default function Map({style, location, disabled, onPressLocation}) {
  function handleClick(event) {
    if (disabled) {
      return;
    }

    const {latLng} = event.detail;
    const clickLocation = {
      lat: String(latLng.lat),
      lng: String(latLng.lng),
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
    <div style={{...styles.mapWrapper, ...style}}>
      <APIProvider apiKey={Constants.googleMapsApiKeyWeb}>
        <GoogleMap
          defaultCenter={mapLocation}
          defaultZoom={13}
          gestureHandling="greedy"
          disableDefaultUI
          onClick={handleClick}
        >
          <Marker position={markerLocation} />
        </GoogleMap>
      </APIProvider>
    </div>
  );
}

const defaultLocation = {lat: '33.7489954', lng: '-84.3879824'}; // Atlanta GA

const valueToCoords = value =>
  value
    ? {
        lat: Number(value.lat),
        lng: Number(value.lng),
      }
    : null;

const styles = {
  mapWrapper: {
    position: 'relative',
  },
};
