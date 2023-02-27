import {View} from 'react-native';
import formatValue from '../utils/formatValue';
import Text from './Text';
import fieldTypes from './fieldTypes';

export default function Field({
  field,
  value,
  readOnly,
  disabled,
  setValue,
  style,
}) {
  const {name, 'data-type': dataType, options} = field.attributes;

  if (readOnly) {
    let textToShow = formatValue({value, dataType, options});

    if (options['show-label-when-read-only']) {
      textToShow = `${name}: ${textToShow ?? '(empty)'}`;
    }

    return (
      <View style={style} testID={`field-${field.id}`}>
        <Text>{textToShow}</Text>
      </View>
    );
  }

  const fieldType = fieldTypes[dataType];

  if (!fieldType) {
    return <Text>ERROR: unknown data type {dataType}</Text>;
  }

  const {EditorComponent} = fieldType;
  return (
    <EditorComponent
      field={field}
      value={value ?? ''}
      setValue={setValue}
      disabled={disabled}
      style={style}
    />
  );
}
