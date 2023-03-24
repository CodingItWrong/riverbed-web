import {StyleSheet} from 'react-native';
import {Appbar} from 'react-native-paper';
import {Icon} from './Icon';
import LoadingIndicator from './LoadingIndicator';
import sharedStyles from './sharedStyles';

export default function NavigationBar({navigation, options, back}) {
  const {title, icon, onTitlePress, headerRight, isFetching} = options;

  return (
    <Appbar.Header elevated>
      {back && (
        <Appbar.BackAction
          onPress={navigation.goBack}
          accessibilityLabel="Go back"
        />
      )}
      {icon && <Icon name={icon} style={sharedStyles.mr} />}
      <Appbar.Content title={title} onPress={onTitlePress} />
      <LoadingIndicator
        loading={Boolean(isFetching)}
        style={styles.navBarLoadingIndicator}
      />
      {headerRight?.()}
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  navBarLoadingIndicator: {
    marginRight: 8,
  },
});
