import set from 'lodash.set';
import {useState} from 'react';
import Button from '../../components/Button';
import ConditionInputs from '../../components/ConditionsInputs';
import DropdownField from '../../components/DropdownField';
import ErrorMessage from '../../components/ErrorMessage';
import FormGroup from '../../components/FormGroup';
import NumberField from '../../components/NumberField';
import TextField from '../../components/TextField';
import sharedStyles from '../../components/sharedStyles';
import {useDeleteColumn, useUpdateColumn} from '../../data/columns';
import {useBoardElements} from '../../data/elements';
import ELEMENT_TYPES from '../../enums/elementTypes';
import SORT_DIRECTIONS from '../../enums/sortDirections';
import SUMMARY_FUNCTIONS from '../../enums/summaryFunctions';
import sortByDisplayOrder from '../../utils/sortByDisplayOrder';

export default function EditColumnForm({column, board, onChange, onCancel}) {
  const [attributes, setAttributes] = useState(column.attributes);

  const {data: elements = []} = useBoardElements(board);
  const fields = sortByDisplayOrder(
    elements.filter(
      e => e.attributes['element-type'] === ELEMENT_TYPES.FIELD.key,
    ),
  );

  function updateAttribute(path, value) {
    setAttributes(oldAttributes => {
      const newAttributes = {...oldAttributes};
      set(newAttributes, path, value);
      return newAttributes;
    });
  }

  const {
    mutate: updateColumn,
    isLoading: isSaving,
    isError: isUpdateError,
  } = useUpdateColumn(column, board);
  const handleUpdateColumn = () =>
    updateColumn(attributes, {onSuccess: onChange});

  const {
    mutate: deleteColumn,
    isLoading: isDeleting,
    isError: isDeleteError,
  } = useDeleteColumn(column, board);
  const handleDeleteColumn = () => deleteColumn(null, {onSuccess: onChange});

  const isLoading = isSaving || isDeleting;

  function getErrorMessage() {
    if (isUpdateError) {
      return 'An error occurred while saving the column';
    } else if (isDeleteError) {
      return 'An error occurred while deleting the column';
    }
  }

  return (
    <div style={sharedStyles.column}>
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
          updateAttribute('display-order', value === '' ? null : Number(value))
        }
        testID="number-input-order"
      />
      <CardInclusionCondition
        board={board}
        fields={fields}
        attributes={attributes}
        updateAttribute={updateAttribute}
      />
      <ColumnSortOrder
        board={board}
        fields={fields}
        attributes={attributes}
        updateAttribute={updateAttribute}
      />
      <ColumnGrouping
        board={board}
        fields={fields}
        attributes={attributes}
        updateAttribute={updateAttribute}
      />
      <ColumnSummary
        board={board}
        fields={fields}
        attributes={attributes}
        updateAttribute={updateAttribute}
      />
      <ErrorMessage>{getErrorMessage()}</ErrorMessage>
      <Button onPress={onCancel} disabled={isLoading} style={sharedStyles.mt}>
        Cancel
      </Button>
      <Button
        onPress={handleDeleteColumn}
        disabled={isLoading}
        style={sharedStyles.mt}
      >
        Delete Column
      </Button>
      <Button
        mode="primary"
        onPress={handleUpdateColumn}
        disabled={isLoading}
        style={sharedStyles.mt}
      >
        Save Column
      </Button>
    </div>
  );
}

function CardInclusionCondition({fields, attributes, updateAttribute}) {
  function updateConditionsPath(path, value) {
    updateAttribute(`card-inclusion-conditions${path}`, value);
  }

  return (
    <FormGroup title="Cards to Include">
      <ConditionInputs
        conditions={attributes['card-inclusion-conditions']}
        updateConditionsPath={updateConditionsPath}
        fields={fields}
      />
    </FormGroup>
  );
}

function ColumnSortOrder({board, fields, attributes, updateAttribute}) {
  const sortDirectionOptions = Object.values(SORT_DIRECTIONS);

  return (
    <FormGroup title="Sort Order">
      <DropdownField
        fieldLabel="Sort Field"
        emptyLabel="(choose)"
        options={fields}
        value={fields.find(f => f.id === attributes['card-sort-order']?.field)}
        onValueChange={field =>
          updateAttribute('card-sort-order.field', field?.id)
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
          updateAttribute('card-sort-order.direction', direction?.key)
        }
        keyExtractor={direction => direction.key}
        labelExtractor={direction => direction.label}
        style={sharedStyles.mt}
      />
    </FormGroup>
  );
}

function ColumnGrouping({board, fields, attributes, updateAttribute}) {
  const sortDirectionOptions = Object.values(SORT_DIRECTIONS);

  return (
    <FormGroup title="Grouping">
      <DropdownField
        fieldLabel="Group Field"
        emptyLabel="(choose)"
        options={fields}
        value={fields.find(f => f.id === attributes['card-grouping']?.field)}
        onValueChange={field =>
          updateAttribute('card-grouping.field', field?.id)
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
          updateAttribute('card-grouping.direction', direction?.key)
        }
        keyExtractor={direction => direction.key}
        labelExtractor={direction => direction.label}
        style={sharedStyles.mt}
      />
    </FormGroup>
  );
}

function ColumnSummary({board, fields, attributes, updateAttribute}) {
  const summaryFunctionOptions = Object.values(SUMMARY_FUNCTIONS);

  return (
    <FormGroup title="Summary">
      <DropdownField
        fieldLabel="Summary Function"
        emptyLabel="(choose)"
        options={summaryFunctionOptions}
        value={summaryFunctionOptions.find(
          o => o.key === attributes.summary?.function,
        )}
        onValueChange={o => updateAttribute('summary.function', o?.key)}
        keyExtractor={o => o.key}
        labelExtractor={o => o.label}
        style={sharedStyles.mt}
      />
      {attributes.summary?.function === SUMMARY_FUNCTIONS.SUM.key && (
        <DropdownField
          fieldLabel="Summary Field"
          emptyLabel="(choose)"
          options={fields}
          value={fields.find(f => f.id === attributes.summary?.options?.field)}
          onValueChange={field =>
            updateAttribute('summary.options.field', field?.id)
          }
          keyExtractor={field => field.id}
          labelExtractor={field => field.attributes.name}
          style={sharedStyles.mt}
        />
      )}
    </FormGroup>
  );
}
