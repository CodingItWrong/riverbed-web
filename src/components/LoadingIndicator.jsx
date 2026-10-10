import CircularProgress from '@mui/material/CircularProgress';

export default function LoadingIndicator({
  loading = true,
  small = false,
  style,
}) {
  return loading ? (
    <CircularProgress
      aria-label="Loading"
      style={style}
      size={small ? 24 : undefined}
    />
  ) : null;
}
