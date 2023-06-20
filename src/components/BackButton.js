import MuiIconButton from '@mui/material/IconButton';
import {useNavigation} from '@react-navigation/native';
import Icon from './Icon';

export default function BackButton({accessibilityLabel = 'Go back'}) {
  const navigation = useNavigation();
  return (
    <MuiIconButton
      size="large"
      edge="start"
      color="inherit"
      aria-label={accessibilityLabel}
      sx={{mr: 2}}
      onClick={() => navigation.goBack()}
    >
      <Icon name="arrow-back" />
    </MuiIconButton>
  );
}
