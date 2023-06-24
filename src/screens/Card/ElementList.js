import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import {useNavigate} from 'react-router-dom';
import Button from '../../components/Button';
import DropdownMenu from '../../components/DropdownMenu';
import ErrorSnackbar from '../../components/ErrorSnackbar';
import Field from '../../components/Field';
import Icon from '../../components/Icon';
import IconButton from '../../components/IconButton';
import Stack from '../../components/Stack';
import Text from '../../components/Text';
import sharedStyles from '../../components/sharedStyles';
import {
  useBoardElements,
  useCreateElement,
  useUpdateElementDisplayOrders,
} from '../../data/elements';
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

  const {mutate: updateElementDisplayOrders} =
    useUpdateElementDisplayOrders(board);

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    const updatedElements = [...sortedElements];
    const elementToMove = updatedElements[result.source.index];
    updatedElements.splice(result.source.index, 1);
    updatedElements.splice(result.destination.index, 0, elementToMove);

    updateElementDisplayOrders(updatedElements);
  }

  return (
    <Stack spacing={1}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {provided => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <Stack spacing={1}>
                {sortedElements.map((element, index) => (
                  <Draggable
                    key={element.id}
                    draggableId={element.id}
                    index={index}
                  >
                    {provided => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <EditableElement
                          key={element.id}
                          element={element}
                          onEdit={() => editElement(element)}
                          testID={`element-${element.id}`}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
              </Stack>
            </div>
          )}
        </Droppable>
      </DragDropContext>
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
      <Icon name="drag-handle" />
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
