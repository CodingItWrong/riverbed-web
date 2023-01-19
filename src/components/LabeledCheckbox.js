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
      <Text>{label}</Text>
      <Checkbox
        status={status}
        onPress={() => onChangeChecked(!checked)}
        testID={testID}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
