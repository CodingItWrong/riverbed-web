import {Button as PaperButton} from 'react-native-paper';
import sharedStyles from './sharedStyles';

export default function Button({
  icon,
  onPress,
  disabled,
  children,
  mode = 'default',
  rightIcon = false,
  style,
  testID,
}) {
  const paperMode = MODE_MAP[mode];
  return (
    <PaperButton
      icon={icon}
      mode={paperMode}
      onPress={onPress}
      disabled={disabled}
      style={style}
      contentStyle={rightIcon ? sharedStyles.flexReverse : null}
      testID={testID}
    >
      {children}
    </PaperButton>
  );
}

const MODE_MAP = {
  primary: 'contained',
  link: 'text',
  default: 'outlined',
};
