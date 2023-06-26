import ToggleButton from '@mui/material/ToggleButton';
import Text from '@mui/material/Typography';
import {primaryColors} from '../theme/primaryColors';
import Icon from './Icon';
import Stack from './Stack';

export default function ButtonGroup({label, value, onChangeValue, options}) {
  return (
    <Stack>
      <Text variant="bodySmall">{label}</Text>
      <Stack direction="row" spacing="3px" useFlexGap flexWrap="wrap">
        {options.map(option => {
          const color = option.iconColor
            ? primaryColors[option.iconColor]
            : null;
          return (
            <ToggleButton
              key={option.key}
              aria-label={option.label}
              selected={value === option.key}
              onChange={() => onChangeValue(option.key)}
            >
              <Icon name={option.icon} sx={{color}} />
            </ToggleButton>
          );
        })}
      </Stack>
    </Stack>
  );
}
