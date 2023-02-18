import {useState} from 'react';
import {Button, Menu} from 'react-native-paper';

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
          accessibilityLabel={fieldLabel}
          style={style}
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
      {options?.map(option => {
        console.log({option});
        return (
          <Menu.Item
            key={keyExtractor(option)}
            title={labelExtractor(option)}
            accessibilityRole="button"
            onPress={() => handleChoose(option)}
          />
        );
      })}
    </Menu>
  );
}
