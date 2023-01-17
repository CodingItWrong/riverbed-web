import {TextInput as PaperTextInput} from 'react-native-paper';

export default function TextField({label, value, onChangeText, testID, style}) {
  return (
    <PaperTextInput
      multiline
      label={label}
      testID={testID}
      value={value}
      onChangeText={onChangeText}
      style={style}
    />
  );
}
