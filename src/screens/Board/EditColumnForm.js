import {useMutation, useQuery} from '@tanstack/react-query';
import set from 'lodash.set';
import {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Card from '../../components/Card';
import DropdownField from '../../components/DropdownField';
import FormGroup from '../../components/FormGroup';
import IconButton from '../../components/IconButton';
import NumberField from '../../components/NumberField';
import TextField from '../../components/TextField';
import sharedStyles from '../../components/sharedStyles';
import {useColumns} from '../../data/columns';
import {useElements} from '../../data/elements';
import ELEMENT_TYPES from '../../enums/elementTypes';
import QUERIES from '../../enums/queries';
import SORT_DIRECTIONS from '../../enums/sortDirections';

export default function EditColumnForm({
  column,
  board,
  onChange,
  onCancel,
  style,
}) {
  const insets = useSafeAreaInsets();
  const columnClient = useColumns();
  const [attributes, setAttributes] = useState(column.attributes);

  function updateAttribute(path, value) {
    setAttributes(oldAttributes => {
      const newAttributes = {...oldAttributes};
      set(newAttributes, path, value);
      return newAttributes;
    });
  }

  const {mutate: updateColumn, isLoading: isSaving} = useMutation({
    mutationFn: () => {
      const updatedColumn = {
        type: 'columns',
        id: column.id,
        attributes,
      };
      return columnClient.update(updatedColumn);
    },
    onSuccess: onChange,
  });

  const {mutate: deleteColumn, isLoading: isDeleting} = useMutation({
    mutationFn: () => columnClient.delete({id: column.id}),
    onSuccess: onChange,
  });

  const isLoading = isSaving || isDeleting;

  return (
    <ScrollView
      contentContainerStyle={[
        sharedStyles.columnPadding,
        {paddingBottom: insets.bottom},
      ]}
      scrollIndicatorInsets={{bottom: insets.bottom}}
    >
      <Card style={style}>
        <TextField
          label="Column Name"
          value={attributes.name ?? ''}
          onChangeText={value => updateAttribute('name', value)}
          testID="text-input-column-name"
        />
        <NumberField
          keyboard-type="number-pad"
          label="Order"
          value={
            attributes['display-order'] == null
              ? ''
              : String(attributes['display-order'])
          }
          onChangeText={value =>
            updateAttribute(
              'display-order',
              value === '' ? null : Number(value),
            )
          }
          testID="number-input-order"
        />
        <CardInclusionCondition
          board={board}
          attributes={attributes}
          updateAttribute={updateAttribute}
        />
        <ColumnSortOrder
          board={board}
          attributes={attributes}
          updateAttribute={updateAttribute}
        />
        <ColumnGrouping
          board={board}
          attributes={attributes}
          updateAttribute={updateAttribute}
        />
        <Button onPress={onCancel} disabled={isLoading} style={sharedStyles.mt}>
          Cancel
        </Button>
        <Button
          onPress={deleteColumn}
          disabled={isLoading}
          style={sharedStyles.mt}
        >
          Delete Column
        </Button>
        <Button
          mode="primary"
          onPress={updateColumn}
          disabled={isLoading}
          style={sharedStyles.mt}
        >
          Save Column
        </Button>
      </Card>
    </ScrollView>
  );
}

function CardInclusionCondition({board, attributes, updateAttribute}) {
  // TODO: extract custom hook
  const elementClient = useElements();
  const {data: elements = []} = useQuery(['elements', board.id], () =>
    elementClient.related({parent: board}).then(resp => resp.data),
  );
  const fields = elements.filter(
    e => e.attributes['element-type'] === ELEMENT_TYPES.FIELD.key,
  );

  const queryOptions = Object.values(QUERIES);
  const conditions = attributes['card-inclusion-conditions'] ?? [];

  function addCondition() {
    updateAttribute('card-inclusion-conditions', [...conditions, {}]);
  }

  function removeConditionAtIndex(index) {
    const newConditions = [...conditions];
    newConditions.splice(index, 1);
    updateAttribute('card-inclusion-conditions', newConditions);
  }

  // TODO:
  // - test removing a filter
  // - refactor visuals incl field names
  return (
    <FormGroup title="Cards to Include">
      {conditions.map((condition, index) => (
        <View
          key={`condition-${index}`}
          style={[styles.conditionRow, sharedStyles.mt]}
        >
          <DropdownField
            fieldLabel={null}
            emptyLabel="(field)"
            options={fields}
            value={fields.find(f => f.id === condition.field)}
            onValueChange={field =>
              updateAttribute(
                `card-inclusion-conditions[${index}].field`,
                field.id,
              )
            }
            keyExtractor={field => field.id}
            labelExtractor={field => field.attributes.name}
            style={styles.conditionButton}
          />
          <DropdownField
            fieldLabel={null}
            emptyLabel="(condition)"
            options={queryOptions}
            value={queryOptions.find(query => query.key === condition.query)}
            onValueChange={query =>
              updateAttribute(
                `card-inclusion-conditions[${index}].query`,
                query.key,
              )
            }
            keyExtractor={query => query.key}
            labelExtractor={query => query.label}
            style={styles.conditionButton}
          />
          <View style={sharedStyles.spacer} />
          <IconButton
            icon="close-circle"
            onPress={() => removeConditionAtIndex(index)}
          />
        </View>
      ))}
      <Button
        icon="plus"
        mode="link"
        onPress={addCondition}
        style={sharedStyles.mt}
      >
        Add Filter
      </Button>
    </FormGroup>
  );
}

function ColumnSortOrder({board, attributes, updateAttribute}) {
  const elementClient = useElements();
  const {data: elements = []} = useQuery(['elements', board.id], () =>
    elementClient.related({parent: board}).then(resp => resp.data),
  );
  const fields = elements.filter(
    e => e.attributes['element-type'] === ELEMENT_TYPES.FIELD.key,
  );

  const sortDirectionOptions = Object.values(SORT_DIRECTIONS);

  return (
    <FormGroup title="Sort Order">
      <DropdownField
        fieldLabel="Sort Field"
        emptyLabel="(choose)"
        options={fields}
        value={fields.find(f => f.id === attributes['card-sort-order']?.field)}
        onValueChange={field =>
          updateAttribute('card-sort-order.field', field.id)
        }
        keyExtractor={field => field.id}
        labelExtractor={field => field.attributes.name}
        style={sharedStyles.mt}
      />
      <DropdownField
        fieldLabel="Sort Direction"
        emptyLabel="(choose)"
        options={sortDirectionOptions}
        value={sortDirectionOptions.find(
          direction =>
            direction.key === attributes['card-sort-order']?.direction,
        )}
        onValueChange={direction =>
          updateAttribute('card-sort-order.direction', direction.key)
        }
        keyExtractor={direction => direction.key}
        labelExtractor={direction => direction.label}
        style={sharedStyles.mt}
      />
    </FormGroup>
  );
}

function ColumnGrouping({board, attributes, updateAttribute}) {
  const elementClient = useElements();
  const {data: elements = []} = useQuery(['elements', board.id], () =>
    elementClient.related({parent: board}).then(resp => resp.data),
  );
  // TODO: pass fields in from parent
  const fields = elements.filter(
    e => e.attributes['element-type'] === ELEMENT_TYPES.FIELD.key,
  );

  const sortDirectionOptions = Object.values(SORT_DIRECTIONS);

  return (
    <FormGroup title="Grouping">
      <DropdownField
        fieldLabel="Group Field"
        emptyLabel="(choose)"
        options={fields}
        value={fields.find(f => f.id === attributes['card-grouping']?.field)}
        onValueChange={field =>
          updateAttribute('card-grouping.field', field.id)
        }
        keyExtractor={field => field.id}
        labelExtractor={field => field.attributes.name}
        style={sharedStyles.mt}
      />
      <DropdownField
        fieldLabel="Group Direction"
        emptyLabel="(choose)"
        options={sortDirectionOptions}
        value={sortDirectionOptions.find(
          direction => direction.key === attributes['card-grouping']?.direction,
        )}
        onValueChange={direction =>
          updateAttribute('card-grouping.direction', direction.key)
        }
        keyExtractor={direction => direction.key}
        labelExtractor={direction => direction.label}
        style={sharedStyles.mt}
      />
    </FormGroup>
  );
}

const styles = StyleSheet.create({
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  conditionButton: {
    marginRight: 8,
  },
});
