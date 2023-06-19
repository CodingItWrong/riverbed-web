import {useTheme} from 'react-native-paper';
import getMuiIcon from './getMuiIcon';

export default function Icon({name, color, style}) {
  const theme = useTheme();
  const IconComponent = getMuiIcon(name);
  console.log({name, IconComponent});
  return (
    <IconComponent
      color={color ?? theme.colors.onPrimaryContainer}
      style={style}
    />
  );
}
