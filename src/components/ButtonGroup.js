import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Text from '@mui/material/Typography';
import {primaryColors} from '../theme/primaryColors';
import Icon from './Icon';
import Stack from './Stack';

export default function ButtonGroup({label, value, onChangeValue, options}) {
  function handleChange(event, newValue) {
    onChangeValue(newValue === EMPTY_VALUE ? null : newValue);
  }

  return (
    <Stack>
      <Text variant="bodySmall">{label}</Text>
      <ToggleButtonGroup
        exclusive
        value={value ?? EMPTY_VALUE}
        onChange={handleChange}
      >
        {options.map(option => {
          const color = option.iconColor
            ? primaryColors[option.iconColor]
            : null;
          return (
            <ToggleButton
              key={option.key}
              value={option.key ?? EMPTY_VALUE}
              aria-label={option.label}
            >
              <Icon name={option.icon} sx={{color}} />
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </Stack>
  );
}

const EMPTY_VALUE = '__empty__';
