import MuiIconButton from '@mui/material/IconButton';
import Icon from './Icon';

export default function IconButton({
  icon,
  iconColor,
  onPress,
  accessibilityLabel,
  ...props
}) {
  if (!accessibilityLabel) {
    throw new Error('An accessibility label is required for all IconButtons');
  }

  return (
    <MuiIconButton
      icon={icon}
      onClick={onPress}
      aria-label={accessibilityLabel}
      {...props}
    >
      <Icon name={icon} color={iconColor} />
    </MuiIconButton>
  );
}
