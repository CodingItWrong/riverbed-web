import {Appbar} from 'react-native-paper';
import LoadingIndicator from './LoadingIndicator';

export default function NavigationBar({navigation, options, back}) {
  const {title, headerRight, isFetching} = options;

  return (
    <Appbar.Header elevated>
      {back && (
        <Appbar.BackAction
          onPress={navigation.goBack}
          accessibilityLabel="Go back"
        />
      )}
      <Appbar.Content title={title} />
      {isFetching && <LoadingIndicator />}
      {headerRight?.()}
    </Appbar.Header>
  );
}
