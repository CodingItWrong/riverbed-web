import MuiTextField from '@mui/material/TextField';

export default function NumberField({
  label,
  value,
  onChangeText,
  disabled,
  inputMode,
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
      inputMode={inputMode}
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
