import {useNavigate} from 'react-router-dom';
import Button from '../../components/Button';
import DropdownMenu from '../../components/DropdownMenu';
import ErrorSnackbar from '../../components/ErrorSnackbar';
import Field from '../../components/Field';
import IconButton from '../../components/IconButton';
import Stack from '../../components/Stack';
import Text from '../../components/Text';
import sharedStyles from '../../components/sharedStyles';
import {useBoardElements, useCreateElement} from '../../data/elements';
import ELEMENT_TYPES from '../../enums/elementTypes';
import FIELD_DATA_TYPES from '../../enums/fieldDataTypes';
import sortByDisplayOrder from '../../utils/sortByDisplayOrder';

export default function ElementList({board, card}) {
  const navigate = useNavigate();

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
    navigate(`/boards/${board.id}/cards/${card.id}/elements/${element.id}`);
  }

  return (
    <Stack spacing={1}>
      {sortedElements.map((element, elementIndex) => (
        <EditableElement
          key={element.id}
          element={element}
          onEdit={() => editElement(element)}
          testID={`element-${element.id}`}
        />
      ))}
      <DropdownMenu
        menuButton={props => (
          <Button icon="plus" mode="link" disabled={isAdding} {...props}>
            Add Element
          </Button>
        )}
        menuItems={[
          {title: 'Field', onPress: addField},
          {title: 'Button', onPress: addButton},
          {title: 'Button Menu', onPress: addButtonMenu},
        ]}
      />
      <ErrorSnackbar error={createElementError}>
        An error occurred adding an element.
      </ErrorSnackbar>
    </Stack>
  );
}

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
        return <Text size={4}>Unknown element type: {elementType}</Text>;
    }
  }

  // TODO: don't assume label and key are the same

  return (
    <div
      style={{...sharedStyles.row, ...styles.editRow, ...style}}
      data-testid={testID}
    >
      <div style={sharedStyles.fill}>{disabledElement()}</div>
      <IconButton
        icon="pencil"
        accessibilityLabel={`Edit ${name} ${elementTypeObject.label}`}
        onPress={onEdit}
        style={styles.editIcon}
      />
    </div>
  );
}

const styles = {
  editRow: {
    display: 'flex',
  },
  editIcon: {
    marginVertical: 0,
  },
};
