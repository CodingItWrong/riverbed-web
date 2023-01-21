import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import {FlatList, View} from 'react-native';
import Button from '../../components/Button';
import sharedStyles from '../../components/sharedStyles';
import {useElements} from '../../data/elements';
import ELEMENT_TYPES from '../../enums/elementTypes';
import FIELD_DATA_TYPES from '../../enums/fieldDataTypes';
import EditElementForm from './EditElementForm';

export default function ElementList() {
  const queryClient = useQueryClient();
  const elementClient = useElements();
  const [selectedElementId, setSelectedElementId] = useState(null);

  const {data: elements = []} = useQuery(['elements'], () =>
    elementClient.all().then(resp => resp.data),
  );

  const refreshElements = () => queryClient.invalidateQueries(['elements']);

  const {mutate: addElement} = useMutation({
    mutationFn: attributes => elementClient.create({attributes}),
    onSuccess: newElement => {
      setSelectedElementId(newElement.data.id);
      refreshElements();
    },
  });

  const addField = () =>
    addElement({
      'element-type': ELEMENT_TYPES.field,
      'data-type': FIELD_DATA_TYPES.text,
    });

  const addButton = () => addElement({'element-type': ELEMENT_TYPES.button});

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
      <Button onPress={addField}>Add Field</Button>
      <Button onPress={addButton}>Add Button</Button>
      <FlatList
        data={elements}
        keyExtractor={element => element.id}
        renderItem={({item: element}) =>
          selectedElementId === element.id ? (
            <EditElementForm
              element={element}
              onSave={updateElement}
              onDelete={deleteElement}
              onCancel={hideEditForm}
            />
          ) : (
            <Button onPress={() => setSelectedElementId(element.id)}>
              {element.attributes.name}
            </Button>
          )
        }
      />
    </View>
  );
}
