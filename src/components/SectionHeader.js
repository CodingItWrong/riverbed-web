import ListSubheader from '@mui/material/ListSubheader';

export default function SectionHeader({testID, style, children}) {
  return (
    <ListSubheader component="div" style={style} data-testid={testID}>
      {children}
    </ListSubheader>
  );
}
