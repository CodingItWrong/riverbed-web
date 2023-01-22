import {useQuery} from '@tanstack/react-query';
import {useState} from 'react';
import {StyleSheet} from 'react-native';
import Button from '../../components/Button';
import ButtonElement from '../../components/ButtonElement';
import Card from '../../components/Card';
import Field from '../../components/Field';
import Text from '../../components/Text';
import {useElements} from '../../data/elements';
import COMMANDS from '../../enums/commands';
import ELEMENT_TYPES from '../../enums/elementTypes';
import VALUES from '../../enums/values';
import checkCondition from '../../utils/checkCondition';
import sortElements from '../../utils/sortElements';

export default function CardDetail({card, onUpdate, onCancel, onDelete}) {
  const [fieldValues, setFieldValues] = useState(
    card.attributes['field-values'],
  );

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
    const valueObject = VALUES[value];

    switch (command) {
      case COMMANDS.SET_VALUE.key:
        if (valueObject) {
          const concreteValue = valueObject.call();
          onUpdate({...fieldValues, [field]: concreteValue});
        } else {
          console.error(`unknown value: ${value}`);
          return;
        }
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
          case ELEMENT_TYPES.FIELD.key:
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
          case ELEMENT_TYPES.BUTTON.key:
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
