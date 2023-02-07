import {TextInput as PaperTextInput} from 'react-native-paper';
import sharedStyles from './sharedStyles';

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
      testID={testID}
      value={value}
      onChangeText={onChangeText}
      disabled={disabled}
      multiline={multiline}
      autoCapitalize={autoCapitalize}
      autoCorrect={autoCorrect}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      style={[sharedStyles.textInput, style]}
    />
  );
}
