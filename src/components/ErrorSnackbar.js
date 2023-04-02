import {useEffect, useState} from 'react';
import {Snackbar} from 'react-native-paper';

export default function ErrorSnackbar({error, children}) {
  const [visible, setVisible] = useState(Boolean(error));

  // show when a new error is present
  useEffect(() => {
    setVisible(Boolean(error));
  }, [error]);

  return (
    <Snackbar visible={visible} onDismiss={() => setVisible(false)}>
      {children}
    </Snackbar>
  );
}
