import Stack from '@mui/material/Stack';
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
    <Stack>
      {conditions.map((condition, index) => (
        <div key={`condition-${index}`} style={sharedStyles.row}>
          <div style={styles.concreteFieldWrapper}>
            <div style={{...styles.conditionElements, ...sharedStyles.mt}}>
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
                style={styles.conditionButton}
              />
              <DropdownField
                fieldLabel="Condition"
                emptyLabel="(choose)"
                options={queryOptions}
                value={queryOptions.find(
                  query => query.key === condition.query,
                )}
                onValueChange={query =>
                  updateConditionsPath(`[${index}].query`, query?.key)
                }
                keyExtractor={query => query.key}
                labelExtractor={query => query.label}
                style={styles.conditionButton}
              />
            </div>
            {queryOptions.find(query => query.key === condition.query)
              ?.showConcreteValueField &&
              condition.field && (
                <Field
                  field={fields.find(f => f.id === condition.field)}
                  value={condition.options?.value}
                  setValue={v =>
                    updateConditionsPath(`[${index}].options.value`, v)
                  }
                  style={sharedStyles.mt}
                />
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
    </Stack>
  );
}

const styles = {
  conditionElements: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  conditionButton: {
    marginRight: 8,
  },
  concreteFieldWrapper: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
};
