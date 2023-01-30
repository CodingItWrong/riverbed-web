import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import {View} from 'react-native';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import Button from '../../components/Button';
import Card from '../../components/Card';
import DropdownMenu from '../../components/DropdownMenu';
import Text from '../../components/Text';
import sharedStyles, {useColumnStyle} from '../../components/sharedStyles';
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

  const {mutate: addElement, isLoading: isAdding} = useMutation({
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

  function onChange() {
    hideEditForm();
    refreshElements();
  }

  function hideEditForm() {
    setSelectedElementId(null);
  }

  const columnStyle = useColumnStyle();

  return (
    <View style={[columnStyle, sharedStyles.fullHeight]}>
      <Button onPress={onClose} style={sharedStyles.mt}>
        Done Editing Elements
      </Button>
      <Card>
        <KeyboardAwareFlatList
          extraScrollHeight={EXPERIMENTAL_EXTRA_SCROLL_HEIGHT}
          data={elements}
          keyExtractor={element => element.id}
          renderItem={({item: element}) =>
            selectedElementId === element.id ? (
              <EditElementForm
                element={element}
                board={board}
                onSave={onChange}
                onDelete={onChange}
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
          ListFooterComponent={
            <DropdownMenu
              menuButton={props => (
                <Button
                  icon="plus"
                  mode="link"
                  disabled={isAdding}
                  style={sharedStyles.mt}
                  {...props}
                >
                  Add
                </Button>
              )}
              menuItems={[
                {title: 'Field', onPress: addField},
                {title: 'Button', onPress: addButton},
              ]}
            />
          }
        />
      </Card>
    </View>
  );
}

const EXPERIMENTAL_EXTRA_SCROLL_HEIGHT = 120;
