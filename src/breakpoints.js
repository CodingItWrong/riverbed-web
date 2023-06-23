import useMediaQuery from '@mui/material/useMediaQuery';

export const breakpointMedium = 429;
export const breakpointLarge = 600;

export const large = 'large';
export const medium = 'medium';

export function useBreakpoint() {
  const isLarge = useMediaQuery(`(min-width:${breakpointLarge}px)`);

  return isLarge ? large : medium;
}
