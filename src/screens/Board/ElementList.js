import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import {FlatList, View} from 'react-native';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Text from '../../components/Text';
import sharedStyles from '../../components/sharedStyles';
import {useElements} from '../../data/elements';
import ELEMENT_TYPES from '../../enums/elementTypes';
import FIELD_DATA_TYPES from '../../enums/fieldDataTypes';
import EditElementForm from './EditElementForm';

export default function ElementList({board, onClose}) {
  const queryClient = useQueryClient();
  const elementClient = useElements();
  const [selectedElementId, setSelectedElementId] = useState(null);

  const {data: elements = []} = useQuery(['elements', board.id], () =>
    elementClient.related({parent: board}).then(resp => resp.data),
  );

  const refreshElements = () =>
    queryClient.invalidateQueries(['elements', board.id]);

  const {mutate: addElement} = useMutation({
    mutationFn: attributes =>
      elementClient.create({
        relationships: {board: {data: {type: 'boards', id: board.id}}},
        attributes,
      }),
    onSuccess: newElement => {
      setSelectedElementId(newElement.data.id);
      refreshElements();
    },
  });

  const addField = () =>
    addElement({
      'element-type': ELEMENT_TYPES.FIELD,
      'data-type': FIELD_DATA_TYPES.TEXT.key,
    });

  const addButton = () => addElement({'element-type': ELEMENT_TYPES.BUTTON});

  const {mutate: updateElement} = useMutation({
    mutationFn: elementAttributes => {
      const updatedElement = {
        type: 'elements',
        id: selectedElementId,
        attributes: elementAttributes,
      };
      return elementClient.update(updatedElement);
    },
    onSuccess: () => {
      hideEditForm();
      refreshElements();
    },
  });

  const {mutate: deleteElement} = useMutation({
    mutationFn: () => elementClient.delete({id: selectedElementId}),
    onSuccess: () => {
      refreshElements();
      hideEditForm();
    },
  });

  function hideEditForm() {
    setSelectedElementId(null);
  }

  return (
    <View style={sharedStyles.fullHeight}>
      <Button onPress={onClose} style={sharedStyles.mt}>
        Done Editing Elements
      </Button>
      <Button onPress={addField} style={sharedStyles.mt}>
        Add Field
      </Button>
      <Button onPress={addButton} style={sharedStyles.mt}>
        Add Button
      </Button>
      <FlatList
        data={elements}
        keyExtractor={element => element.id}
        renderItem={({item: element}) =>
          selectedElementId === element.id ? (
            <EditElementForm
              element={element}
              board={board}
              onSave={updateElement}
              onDelete={deleteElement}
              onCancel={hideEditForm}
              style={sharedStyles.mt}
            />
          ) : (
            <Card
              onPress={() => setSelectedElementId(element.id)}
              style={sharedStyles.mt}
            >
              <Text>{element.attributes.name}</Text>
            </Card>
          )
        }
      />
    </View>
  );
}
