import {useTheme} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export function Icon({name, color, style}) {
  const theme = useTheme();
  return (
    <MaterialCommunityIcons
      name={name}
      size={25}
      color={color ?? theme.colors.onPrimaryContainer}
      style={style}
    />
  );
}
