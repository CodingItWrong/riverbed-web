import FIELD_DATA_TYPES from '../../enums/fieldDataTypes';
import NumberField from '../NumberField';

const numberFieldDataType = {
  key: FIELD_DATA_TYPES.NUMBER.key,
  label: FIELD_DATA_TYPES.NUMBER.label,
  formatValue: value => value,
  getSortValue: value => value,
  EditorComponent: NumberEditorComponent,
};

function NumberEditorComponent({
  field,
  value,
  setValue,
  readOnly,
  disabled,
  style,
}) {
  const {name} = field.attributes;
  return (
    <NumberField
      key={field.id}
      label={name}
      testID={`number-input-${field.id}`}
      value={value ?? ''}
      onChangeText={setValue}
      disabled={disabled}
      style={style}
    />
  );
}

export default numberFieldDataType;
