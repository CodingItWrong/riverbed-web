import {View} from 'react-native';
import {withTheme} from 'react-native-paper';

// This will become just an empty View/div once we complete the Paper removal
function ScreenBackground({theme, style, children}) {
  const baseStyle = {flex: 1, backgroundColor: theme.colors.background};
  return <View style={[baseStyle, style]}>{children}</View>;
}

export default withTheme(ScreenBackground);
