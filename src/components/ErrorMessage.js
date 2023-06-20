import Alert from '@mui/material/Alert';

export default function ErrorMessage({theme, children, style}) {
  return (
    children && (
      <Alert
        severity="error"
        data-testid="error-message"
        sx={{m: 2}}
        style={style}
      >
        {children}
      </Alert>
    )
  );
}
