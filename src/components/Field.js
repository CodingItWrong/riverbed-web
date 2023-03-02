import {View} from 'react-native';
import Text from './Text';
import fieldTypes from './fieldTypes';

export default function Field({
  field,
  value,
  readOnly,
  disabled,
  setValue,
  onBlur,
  style,
}) {
  const {name, 'data-type': dataType, options} = field.attributes;

  const fieldType = fieldTypes[dataType];

  if (!fieldType) {
    return <Text>ERROR: unknown data type {dataType}</Text>;
  }

  if (readOnly) {
    let textToShow = fieldType.formatValue({value, options});

    if (options['show-label-when-read-only']) {
      textToShow = `${name}: ${textToShow ?? '(empty)'}`;
    }

    if (!textToShow) {
      return null;
    }

    return (
      <View style={style} testID={`field-${field.id}`}>
        <Text>{textToShow}</Text>
      </View>
    );
  }

  const {EditorComponent} = fieldType;
  return (
    <EditorComponent
      field={field}
      value={value ?? ''}
      setValue={setValue}
      onBlur={onBlur}
      disabled={disabled}
      style={style}
    />
  );
}
