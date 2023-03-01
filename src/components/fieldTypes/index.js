import choice from './choice';
import date from './date';
import dateTime from './dateTime';
import geolocation from './geolocation';
import number from './number';
import text from './text';

const fieldTypeArray = [choice, date, dateTime, geolocation, number, text];

const fieldTypes = Object.fromEntries(
  fieldTypeArray.map(fieldType => [fieldType.key, fieldType]),
);

export default fieldTypes;
