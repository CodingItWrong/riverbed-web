import MuiStack from '@mui/material/Stack';

export default function Stack({direction, alignItems, spacing, children}) {
  return (
    <MuiStack direction={direction} alignItems={alignItems} spacing={spacing}>
      {children}
    </MuiStack>
  );
}
