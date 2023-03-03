import {A} from '@expo/html-elements';
import * as Sharing from 'expo-sharing';
import {Platform, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {isValidURL} from '../utils/urlUtils';
import Text from './Text';

// Pass text to this and if it is a valid URL it will be rendered as a link
export function AutoDetectLink({variant, children}) {
  const theme = useTheme();

  if (isValidURL(children)) {
    return (
      <A
        href={children}
        target="_blank"
        onPress={preventParentClickBehavior}
        onLongPress={() => share(children)}
        style={[styles.link, {color: theme.colors.primary}]}
      >
        {children}
      </A>
    );
  } else {
    return <Text variant={variant}>{children}</Text>;
  }
}

function preventParentClickBehavior(e) {
  // only seems necessary on web, but works on both
  e.stopPropagation();
}

const PLATFORM_SUPPORTS_URL_SHARING = Platform.OS !== 'android';

async function share(url) {
  if (PLATFORM_SUPPORTS_URL_SHARING && (await Sharing.isAvailableAsync())) {
    return Sharing.shareAsync(url);
  }
}

const styles = StyleSheet.create({
  link: {
    textDecorationLine: 'underline',
  },
});
