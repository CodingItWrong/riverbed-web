import AddIcon from '@mui/icons-material/Add';
import MuiButton from '@mui/material/Button';

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
  const muiVariant = MODE_MAP[mode];
  const iconComponent = ICON_MAP[icon];
  return (
    <MuiButton
      variant={muiVariant}
      onClick={onPress}
      disabled={disabled}
      style={style}
      startIcon={rightIcon ? null : iconComponent}
      endIcon={rightIcon ? iconComponent : null}
      data-testid={testID}
    >
      {children}
    </MuiButton>
  );
}

const ICON_MAP = {
  plus: <AddIcon />,
};

const MODE_MAP = {
  primary: 'contained',
  link: 'text',
  default: 'outlined',
};
