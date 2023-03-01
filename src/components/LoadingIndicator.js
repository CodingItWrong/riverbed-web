import {ActivityIndicator} from 'react-native-paper';

export default function LoadingIndicator({style}) {
  return <ActivityIndicator accessibilityLabel="Loading" style={style} />;
}
