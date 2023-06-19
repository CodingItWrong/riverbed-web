import Link from '@mui/material/Link';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {isValidUrl} from '../utils/urlUtils';
import Text from './Text';

// Pass text to this and if it is a valid URL it will be rendered as a link
export function AutoDetectLink({link, enableLinking, variant, children}) {
  const theme = useTheme();

  if (enableLinking && isValidUrl(link)) {
    return (
      <View style={styles.linkContainer}>
        <Link
          href={link}
          target="_blank"
          onClick={preventParentClickBehavior}
          style={{color: theme.colors.primary}}
        >
          <Text variant={variant} style={{color: theme.colors.primary}}>
            {children}
          </Text>
        </Link>
      </View>
    );
  } else {
    return <Text variant={variant}>{children}</Text>;
  }
}

function preventParentClickBehavior(e) {
  e.stopPropagation();
}

const styles = StyleSheet.create({
  linkContainer: {
    flexDirection: 'row',
  },
});
