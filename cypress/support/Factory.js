const Factory = {
  _ids: {
    field: 1,
    card: 1,
  },

  field(attributeOverrides) {
    const attributes = {
      name: 'Some Field',
      'show-in-summary': true,
      ...attributeOverrides,
    };
    return {
      type: 'fields',
      id: String(this._ids.card++),
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
