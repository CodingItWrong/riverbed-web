import {Typography} from '@mui/material';

export default function SectionHeader({testID, style, children}) {
  return (
    <Typography component="div" variant="h6" style={style} data-testid={testID}>
      {children}
    </Typography>
  );
}
