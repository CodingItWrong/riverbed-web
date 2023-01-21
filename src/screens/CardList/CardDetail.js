import {useQuery} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import COMMANDS from '../../commands';
import Button from '../../components/Button';
import ButtonElement from '../../components/ButtonElement';
import Card from '../../components/Card';
import Field from '../../components/Field';
import Text from '../../components/Text';
import {useElements} from '../../data/elements';
import ELEMENT_TYPES from '../../elementTypes';
import checkCondition from '../../utils/checkCondition';
import dateUtils from '../../utils/dateUtils';
import sortElements from '../../utils/sortElements';
import VALUES from '../../values';

export default function CardDetail({card, onUpdate, onCancel, onDelete}) {
  const [currentCardId, setCurrentCardId] = useState(null);
  const [fieldValues, setFieldValues] = useState(
    card.attributes['field-values'],
  );

  useEffect(() => {
    if (card.id !== currentCardId) {
      setCurrentCardId(card.id);
      setFieldValues(card.attributes['field-values']);
    }
  }, [currentCardId, card.id, card.attributes]);

  const elementClient = useElements();
  const {data: elements = []} = useQuery(['elements'], () =>
    elementClient.all().then(resp => resp.data),
  );

  const elementsToShow = sortElements(
    elements.filter(element =>
      checkCondition({
        card,
        condition: element.attributes['show-condition'],
      }),
    ),
  );

  function setFieldValue(fieldId, value) {
    setFieldValues(oldValues => ({...oldValues, [fieldId]: value}));
  }

  function handlePerformAction(action) {
    const {command, field, value} = action;

    switch (command) {
      case COMMANDS.SET_VALUE:
        let concreteValue;
        switch (value) {
          case VALUES.EMPTY:
            concreteValue = null;
            break;
          case VALUES.NOW:
            concreteValue = dateUtils.objectToServerString(new Date());
            break;
          default:
            console.error(`unknown value: ${value}`);
            return;
        }
        onUpdate({[field]: concreteValue});
        break;
      default:
        console.error(`unknown command: ${command}`);
    }
  }

  function handleSave() {
    onUpdate(fieldValues);
  }

  return (
    <Card key={card.id} style={styles.card}>
      {elementsToShow.map((element, elementIndex) => {
        switch (element.attributes['element-type']) {
          case ELEMENT_TYPES.field:
            return (
              <Field
                key={element.id}
                field={element}
                value={fieldValues[element.id]}
                setValue={value => setFieldValue(element.id, value)}
                readOnly={element.attributes['read-only']}
                style={elementIndex > 0 && styles.detailElement}
              />
            );
          case ELEMENT_TYPES.button:
            return (
              <ButtonElement
                key={element.id}
                element={element}
                onPerformAction={() =>
                  handlePerformAction(element.attributes.action)
                }
                style={elementIndex > 0 && styles.detailElement}
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
      <Button onPress={onCancel} style={styles.detailElement}>
        Cancel
      </Button>
      <Button onPress={onDelete} style={styles.detailElement}>
        Delete
      </Button>
      <Button primary onPress={handleSave} style={styles.detailElement}>
        Save
      </Button>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 4,
    marginTop: 8,
  },
  detailElement: {
    marginTop: 8,
  },
});
