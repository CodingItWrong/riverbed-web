import {ActivityIndicator} from 'react-native-paper';

export default function LoadingIndicator({loading = true, style}) {
  return (
    <ActivityIndicator
      animating={loading}
      accessibilityLabel="Loading"
      style={style}
    />
  );
}
