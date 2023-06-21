import {View} from 'react-native';

export default function ScreenBackground({style, children}) {
  const baseStyle = {flex: 1};
  return <View style={[baseStyle, style]}>{children}</View>;
}
