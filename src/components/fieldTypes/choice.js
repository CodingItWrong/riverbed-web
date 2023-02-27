import FIELD_DATA_TYPES from '../../enums/fieldDataTypes';
import DropdownField from '../DropdownField';

const choiceFieldDataType = {
  key: FIELD_DATA_TYPES.CHOICE.key,
  label: 'Choice',
  formatValue: ({value, options}) =>
    options.choices?.find(c => c.id === value)?.label,
  getSortValue: ({value, options}) =>
    options.choices?.findIndex(c => c.id === value),
  EditorComponent: ChoiceEditorComponent,
};

function ChoiceEditorComponent({
  field,
  value,
  setValue,
  readOnly,
  disabled,
  style,
}) {
  const {name, options: {choices} = {}} = field.attributes;
  return (
    <DropdownField
      fieldLabel={name}
      emptyLabel="(choose)"
      value={choices?.find(c => c.id === value)}
      onValueChange={choice => setValue(choice?.id)}
      options={choices}
      keyExtractor={choice => choice.id}
      labelExtractor={choice => choice.label}
      disabled={disabled}
      style={style}
    />
  );
}

export default choiceFieldDataType;
