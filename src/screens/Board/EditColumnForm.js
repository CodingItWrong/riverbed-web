import {useMutation, useQuery} from '@tanstack/react-query';
import set from 'lodash.set';
import {useState} from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Dropdown from '../../components/DropdownField';
import Text from '../../components/Text';
import TextField from '../../components/TextField';
import sharedStyles from '../../components/sharedStyles';
import {useColumns} from '../../data/columns';
import {useElements} from '../../data/elements';
import ELEMENT_TYPES from '../../enums/elementTypes';
import QUERIES from '../../enums/queries';
import SORT_DIRECTIONS from '../../enums/sortDirections';

export default function EditColumnForm({column, board, onChange, onCancel}) {
  const columnClient = useColumns();
  const [attributes, setAttributes] = useState(column.attributes);

  function updateAttribute(path, value) {
    setAttributes(oldAttributes => {
      const newAttributes = {...oldAttributes};
      set(newAttributes, path, value);
      return newAttributes;
    });
  }

  const {mutate: updateColumn} = useMutation({
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

  const {mutate: deleteColumn} = useMutation({
    mutationFn: () => columnClient.delete({id: column.id}),
    onSuccess: onChange,
  });

  return (
    <Card>
      <TextField
        label="Column Name"
        value={attributes.name ?? ''}
        onChangeText={value => updateAttribute('name', value)}
        testID="text-input-column-name"
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
      <Button onPress={onCancel} style={sharedStyles.mt}>
        Cancel
      </Button>
      <Button onPress={deleteColumn} style={sharedStyles.mt}>
        Delete Column
      </Button>
      <Button primary onPress={updateColumn} style={sharedStyles.mt}>
        Save Column
      </Button>
    </Card>
  );
}

function CardInclusionCondition({board, attributes, updateAttribute}) {
  // TODO: extract custom hook
  const elementClient = useElements();
  const {data: elements = []} = useQuery(['elements', board.id], () =>
    elementClient.related({parent: board}).then(resp => resp.data),
  );
  const fields = elements.filter(
    e => e.attributes['element-type'] === ELEMENT_TYPES.FIELD,
  );

  const queryOptions = Object.values(QUERIES);

  return (
    <Card style={sharedStyles.mt}>
      <Text>Cards to Include</Text>
      <Dropdown
        fieldLabel="Show Query"
        emptyLabel="(choose)"
        options={queryOptions}
        value={queryOptions.find(
          query => query.key === attributes['card-inclusion-condition']?.query,
        )}
        onValueChange={query =>
          updateAttribute('card-inclusion-condition.query', query.key)
        }
        keyExtractor={query => query.key}
        labelExtractor={query => query.label}
        style={sharedStyles.mt}
      />
      <Dropdown
        fieldLabel="Query Field"
        emptyLabel="(choose)"
        options={fields}
        value={fields.find(
          f => f.id === attributes['card-inclusion-condition']?.field,
        )}
        onValueChange={field =>
          updateAttribute('card-inclusion-condition.field', field.id)
        }
        keyExtractor={field => field.id}
        labelExtractor={field => field.attributes.name}
        style={sharedStyles.mt}
      />
    </Card>
  );
}

function ColumnSortOrder({board, attributes, updateAttribute}) {
  const elementClient = useElements();
  const {data: elements = []} = useQuery(['elements', board.id], () =>
    elementClient.related({parent: board}).then(resp => resp.data),
  );
  const fields = elements.filter(
    e => e.attributes['element-type'] === ELEMENT_TYPES.FIELD,
  );

  const sortDirectionOptions = Object.values(SORT_DIRECTIONS);

  return (
    <Card style={sharedStyles.mt}>
      <Text>Sort Order</Text>
      <Dropdown
        fieldLabel="Sort Field"
        emptyLabel="(choose)"
        options={fields}
        value={fields.find(f => f.id === attributes['card-sort-order']?.field)}
        onValueChange={field =>
          updateAttribute('card-sort-order.field', field.id)
        }
        keyExtractor={field => field.id}
        labelExtractor={field => `By ${field.attributes.name}`}
        style={sharedStyles.mt}
      />
      <Dropdown
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
    </Card>
  );
}
