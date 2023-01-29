import {useMutation, useQuery} from '@tanstack/react-query';
import {useState} from 'react';
import {StyleSheet} from 'react-native';
import Button from '../../components/Button';
import ButtonElement from '../../components/ButtonElement';
import Card from '../../components/Card';
import Field from '../../components/Field';
import Text from '../../components/Text';
import sharedStyles from '../../components/sharedStyles';
import {useCards} from '../../data/cards';
import {useElements} from '../../data/elements';
import COMMANDS from '../../enums/commands';
import ELEMENT_TYPES from '../../enums/elementTypes';
import VALUES from '../../enums/values';
import checkCondition from '../../utils/checkCondition';
import sortElements from '../../utils/sortElements';

export default function CardDetail({card, board, onChange, onCancel, style}) {
  const cardClient = useCards();
  const [fieldValues, setFieldValues] = useState(
    card.attributes['field-values'],
  );

  const elementClient = useElements();
  const {data: elements = []} = useQuery(['elements', board.id], () =>
    elementClient.related({parent: board}).then(resp => resp.data),
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
          updateCard({[field]: concreteValue});
        } else {
          console.error(`unknown value: ${value}`);
          return;
        }
        break;
      default:
        console.error(`unknown command: ${command}`);
    }
  }

  const {mutate: updateCard} = useMutation({
    mutationFn: fieldOverrides => {
      const fieldValuesToUse = {...fieldValues, ...fieldOverrides};
      const updatedCard = {
        type: 'cards',
        id: card.id,
        attributes: {'field-values': fieldValuesToUse},
      };
      return cardClient.update(updatedCard);
    },
    onSuccess: onChange,
  });

  const {mutate: deleteCard} = useMutation({
    mutationFn: () => cardClient.delete({id: card.id}),
    onSuccess: onChange,
  });

  return (
    <Card key={card.id} style={[styles.card, style]}>
      {elementsToShow.map((element, elementIndex) => {
        switch (element.attributes['element-type']) {
          case ELEMENT_TYPES.FIELD:
            return (
              <Field
                key={element.id}
                field={element}
                value={fieldValues[element.id]}
                setValue={value => setFieldValue(element.id, value)}
                readOnly={element.attributes['read-only']}
                style={elementIndex > 0 && sharedStyles.mt}
              />
            );
          case ELEMENT_TYPES.BUTTON:
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
          default:
            return (
              <Text>
                unknown element type: {element.attributes['element-type']}
              </Text>
            );
        }
      })}
      <Button onPress={onCancel} style={sharedStyles.mt}>
        Cancel
      </Button>
      <Button onPress={deleteCard} style={sharedStyles.mt}>
        Delete
      </Button>
      <Button primary onPress={() => updateCard()} style={sharedStyles.mt}>
        Save
      </Button>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 4,
  },
});
