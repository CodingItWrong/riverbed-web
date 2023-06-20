import Snackbar from '@mui/material/Snackbar';
import {useEffect, useState} from 'react';

export default function ErrorSnackbar({error, children}) {
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
    />
  );
}
