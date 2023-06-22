import {useWindowDimensions} from 'react-native';
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
  const {width: viewportWidth} = useWindowDimensions();

  return {
    width: breakpoint === large ? 400 : viewportWidth,
    padding: 8,
  };
}
