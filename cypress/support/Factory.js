import ELEMENT_TYPES from '../../src/enums/elementTypes';

const Factory = {
  _ids: {
    element: 1,
    column: 1,
    card: 1,
  },

  field(attributeOverrides, baseField) {
    let id;
    let attributes;

    if (baseField) {
      id = baseField.id;
      attributes = {
        ...baseField.attributes,
        ...attributeOverrides,
      };
    } else {
      id = this._ids.element++;
      attributes = {
        ...attributeOverrides,
        'element-type': ELEMENT_TYPES.FIELD.key,
      };
    }
    return {
      type: 'elements',
      id: String(id),
      attributes,
    };
  },

  button(attributeOverrides, baseButton) {
    let id;
    let attributes;

    if (baseButton) {
      id = baseButton.id;
      attributes = {
        ...baseButton.attributes,
        ...attributeOverrides,
      };
    } else {
      id = String(this._ids.element++);
      attributes = {
        ...attributeOverrides,
        'element-type': ELEMENT_TYPES.BUTTON.key,
      };
    }
    return {
      type: 'elements',
      id,
      attributes,
    };
  },

  column(attributes) {
    return {
      type: 'columns',
      id: String(this._ids.column++),
      attributes,
    };
  },

  card(fieldValueOverrides, baseCard) {
    let id;
    let fieldValues;

    if (baseCard) {
      id = baseCard.id;
      fieldValues = {
        ...baseCard.attributes['field-values'],
        ...fieldValueOverrides,
      };
    } else {
      id = String(this._ids.card++);
      fieldValues = fieldValueOverrides ?? {};
    }

    return {
      type: 'cards',
      id,
      attributes: {
        'field-values': fieldValues,
      },
    };
  },
};

module.exports = Factory;
