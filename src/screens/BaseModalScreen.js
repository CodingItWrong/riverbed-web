import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import {useNavigate} from 'react-router-dom';
import {large, useBreakpoint} from '../breakpoints';

export default function BaseModalScreen({backTo, children}) {
  const navigate = useNavigate();
  const breakpoint = useBreakpoint();
  const fullScreen = breakpoint !== large;

  if (!backTo) {
    throw new Error('BaseModalScreen: backTo prop is required');
  }

  return (
    <Dialog
      open
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      onClose={() => navigate(backTo)}
    >
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
