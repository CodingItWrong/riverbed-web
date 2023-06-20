import MuiIconButton from '@mui/material/IconButton';
import {useNavigate} from 'react-router-dom';
import Icon from './Icon';

export default function BackButton({to, accessibilityLabel = 'Go back'}) {
  if (!to) {
    throw new Error('BackButton: to prop is required');
  }

  const navigate = useNavigate();

  return (
    <MuiIconButton
      size="large"
      edge="start"
      color="inherit"
      aria-label={accessibilityLabel}
      sx={{mr: 2}}
      onClick={() => navigate(to)}
    >
      <Icon name="arrow-back" />
    </MuiIconButton>
  );
}
