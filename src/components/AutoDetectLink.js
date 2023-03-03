import {A} from '@expo/html-elements';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {isValidURL} from '../utils/urlUtils';
import Text from './Text';

// Pass text to this and if it is a valid URL it will be rendered as a link
export function AutoDetectLink({variant, children}) {
  const theme = useTheme();

  if (isValidURL(children)) {
    function preventParentClickBehavior(e) {
      // only seems necessary on web, but works on both
      e.stopPropagation();
    }

    return (
      <A
        href={children}
        target="_blank"
        onPress={preventParentClickBehavior}
        style={[styles.link, {color: theme.colors.primary}]}
      >
        {children}
      </A>
    );
  } else {
    return <Text variant={variant}>{children}</Text>;
  }
}

const styles = StyleSheet.create({
  link: {
    textDecorationLine: 'underline',
  },
});
