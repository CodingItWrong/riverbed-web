import MuiTextField from '@mui/material/TextField';

export default function NumberField({
  label,
  value,
  onChangeText,
  disabled,
  keyboardType = 'decimal-pad',
  testID,
  style,
}) {
  function handleChangeText(text) {
    // TODO: prevent multiple decimal points
    const sanitizedText = text.replace(/[^.0-9-]/g, '');
    onChangeText(sanitizedText);
  }

  return (
    <MuiTextField
      type="number"
      inputMode={getInputMode({keyboardType})}
      variant="filled"
      label={label}
      inputProps={{
        'data-testid': testID,
      }}
      value={value}
      onChange={e => handleChangeText(e.target.value)}
      disabled={disabled}
      style={style}
    />
  );
}

function getInputMode({keyboardType}) {
  switch (keyboardType) {
    case 'decimal-pad':
      return 'decimal';
    case 'number-pad':
      return 'number';
    default:
      return null;
  }
}
