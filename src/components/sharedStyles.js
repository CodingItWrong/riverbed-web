import {large, useBreakpoint} from '../breakpoints';

const sharedStyles = {
  column: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  columnPadding: {
    padding: '8px',
  },
  fill: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
  },
  flexReverse: {
    flexDirection: 'row-reverse',
  },
  fullHeight: {
    flex: 1,
  },
  mb: {
    marginBottom: '8px',
  },
  mt: {
    marginTop: '8px',
  },
  mr: {
    marginRight: '8px',
  },
  noPadding: {
    padding: 0,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '5px',
  },
  spacer: {
    flex: 1,
  },
  hidden: {
    opacity: 0,
  },
};

export default sharedStyles;

export function useColumnStyle() {
  const breakpoint = useBreakpoint();

  return {
    width: breakpoint === large ? 400 : '100vw',
    padding: 8,
  };
}
