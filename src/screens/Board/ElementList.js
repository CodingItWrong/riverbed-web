import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import {View} from 'react-native';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Button from '../../components/Button';
import DropdownMenu from '../../components/DropdownMenu';
import Field from '../../components/Field';
import IconButton from '../../components/IconButton';
import Text from '../../components/Text';
import sharedStyles, {useColumnStyle} from '../../components/sharedStyles';
import {useElements} from '../../data/elements';
import ELEMENT_TYPES from '../../enums/elementTypes';
import FIELD_DATA_TYPES from '../../enums/fieldDataTypes';
import sortElements from '../../utils/sortByDisplayOrder';
import EditElementForm from './EditElementForm';

export default function ElementList({board, onClose}) {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const elementClient = useElements();
  const [selectedElementId, setSelectedElementId] = useState(null);

  const {data: elements = []} = useQuery(['elements', board.id], () =>
    elementClient.related({parent: board}).then(resp => resp.data),
  );
  const sortedElements = sortElements(elements);

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
      'element-type': ELEMENT_TYPES.FIELD.key,
      'data-type': FIELD_DATA_TYPES.TEXT.key,
    });

  const addButton = () =>
    addElement({'element-type': ELEMENT_TYPES.BUTTON.key});

  const addButtonMenu = () =>
    addElement({'element-type': ELEMENT_TYPES.BUTTON_MENU.key});

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
      <KeyboardAwareFlatList
        extraScrollHeight={EXPERIMENTAL_EXTRA_SCROLL_HEIGHT}
        data={sortedElements}
        keyExtractor={element => element.id}
        contentContainerStyle={{paddingBottom: insets.bottom}}
        scrollIndicatorInsets={{bottom: insets.bottom}}
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
            <EditableElement
              element={element}
              onEdit={() => setSelectedElementId(element.id)}
              testID={`element-${element.id}`}
            />
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
              {title: 'Button Menu', onPress: addButtonMenu},
            ]}
          />
        }
      />
    </View>
  );
}

const EXPERIMENTAL_EXTRA_SCROLL_HEIGHT = 120;

function EditableElement({element, onEdit, testID}) {
  const {name, 'element-type': elementType} = element.attributes;
  const elementTypeObject = Object.values(ELEMENT_TYPES).find(
    et => et.key === elementType,
  );

  function disabledElement() {
    switch (elementType) {
      case ELEMENT_TYPES.BUTTON.key:
      case ELEMENT_TYPES.BUTTON_MENU.key: {
        return <Button disabled>{name}</Button>;
      }
      case ELEMENT_TYPES.FIELD.key: {
        return <Field field={element} disabled />;
      }
      default:
        return <Text>Unknown element type: {elementType}</Text>;
    }
  }

  // TODO: don't assume label and key are the same

  return (
    <View style={[sharedStyles.row, sharedStyles.mt]} testID={testID}>
      <View style={sharedStyles.fill}>{disabledElement()}</View>
      <IconButton
        icon="pencil"
        accessibilityLabel={`Edit ${name} ${elementTypeObject.label}`}
        onPress={onEdit}
      />
    </View>
  );
}
