const Factory = {
  _ids: {
    element: 1,
    column: 1,
    card: 1,
  },

  field(attributeOverrides) {
    const attributes = {
      name: 'Some Field',
      'element-type': 'field',
      'show-in-summary': true,
      ...attributeOverrides,
    };
    return {
      type: 'elements',
      id: String(this._ids.element++),
      attributes,
    };
  },

  button(attributeOverrides) {
    const attributes = {
      name: 'Some Button',
      'show-in-summary': true,
      ...attributeOverrides,
      'element-type': 'button',
    };
    return {
      type: 'elements',
      id: String(this._ids.element++),
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
