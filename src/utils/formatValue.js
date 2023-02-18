import FIELD_DATA_TYPES from '../enums/fieldDataTypes';
import dateTimeUtils from './dateTimeUtils';
import dateUtils from './dateUtils';

export default function formatValue({value, dataType, options}) {
  switch (dataType) {
    case FIELD_DATA_TYPES.CHOICE.key:
      return options.choices.find(c => c.id === value)?.label;
    case FIELD_DATA_TYPES.DATE.key:
      return dateUtils.serverStringToHumanString(value);
    case FIELD_DATA_TYPES.DATETIME.key:
      return dateTimeUtils.serverStringToHumanString(value);
    case FIELD_DATA_TYPES.NUMBER.key:
      return value;
    case FIELD_DATA_TYPES.TEXT.key:
      return value?.trim();
    default:
      return `ERROR: unknown data type ${dataType}`;
  }
}
