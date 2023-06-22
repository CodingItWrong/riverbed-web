import {StyleSheet, useWindowDimensions} from 'react-native';
import {large, useBreakpoint} from '../breakpoints';

const sharedStyles = StyleSheet.create({
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  spacer: {
    flex: 1,
  },
  hidden: {
    opacity: 0,
  },
});

export default sharedStyles;

export function useColumnStyle() {
  const breakpoint = useBreakpoint();
  const {width: viewportWidth} = useWindowDimensions();

  return {
    width: breakpoint === large ? 400 : viewportWidth,
    padding: 8,
  };
}
