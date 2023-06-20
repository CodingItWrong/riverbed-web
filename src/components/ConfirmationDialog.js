import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ConfirmationDialog({
  open,
  title,
  message,
  confirmButtonLabel,
  onConfirm,
  onDismiss,
  destructive,
}) {
  return (
    <Dialog open={open} onClose={onDismiss}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onDismiss}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          color={destructive ? 'error' : null}
        >
          {confirmButtonLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
