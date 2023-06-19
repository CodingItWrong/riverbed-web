import MuiTextField from '@mui/material/TextField';

export default function TextField({
  label,
  value,
  onChangeText,
  disabled,
  multiline,
  autoCapitalize,
  autoCorrect,
  secureTextEntry,
  keyboardType,
  testID,
  style,
}) {
  console.log({style});
  return (
    <MuiTextField
      variant="filled"
      type={getInputType({secureTextEntry, keyboardType})}
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

function getInputType({secureTextEntry, keyboardType}) {
  if (secureTextEntry) {
    return 'password';
  }

  switch (keyboardType) {
    case 'email-address':
      return 'email';
    case 'decimal-pad':
      return 'number';
    default:
      return 'text';
  }
}
