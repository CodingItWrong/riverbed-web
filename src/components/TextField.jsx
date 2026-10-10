import MuiTextField from '@mui/material/TextField';

export default function TextField({
  label,
  value,
  onChangeText,
  disabled,
  multiline,
  autoCapitalize,
  autoCorrect,
  inputType,
  testID,
  style,
}) {
  return (
    <MuiTextField
      variant="filled"
      type={inputType}
      label={label}
      aria-label={label}
      inputProps={{
        'data-testid': testID,
      }}
      value={value}
      onChange={e => onChangeText(e.target.value)}
      disabled={disabled}
      multiline={multiline}
      autoCapitalize={autoCapitalize ?? undefined}
      autoCorrect={autoCorrect ?? undefined}
      style={style}
    />
  );
}
