import {A} from '@expo/html-elements';
import {Share, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {isValidURL} from '../utils/urlUtils';
import Text from './Text';

// Pass text to this and if it is a valid URL it will be rendered as a link
export function AutoDetectLink({enableLinking, variant, children}) {
  const theme = useTheme();

  if (enableLinking && isValidURL(children)) {
    return (
      <View style={styles.linkContainer}>
        <A
          href={children}
          target="_blank"
          onPress={preventParentClickBehavior}
          onLongPress={() => share(children)}
          style={[styles.link, {color: theme.colors.primary}]}
        >
          {children}
        </A>
      </View>
    );
  } else {
    return <Text variant={variant}>{children}</Text>;
  }
}

function preventParentClickBehavior(e) {
  // only seems necessary on web, but works on both
  e.stopPropagation();
}

async function share(url) {
  return Share.share({url});
}

const styles = StyleSheet.create({
  linkContainer: {
    flexDirection: 'row',
  },
  link: {
    textDecorationLine: 'underline',
  },
});
