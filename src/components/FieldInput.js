import TextField from './TextField';

export default function FieldInput({field, value, setValue}) {
  return (
    <TextField
      key={field.id}
      label={field.attributes.name}
      testID={`text-input-${field.attributes.name}`}
      value={value ?? ''}
      onChangeText={setValue}
    />
  );
}
