import {StyleSheet, View} from 'react-native';
import {Checkbox, Text} from 'react-native-paper';

export default function LabeledCheckbox({
  label,
  checked,
  onChangeChecked,
  testID,
}) {
  const status = checked ? 'checked' : 'unchecked';
  return (
    <View style={styles.row}>
      <Checkbox.Android
        status={status}
        onPress={() => onChangeChecked(!checked)}
        testID={testID}
      />
      <Text>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
