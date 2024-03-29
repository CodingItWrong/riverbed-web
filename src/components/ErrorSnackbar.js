import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import {useEffect, useState} from 'react';

export default function ErrorSnackbar({error, onRetry, children}) {
  const [visible, setVisible] = useState(Boolean(error));

  // show when a new error is present
  useEffect(() => {
    setVisible(Boolean(error));
  }, [error]);

  return (
    <Snackbar
      open={visible}
      onClose={() => setVisible(false)}
      message={children}
      action={onRetry && <Button onClick={onRetry}>Retry</Button>}
    />
  );
}
