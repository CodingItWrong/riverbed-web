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
    IDS[type] ??= 1;
    id = String(IDS[type]++);
    attributes = merge({}, newRecordAttributes, attributeOverrides);
  }
  return {type, id, attributes};
}

const Factory = {
  board: (attributeOverrides, baseRecord) =>
    createOrUpdate({
      type: 'boards',
      attributeOverrides,
      baseRecord,
    }),

  field: (attributeOverrides, baseRecord) =>
    createOrUpdate({
      type: 'elements',
      attributeOverrides,
      baseRecord,
      newRecordAttributes: {
        'element-type': ELEMENT_TYPES.FIELD.key,
        options: {},
      },
    }),

  button: (attributeOverrides, baseRecord) =>
    createOrUpdate({
      type: 'elements',
      attributeOverrides,
      baseRecord,
      newRecordAttributes: {'element-type': ELEMENT_TYPES.BUTTON.key},
    }),

  buttonMenu: (attributeOverrides, baseRecord) =>
    createOrUpdate({
      type: 'elements',
      attributeOverrides,
      baseRecord,
      newRecordAttributes: {'element-type': ELEMENT_TYPES.BUTTON_MENU.key},
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
