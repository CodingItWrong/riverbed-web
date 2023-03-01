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
  onBlur,
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
      onValueChange={choice => {
        const newValue = choice?.id;
        setValue(newValue);

        // remove need for this value override; make fields function consistently
        onBlur?.({[field.id]: newValue});
      }}
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
