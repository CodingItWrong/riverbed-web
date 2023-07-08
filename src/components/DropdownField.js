import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import {useId} from 'react';
import sharedStyles from './sharedStyles';

export default function DropdownField({
  fieldLabel,
  emptyLabel,
  value,
  onValueChange,
  options,
  disabled,
  style,
  keyExtractor = option => option.key,
  labelExtractor = option => option.label,
  testID,
}) {
  const id = useId();
  const labelId = `${id}-label`;
  const selectId = `${id}-select`;

  function handleChange(event) {
    const newValue = event.target.value;
    const option = options.find(o => keyExtractor(o) === newValue);
    onValueChange(option);
  }

  return (
    <div style={{...sharedStyles.column, ...style}}>
      <FormControl sx={{mt: '5px'}}>
        <InputLabel id={labelId}>{fieldLabel}</InputLabel>
        <Select
          labelId={labelId}
          label={fieldLabel}
          id={selectId}
          value={value ? keyExtractor(value) : EMPTY_VALUE}
          onChange={handleChange}
          data-testid={testID}
          disabled={disabled}
        >
          {emptyLabel && <MenuItem value={EMPTY_VALUE}>{emptyLabel}</MenuItem>}
          {options?.map(option => (
            <MenuItem key={keyExtractor(option)} value={keyExtractor(option)}>
              {labelExtractor(option)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

const EMPTY_VALUE = '__empty__';
