import textFieldDataType from '../components/fieldTypes/text';
import FIELD_DATA_TYPES from '../enums/fieldDataTypes';

export default function getSortValue({value, dataType, options}) {
  switch (dataType) {
    case FIELD_DATA_TYPES.CHOICE.key:
      // sort by the choice label, not uuid
      return options.choices.find(c => c.id === value)?.label.trim();
    case FIELD_DATA_TYPES.DATE.key:
    case FIELD_DATA_TYPES.DATETIME.key:
    case FIELD_DATA_TYPES.NUMBER.key:
      // dates are stored as strings that sort lexicographically
      return value;
    case FIELD_DATA_TYPES.TEXT.key:
      return textFieldDataType.getSortValue(value);
    default:
      return `ERROR: unknown data type ${dataType}`;
  }
}
