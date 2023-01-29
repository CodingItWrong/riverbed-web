import {StyleSheet, useWindowDimensions} from 'react-native';
import {large, useBreakpoint} from '../breakpoints';

const sharedStyles = StyleSheet.create({
  fullHeight: {
    flex: 1,
  },
  mt: {
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
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
