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
  label,
  value,
  setValue,
  disabled,
  style,
}) {
  const {options: {choices} = {}} = field.attributes;
  // TODO: try using MUI's component for browser-native <select>
  return (
    <DropdownField
      fieldLabel={label}
      emptyLabel="(choose)"
      value={choices?.find(c => c.id === value)}
      onValueChange={choice => setValue(choice?.id)}
      options={choices}
      keyExtractor={choice => choice.id}
      labelExtractor={choice => choice.label}
      disabled={disabled}
      style={style}
      testID={`choice-input-${field.id}`}
    />
  );
}

export default choiceFieldDataType;
