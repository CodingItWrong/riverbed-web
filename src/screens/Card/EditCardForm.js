import {useState} from 'react';
import {View} from 'react-native';
import ButtonElement from '../../components/ButtonElement';
import ButtonMenuElement from '../../components/ButtonMenuElement';
import ErrorMessage from '../../components/ErrorMessage';
import Field from '../../components/Field';
import Text from '../../components/Text';
import sharedStyles from '../../components/sharedStyles';
import {useUpdateCard} from '../../data/cards';
import {useBoardElements} from '../../data/elements';
import COMMANDS from '../../enums/commands';
import ELEMENT_TYPES from '../../enums/elementTypes';
import VALUES from '../../enums/values';
import checkConditions from '../../utils/checkConditions';
import dateUtils from '../../utils/dateUtils';
import sortByDisplayOrder from '../../utils/sortByDisplayOrder';

export default function EditCardForm({card, board, onClose}) {
  const [isChanged, setIsChanged] = useState(false);
  const [fieldValues, setFieldValues] = useState(
    card.attributes['field-values'],
  );

  const {data: elements = []} = useBoardElements(board);

  const elementsToShow = sortByDisplayOrder(
    elements.filter(element =>
      checkConditions({
        card,
        conditions: [element.attributes['show-condition']],
        elements,
      }),
    ),
  );

  function setFieldValue(fieldId, value) {
    setFieldValues(oldValues => ({...oldValues, [fieldId]: value}));
    setIsChanged(true);
  }

  function handlePerformAction(action) {
    const {command, field, value} = action;

    const fieldObject = elements.find(element => element.id === field);

    switch (command) {
      case COMMANDS.SET_VALUE.key:
        const valueObject = Object.values(VALUES).find(v => v.key === value);
        if (valueObject) {
          const concreteValue = valueObject.call(
            fieldObject.attributes['data-type'],
          );
          setFieldValue(field, concreteValue);
          handleUpdateCard({[field]: concreteValue});
        } else {
          console.error(`unknown value: ${value}`);
          return;
        }
        break;
      case COMMANDS.ADD_DAYS.key:
        // TODO: handle datetime
        function getStartDate() {
          const now = new Date();
          const fieldDate = dateUtils.serverStringToObject(fieldValues[field]);
          if (fieldDate && fieldDate >= now) {
            return fieldDate;
          } else {
            return now;
          }
        }
        const startDate = getStartDate();
        const updatedDate = dateUtils.addDays(startDate, Number(value));
        const concreteValue = dateUtils.objectToServerString(updatedDate);
        setFieldValue(field, concreteValue);
        handleUpdateCard({[field]: concreteValue});
        break;
      default:
        console.error(`unknown command: ${command}`);
    }
  }

  function handleBlur() {
    if (isChanged) {
      handleUpdateCard();
      setIsChanged(false);
    }
  }

  const {mutate: updateCard, isError: isUpdateError} = useUpdateCard(
    card,
    board,
  );
  const handleUpdateCard = fieldOverrides => {
    const fieldValuesToUse = {...fieldValues, ...fieldOverrides};
    return updateCard({'field-values': fieldValuesToUse});
  };

  function getErrorMessage() {
    if (isUpdateError) {
      return 'An error occurred while saving the card';
    }
  }

  return (
    <View>
      <ErrorMessage>{getErrorMessage()}</ErrorMessage>
      {elementsToShow.map((element, elementIndex) => {
        switch (element.attributes['element-type']) {
          case ELEMENT_TYPES.FIELD.key:
            return (
              <View key={element.id} testID={`element-${element.id}`}>
                <Field
                  field={element}
                  value={fieldValues[element.id]}
                  setValue={value => setFieldValue(element.id, value)}
                  onBlur={handleBlur}
                  readOnly={element.attributes['read-only']}
                  style={elementIndex > 0 && sharedStyles.mt}
                />
              </View>
            );
          case ELEMENT_TYPES.BUTTON.key:
            return (
              <ButtonElement
                key={element.id}
                element={element}
                onPerformAction={() =>
                  handlePerformAction(element.attributes.action)
                }
                style={elementIndex > 0 && sharedStyles.mt}
              />
            );
          case ELEMENT_TYPES.BUTTON_MENU.key:
            return (
              <ButtonMenuElement
                key={element.id}
                element={element}
                onPerformActionForItem={menuItem =>
                  handlePerformAction(menuItem.action)
                }
                style={elementIndex > 0 && sharedStyles.mt}
              />
            );
          default:
            return (
              <Text>
                unknown element type: {element.attributes['element-type']}
              </Text>
            );
        }
      })}
    </View>
  );
}
