import FIELD_DATA_TYPES from '../../enums/fieldDataTypes';
import TextField from '../TextField';

const textFieldDataType = {
  key: FIELD_DATA_TYPES.TEXT.key,
  label: 'Text',
  formatValue: ({value}) => value?.trim(),
  getSortValue: ({value}) => textFieldDataType.formatValue({value}),
  EditorComponent: TextEditorComponent,
};

function TextEditorComponent({field, label, value, setValue, disabled, style}) {
  const {options: {multiline} = {}} = field.attributes;
  return (
    <TextField
      label={label}
      value={value ?? ''}
      onChangeText={setValue}
      disabled={disabled}
      multiline={multiline}
      style={style}
      testID={`text-input-${field.id}`}
    />
  );
}

export default textFieldDataType;
