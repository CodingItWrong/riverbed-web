import {A} from '@expo/html-elements';
import {Share, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {isValidUrl} from '../utils/urlUtils';
import Text from './Text';

// Pass text to this and if it is a valid URL it will be rendered as a link
export function AutoDetectLink({link, enableLinking, variant, children}) {
  const theme = useTheme();

  if (enableLinking && isValidUrl(link)) {
    return (
      <View style={styles.linkContainer}>
        <A
          href={link}
          target="_blank"
          onPress={preventParentClickBehavior}
          onLongPress={() => share(link)}
          style={[styles.link, {color: theme.colors.primary}]}
        >
          <Text variant={variant} style={{color: theme.colors.primary}}>
            {children}
          </Text>
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
