import FIELD_DATA_TYPES from '../../enums/fieldDataTypes';
import NumberField from '../NumberField';

const numberFieldDataType = {
  key: FIELD_DATA_TYPES.NUMBER.key,
  label: 'Number',
  formatValue: ({value}) => value,
  getSortValue: ({value}) => value,
  EditorComponent: NumberEditorComponent,
};

function NumberEditorComponent({
  field,
  label,
  value,
  setValue,
  readOnly,
  disabled,
  style,
}) {
  return (
    <NumberField
      key={field.id}
      label={label}
      testID={`number-input-${field.id}`}
      value={value ?? ''}
      onChangeText={setValue}
      disabled={disabled}
      style={style}
    />
  );
}

export default numberFieldDataType;
