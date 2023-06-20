import Typography from '@mui/material/Typography';

export default function SectionHeader({testID, style, children}) {
  return (
    <Typography
      component="div"
      variant="h6"
      color="textPrimary"
      style={style}
      data-testid={testID}
    >
      {children}
    </Typography>
  );
}
