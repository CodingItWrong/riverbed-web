import {IconButton as PaperIconButton} from 'react-native-paper';

export default function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  ...props
}) {
  console.log({accessibilityLabel});
  if (!accessibilityLabel) {
    throw new Error('An accessibility label is required for all IconButtons');
  }

  return (
    <PaperIconButton
      icon={icon}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      {...props}
    />
  );
}
