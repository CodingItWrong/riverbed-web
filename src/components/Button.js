import MuiButton from '@mui/material/Button';
import Icon from './Icon';

export default function Button({
  type,
  icon,
  onPress,
  disabled,
  children,
  mode = 'default',
  rightIcon = false,
  style,
  testID,
}) {
  const muiVariant = MODE_MAP[mode];
  const renderedIcon = icon && <Icon name={icon} />;
  return (
    <MuiButton
      type={type}
      variant={muiVariant}
      onClick={onPress}
      disabled={disabled}
      style={style}
      startIcon={rightIcon ? null : renderedIcon}
      endIcon={rightIcon ? renderedIcon : null}
      data-testid={testID}
    >
      {children || 'Button'}
    </MuiButton>
  );
}

const MODE_MAP = {
  primary: 'contained',
  link: 'text',
  default: 'outlined',
};
