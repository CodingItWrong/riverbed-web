import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import {useNavigate} from 'react-router-dom';

export default function BaseModalScreen({backTo, children}) {
  if (!backTo) {
    throw new Error('BaseModalScreen: backTo prop is required');
  }

  const navigate = useNavigate();

  return (
    <Dialog open fullWidth maxWidth="sm" onClose={() => navigate(backTo)}>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
