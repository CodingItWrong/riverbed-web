import {TextInput as PaperTextInput} from 'react-native-paper';
import sharedStyles from './sharedStyles';

export default function NumberField({
  label,
  value,
  onChangeText,
  keyboardType = 'decimal-pad',
  testID,
  style,
}) {
  function handleChangeText(text) {
    const sanitizedText = text.replace(/[^.0-9]/g, '');
    onChangeText(sanitizedText);
  }

  return (
    <PaperTextInput
      label={label}
      testID={testID}
      value={value}
      keyboardType={keyboardType}
      onChangeText={handleChangeText}
      style={[sharedStyles.textInput, style]}
    />
  );
}
