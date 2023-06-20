import MuiIconButton from '@mui/material/IconButton';
import Icon from './Icon';

export default function BackButton({accessibilityLabel = 'Go back'}) {
  return (
    <MuiIconButton
      size="large"
      edge="start"
      color="inherit"
      aria-label={accessibilityLabel}
      sx={{mr: 2}}
      onClick={() => history.back()}
    >
      <Icon name="arrow-back" />
    </MuiIconButton>
  );
}
