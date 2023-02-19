import {useState} from 'react';
import {Button, Menu} from 'react-native-paper';
import sharedStyles from './sharedStyles';

export default function DropdownField({
  fieldLabel,
  emptyLabel,
  value,
  onValueChange,
  options,
  disabled,
  keyExtractor = option => option.key,
  labelExtractor = option => option.label,
  style,
  testID,
}) {
  const [isMenuShown, setIsMenuShown] = useState(false);

  function handleChoose(option) {
    onValueChange(option);
    setIsMenuShown(false);
  }

  return (
    <Menu
      visible={isMenuShown}
      onDismiss={() => setIsMenuShown(false)}
      anchor={
        <Button
          testID={testID}
          mode="outlined"
          icon="chevron-down"
          accessibilityLabel={fieldLabel}
          style={style}
          contentStyle={sharedStyles.flexReverse}
          disabled={disabled}
          onPress={() => setIsMenuShown(true)}
        >
          {fieldLabel ? `${fieldLabel}: ` : ''}
          {value ? labelExtractor(value) : emptyLabel}
        </Button>
      }
    >
      <Menu.Item
        key="paper-dropdown-empty-item"
        title={emptyLabel}
        accessibilityRole="button"
        onPress={() => handleChoose(null)}
      />
      {options?.map(option => (
        <Menu.Item
          key={keyExtractor(option)}
          title={labelExtractor(option)}
          accessibilityRole="button"
          onPress={() => handleChoose(option)}
        />
      ))}
    </Menu>
  );
}
