import {StyleSheet, View} from 'react-native';
import {ToggleButton} from 'react-native-paper';
import Text from './Text';

export default function ButtonGroup({
  label,
  value,
  onChangeValue,
  options,
  style,
}) {
  return (
    <View style={style}>
      <Text variant="bodySmall">{label}</Text>
      <View style={styles.toggleButtonList}>
        {options.map(option => (
          <ToggleButton
            key={option.key}
            value={option.key}
            icon={option.icon}
            iconColor={option.iconColor}
            accessibilityLabel={option.label}
            status={value === option.key ? 'checked' : 'unchecked'}
            onPress={() => onChangeValue(option.key)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  toggleButtonList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
