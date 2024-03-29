import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function LabeledCheckbox({
  label,
  checked,
  onChangeChecked,
  testID,
  style,
}) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked ?? false}
          onChange={() => onChangeChecked(!checked)}
        />
      }
      label={label}
      data-testid={testID}
      style={style}
    />
  );
}
