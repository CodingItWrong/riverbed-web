import {StyleSheet} from 'react-native';

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
