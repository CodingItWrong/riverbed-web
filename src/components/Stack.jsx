import MuiStack from '@mui/material/Stack';

export default function Stack({
  direction,
  alignItems,
  spacing,
  useFlexGap,
  flexWrap,
  children,
}) {
  return (
    <MuiStack
      direction={direction}
      alignItems={alignItems}
      spacing={spacing}
      useFlexGap={useFlexGap}
      flexWrap={flexWrap}
    >
      {children}
    </MuiStack>
  );
}
