import {useNavigation} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Button from '../../components/Button';
import DropdownMenu from '../../components/DropdownMenu';
import ErrorSnackbar from '../../components/ErrorSnackbar';
import Field from '../../components/Field';
import IconButton from '../../components/IconButton';
import Text from '../../components/Text';
import sharedStyles from '../../components/sharedStyles';
import {useBoardElements, useCreateElement} from '../../data/elements';
import ELEMENT_TYPES from '../../enums/elementTypes';
import FIELD_DATA_TYPES from '../../enums/fieldDataTypes';
import sortByDisplayOrder from '../../utils/sortByDisplayOrder';

export default function ElementList({board}) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const {data: elements = []} = useBoardElements(board);
  const sortedElements = sortByDisplayOrder(elements);

  const {
    mutate: createElement,
    isLoading: isAdding,
    error: createElementError,
  } = useCreateElement(board);
  const handleCreateElement = attributes =>
    createElement(attributes, {
      onSuccess: newElement => editElement(newElement),
    });

  const addField = () =>
    handleCreateElement({
      'element-type': ELEMENT_TYPES.FIELD.key,
      'data-type': FIELD_DATA_TYPES.TEXT.key,
    });

  const addButton = () =>
    handleCreateElement({'element-type': ELEMENT_TYPES.BUTTON.key});

  const addButtonMenu = () =>
    handleCreateElement({'element-type': ELEMENT_TYPES.BUTTON_MENU.key});

  function editElement(element) {
    navigation.navigate('Element', {elementId: element.id});
  }

  return (
    <View style={[sharedStyles.fullHeight]}>
      <KeyboardAwareFlatList
        extraScrollHeight={EXPERIMENTAL_EXTRA_SCROLL_HEIGHT}
        data={sortedElements}
        keyExtractor={element => element.id}
        contentContainerStyle={{paddingBottom: insets.bottom}}
        scrollIndicatorInsets={{bottom: insets.bottom}}
        renderItem={({item: element, index: elementIndex}) => (
          <EditableElement
            element={element}
            onEdit={() => editElement(element)}
            testID={`element-${element.id}`}
            style={elementIndex > 0 && sharedStyles.mt}
          />
        )}
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
                Add Element
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
      <ErrorSnackbar error={createElementError}>
        An error occurred adding an element.
      </ErrorSnackbar>
    </View>
  );
}

const EXPERIMENTAL_EXTRA_SCROLL_HEIGHT = 120;

function EditableElement({element, onEdit, testID, style}) {
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
    <View style={[sharedStyles.row, style]} testID={testID}>
      <View style={sharedStyles.fill}>{disabledElement()}</View>
      <IconButton
        icon="pencil"
        accessibilityLabel={`Edit ${name} ${elementTypeObject.label}`}
        onPress={onEdit}
        style={styles.editIcon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  editIcon: {
    marginVertical: 0,
  },
});
