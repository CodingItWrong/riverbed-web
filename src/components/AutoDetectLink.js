import Link from '@mui/material/Link';
import {StyleSheet, View} from 'react-native';
import {isValidUrl} from '../utils/urlUtils';
import Text from './Text';

// Pass text to this and if it is a valid URL it will be rendered as a link
export function AutoDetectLink({link, enableLinking, variant, children}) {
  if (enableLinking && isValidUrl(link)) {
    return (
      <View style={styles.linkContainer}>
        <Link href={link} target="_blank" onClick={preventParentClickBehavior}>
          <Text variant={variant}>{children}</Text>
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
