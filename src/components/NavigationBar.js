import {Appbar} from 'react-native-paper';
import LoadingIndicator from './LoadingIndicator';

export default function NavigationBar({navigation, options, back}) {
  return (
    <Appbar.Header elevated>
      {back && (
        <Appbar.BackAction
          onPress={navigation.goBack}
          accessibilityLabel="Go back"
        />
      )}
      <Appbar.Content title={options.title} />
      {options.isFetching && <LoadingIndicator />}
      {options.headerRight?.()}
    </Appbar.Header>
  );
}
