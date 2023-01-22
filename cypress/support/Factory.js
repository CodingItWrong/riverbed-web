import merge from 'lodash.merge';
import ELEMENT_TYPES from '../../src/enums/elementTypes';

const IDS = {};

function createOrUpdate({
  type,
  attributeOverrides,
  baseRecord,
  newRecordAttributes,
}) {
  let id;
  let attributes;

  if (baseRecord) {
    id = baseRecord.id;
    attributes = merge({}, baseRecord.attributes, attributeOverrides);
  } else {
    IDS[type] ??= 0;
    id = String(IDS[type]++);
    attributes = merge({}, newRecordAttributes, attributeOverrides);
  }
  return {type, id, attributes};
}

const Factory = {
  field: (attributeOverrides, baseRecord) =>
    createOrUpdate({
      type: 'elements',
      attributeOverrides,
      baseRecord,
      newRecordAttributes: {'element-type': ELEMENT_TYPES.FIELD.key},
    }),

  button: (attributeOverrides, baseRecord) =>
    createOrUpdate({
      type: 'elements',
      attributeOverrides,
      baseRecord,
      newRecordAttributes: {'element-type': ELEMENT_TYPES.BUTTON.key},
    }),

  column: (attributeOverrides, baseRecord) =>
    createOrUpdate({
      type: 'columns',
      attributeOverrides,
      baseRecord,
    }),

  card: (fieldValueOverrides, baseRecord) =>
    createOrUpdate({
      type: 'cards',
      attributeOverrides: {'field-values': fieldValueOverrides},
      baseRecord,
      newRecordAttributes: {'field-values': {}},
    }),
};

module.exports = Factory;
