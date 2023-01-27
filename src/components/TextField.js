import {TextInput as PaperTextInput} from 'react-native-paper';
import sharedStyles from './sharedStyles';

export default function TextField({
  label,
  value,
  onChangeText,
  keyboardType,
  testID,
  style,
}) {
  return (
    <PaperTextInput
      multiline
      label={label}
      testID={testID}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      style={[sharedStyles.textInput, style]}
    />
  );
}
