import {Platform, StyleSheet} from 'react-native';
import {TextInput as PaperTextInput} from 'react-native-paper';
import sharedStyles from './sharedStyles';

const IS_WEB = Platform.OS === 'web';

export default function TextField({
  label,
  value,
  onChangeText,
  disabled,
  multiline,
  autoCapitalize,
  autoCorrect,
  secureTextEntry,
  keyboardType,
  testID,
  style,
}) {
  return (
    <PaperTextInput
      // TODO: see if removing "multiline" helps with scrolling
      // multiline
      label={label}
      accessibilityLabel={label}
      testID={testID}
      value={value}
      onChangeText={onChangeText}
      disabled={disabled}
      multiline={multiline}
      autoCapitalize={autoCapitalize}
      autoCorrect={autoCorrect}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      style={[
        sharedStyles.textInput,
        style,
        IS_WEB && multiline && styles.multilineWeb,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  // 3 lines, because does not auto-expand to fit content on web
  // @see https://github.com/callstack/react-native-paper/issues/3124
  multilineWeb: {
    height: 100,
  },
});
