import {useMutation, useQuery} from '@tanstack/react-query';
import {useState} from 'react';
import {StyleSheet, View} from 'react-native';
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
import checkConditions from '../../utils/checkConditions';
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
      checkConditions({
        card,
        conditions: [element.attributes['show-condition']],
      }),
    ),
  );

  function setFieldValue(fieldId, value) {
    setFieldValues(oldValues => ({...oldValues, [fieldId]: value}));
  }

  function handlePerformAction(action) {
    const {command, field, value} = action;
    const valueObject = VALUES[value];

    const fieldObject = elements.find(element => element.id === field);

    switch (command) {
      case COMMANDS.SET_VALUE.key:
        if (valueObject) {
          const concreteValue = valueObject.call(
            fieldObject.attributes['data-type'],
          );
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

  const {mutate: updateCard, isLoading: isUpdating} = useMutation({
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

  const {mutate: deleteCard, isLoading: isDeleting} = useMutation({
    mutationFn: () => cardClient.delete({id: card.id}),
    onSuccess: onChange,
  });

  const isLoading = isUpdating || isDeleting;

  return (
    <Card key={card.id} style={[styles.card, style]}>
      {elementsToShow.map((element, elementIndex) => {
        switch (element.attributes['element-type']) {
          case ELEMENT_TYPES.FIELD.key:
            return (
              <View key={element.id} testID={`element-${element.id}`}>
                <Field
                  field={element}
                  value={fieldValues[element.id]}
                  setValue={value => setFieldValue(element.id, value)}
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
                disabled={isLoading}
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
      <Button onPress={onCancel} disabled={isLoading} style={sharedStyles.mt}>
        Cancel
      </Button>
      <Button onPress={deleteCard} disabled={isLoading} style={sharedStyles.mt}>
        Delete
      </Button>
      <Button
        mode="primary"
        onPress={() => updateCard()}
        disabled={isLoading}
        style={sharedStyles.mt}
      >
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
