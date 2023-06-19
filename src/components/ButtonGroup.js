import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {View} from 'react-native';
import Icon from './Icon';
import Text from './Text';

export default function ButtonGroup({
  label,
  value,
  onChangeValue,
  options,
  style,
}) {
  function handleChange(event, newValue) {
    onChangeValue(newValue === EMPTY_VALUE ? null : newValue);
  }

  return (
    <View style={style}>
      <Text variant="bodySmall">{label}</Text>
      <ToggleButtonGroup
        exclusive
        value={value ?? EMPTY_VALUE}
        onChange={handleChange}
      >
        {options.map(option => (
          <ToggleButton
            key={option.key}
            value={option.key ?? EMPTY_VALUE}
            aria-label={option.label}
          >
            <Icon name={option.icon} color={option.iconColor} />
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </View>
  );
}

const EMPTY_VALUE = '__empty__';
