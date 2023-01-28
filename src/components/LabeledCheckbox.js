import {Checkbox} from 'react-native-paper';

export default function LabeledCheckbox({
  label,
  checked,
  onChangeChecked,
  testID,
}) {
  const status = checked ? 'checked' : 'unchecked';
  return (
    <Checkbox.Item
      mode="android"
      label={label}
      status={status}
      onPress={() => onChangeChecked(!checked)}
      testID={testID}
    />
  );
}
