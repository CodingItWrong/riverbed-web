import {View} from 'react-native';
import FIELD_DATA_TYPES from '../enums/fieldDataTypes';
import formatValue from '../utils/formatValue';
import Text from './Text';
import choiceFieldDataType from './fieldTypes/choice';
import dateFieldDataType from './fieldTypes/date';
import numberFieldDataType from './fieldTypes/number';
import textFieldDataType from './fieldTypes/text';

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

  switch (dataType) {
    case FIELD_DATA_TYPES.CHOICE.key: {
      const {EditorComponent} = choiceFieldDataType;
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
    case FIELD_DATA_TYPES.DATE.key: {
      const {EditorComponent} = dateFieldDataType;
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
    case FIELD_DATA_TYPES.DATETIME.key:
      // TODO: implement writable
      return (
        <View style={style} testID={`field-${field.id}`}>
          <Text>{formatValue({value, dataType})}</Text>
        </View>
      );
    case FIELD_DATA_TYPES.NUMBER.key: {
      const {EditorComponent} = numberFieldDataType;
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
    case FIELD_DATA_TYPES.TEXT.key: {
      const {EditorComponent} = textFieldDataType;
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
    default:
      return <Text>ERROR: unknown data type {dataType}</Text>;
  }
}
