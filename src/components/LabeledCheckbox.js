import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function LabeledCheckbox({
  label,
  checked,
  onChangeChecked,
  testID,
}) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={() => onChangeChecked(!checked)}
        />
      }
      label={label}
      data-testid={testID}
    />
  );
}
