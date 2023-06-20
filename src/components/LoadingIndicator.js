import CircularProgress from '@mui/material/CircularProgress';

export default function LoadingIndicator({loading = true, style}) {
  return loading ? (
    <CircularProgress aria-label="Loading" style={style} />
  ) : null;
}
