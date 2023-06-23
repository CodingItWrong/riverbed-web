import QUERIES from '../enums/queries';
import Button from './Button';
import DropdownField from './DropdownField';
import Field from './Field';
import IconButton from './IconButton';
import sharedStyles from './sharedStyles';

export default function ConditionInputs({
  conditions: rawConditions,
  updateConditionsPath,
  fields,
}) {
  const queryOptions = Object.values(QUERIES);
  const conditions = rawConditions ?? [];

  function addCondition() {
    updateConditionsPath('', [...conditions, {}]);
  }

  function removeConditionAtIndex(index) {
    const newConditions = [...conditions];
    newConditions.splice(index, 1);
    updateConditionsPath('', newConditions);
  }

  // TODO:
  // - test removing a filter
  // - refactor visuals incl field names
  return (
    <>
      {conditions.map((condition, index) => (
        <div key={`condition-${index}`} style={sharedStyles.row}>
          <div style={styles.conditionElements}>
            <DropdownField
              fieldLabel="Field"
              emptyLabel="(choose)"
              options={fields}
              value={fields.find(f => f.id === condition.field)}
              onValueChange={field =>
                updateConditionsPath(`[${index}].field`, field?.id)
              }
              keyExtractor={field => field.id}
              labelExtractor={field => field.attributes.name}
              style={styles.conditionClause}
            />
            <DropdownField
              fieldLabel="Condition"
              emptyLabel="(choose)"
              options={queryOptions}
              value={queryOptions.find(query => query.key === condition.query)}
              onValueChange={query =>
                updateConditionsPath(`[${index}].query`, query?.key)
              }
              keyExtractor={query => query.key}
              labelExtractor={query => query.label}
              style={styles.conditionClause}
            />
            {queryOptions.find(query => query.key === condition.query)
              ?.showConcreteValueField &&
              condition.field && (
                <div style={styles.conditionClause}>
                  <Field
                    field={fields.find(f => f.id === condition.field)}
                    value={condition.options?.value}
                    setValue={v =>
                      updateConditionsPath(`[${index}].options.value`, v)
                    }
                  />
                </div>
              )}
          </div>
          <IconButton
            icon="close-circle"
            accessibilityLabel="Remove condition"
            onPress={() => removeConditionAtIndex(index)}
          />
        </div>
      ))}
      <Button
        icon="plus"
        mode="link"
        onPress={addCondition}
        style={sharedStyles.mt}
      >
        Add Condition
      </Button>
    </>
  );
}

const styles = {
  conditionElements: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  conditionClause: {
    marginTop: 8,
    marginRight: 8,
  },
};
