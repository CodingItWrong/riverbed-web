import {TextInput as PaperTextInput} from 'react-native-paper';
import sharedStyles from './sharedStyles';

export default function NumberField({
  label,
  value,
  onChangeText,
  onBlur,
  disabled,
  keyboardType = 'decimal-pad',
  testID,
  style,
}) {
  function handleChangeText(text) {
    // TODO: prevent multiple decimal points
    const sanitizedText = text.replace(/[^.0-9-]/g, '');
    onChangeText(sanitizedText);
  }

  return (
    <PaperTextInput
      label={label}
      testID={testID}
      value={value}
      keyboardType={keyboardType}
      onChangeText={handleChangeText}
      onBlur={onBlur}
      disabled={disabled}
      style={[sharedStyles.textInput, style]}
    />
  );
}
