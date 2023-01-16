import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import COMMANDS from '../commands';
import Button from '../components/Button';
import ButtonElement from '../components/ButtonElement';
import Card from '../components/Card';
import FieldDisplay from '../components/FieldDisplay';
import FieldInput from '../components/FieldInput';
import ScreenBackground from '../components/ScreenBackground';
import Text from '../components/Text';
import {useCards} from '../data/cards';
import {useColumns} from '../data/columns';
import {useElements} from '../data/elements';
import ELEMENT_TYPES from '../elementTypes';
import QUERIES from '../queries';
import dateUtils from '../utils/dateUtils';
import VALUES from '../values';

export default function CardList() {
  const queryClient = useQueryClient();
  const elementClient = useElements();
  const columnClient = useColumns();
  const cardClient = useCards();
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [fieldValues, setFieldValues] = useState(null);

  const {data: elements = []} = useQuery(['elements'], () =>
    elementClient.all().then(resp => resp.data),
  );
  const {data: columns = []} = useQuery(['columns'], () =>
    columnClient.all().then(resp => resp.data),
  );
  const {data: cards = []} = useQuery(['cards'], () =>
    cardClient.all().then(resp => resp.data),
  );

  const refreshCards = () => queryClient.invalidateQueries(['cards']);

  const {mutate: addCard} = useMutation({
    mutationFn: () => cardClient.create({attributes: {}}),
    onSuccess: ({data: newCard}) => {
      setSelectedCardId(newCard.id);
      // TODO: remove duplication in having to remember to set field values
      setFieldValues(newCard.attributes['field-values']);
      refreshCards();
    },
  });

  const {mutate: updateCard} = useMutation({
    mutationFn: () => {
      const updatedCard = {
        type: 'cards',
        id: selectedCardId,
        attributes: {'field-values': fieldValues},
      };
      return cardClient.update(updatedCard);
    },
    onSuccess: () => {
      refreshCards();
      hideDetail();
    },
  });

  const {mutate: deleteCard} = useMutation({
    mutationFn: () => cardClient.delete({id: selectedCardId}),
    onSuccess: () => {
      refreshCards();
      hideDetail();
    },
  });

  function showDetail(cardId) {
    setSelectedCardId(cardId);
    setFieldValues(
      cards.find(card => card.id === cardId).attributes['field-values'],
    );
  }

  function setFieldValue(name, value) {
    setFieldValues(oldValues => ({...oldValues, [name]: value}));
  }

  function hideDetail() {
    setSelectedCardId(null);
    setFieldValues(null);
  }

  function handlePerformAction({card, action}) {
    const {command, field, value} = action;

    switch (command) {
      case COMMANDS.SET_VALUE:
        let concreteValue;
        switch (value) {
          case VALUES.NOW:
            concreteValue = dateUtils.objectToServerString(new Date());
            break;
          default:
            console.error(`unknown value: ${value}`);
            return;
        }
        setFieldValue(field, concreteValue);
        break;
      default:
        console.error(`unknown command: ${command}`);
    }
  }

  const {width: viewportWidth} = useWindowDimensions();
  const largeBreakpoint = 600;
  const responsiveColumnStyle = {
    width: viewportWidth > largeBreakpoint ? 400 : viewportWidth,
  };
  const responsiveButtonContainerStyle = {
    alignItems: viewportWidth > largeBreakpoint ? 'flex-start' : 'stretch',
  };

  if (!cards || !elements || !columns) {
    return null;
  }

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.fullHeight}>
        <View style={[styles.buttonContainer, responsiveButtonContainerStyle]}>
          <Button onPress={addCard}>Add Card</Button>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.fullHeight}
        >
          <ScrollView horizontal>
            {columns.map(column => {
              const {name, filter} = column.attributes;

              const columnCards = cards.filter(card => {
                const value = card.attributes['field-values'][filter.field];
                switch (filter.function) {
                  case QUERIES.IS_EMPTY:
                    return !value;
                  case QUERIES.IS_NOT_EMPTY:
                    return !!value;
                  default:
                    console.error(
                      `unrecognized user function for column filter: ${filter.function}`,
                    );
                }
              });

              return (
                <View
                  key={column.id}
                  testID={`column-${column.id}`}
                  style={responsiveColumnStyle}
                >
                  <Card mode="contained" style={styles.column} title={name}>
                    <Text variant="titleLarge">{name}</Text>
                    <FlatList
                      data={columnCards}
                      keyExtractor={card => card.id}
                      renderItem={({item: card}) => {
                        if (selectedCardId === card.id) {
                          const elementsToShow = elements;

                          return (
                            <Card
                              key={card.id}
                              style={styles.card}
                              buttons={
                                <>
                                  <Button
                                    onPress={hideDetail}
                                    style={styles.button}
                                  >
                                    Close
                                  </Button>
                                  <Button
                                    onPress={deleteCard}
                                    style={styles.button}
                                  >
                                    Delete
                                  </Button>
                                  <Button
                                    primary
                                    onPress={updateCard}
                                    style={styles.button}
                                  >
                                    Save
                                  </Button>
                                </>
                              }
                            >
                              {elementsToShow.map(element => {
                                switch (element.attributes['element-type']) {
                                  case ELEMENT_TYPES.field:
                                    return (
                                      <FieldInput
                                        key={element.id}
                                        field={element}
                                        value={fieldValues[element.id]}
                                        setValue={value =>
                                          setFieldValue(element.id, value)
                                        }
                                      />
                                    );
                                  case ELEMENT_TYPES.button:
                                    return (
                                      <ButtonElement
                                        key={element.id}
                                        element={element}
                                        onPerformAction={() =>
                                          handlePerformAction({
                                            card,
                                            action: element.attributes.action,
                                          })
                                        }
                                      />
                                    );
                                  default:
                                    return (
                                      <Text>
                                        unknown element type:{' '}
                                        {element.attributes['element-type']}
                                      </Text>
                                    );
                                }
                              })}
                            </Card>
                          );
                        } else {
                          const fieldsToShow = elements.filter(
                            field => field.attributes['show-in-summary'],
                          );

                          return (
                            <Card
                              key={card.id}
                              style={styles.card}
                              onPress={() => showDetail(card.id)}
                            >
                              {fieldsToShow.map(field => (
                                <FieldDisplay
                                  key={field.id}
                                  field={field}
                                  value={
                                    card.attributes['field-values'][field.id]
                                  }
                                />
                              ))}
                            </Card>
                          );
                        }
                      }}
                    />
                  </Card>
                </View>
              );
            })}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  fullHeight: {
    flex: 1,
  },
  buttonContainer: {
    margin: 8,
  },
  column: {
    marginHorizontal: 8,
    marginBottom: 8,
  },
  card: {
    margin: 4,
    marginTop: 8,
  },
  button: {
    marginLeft: 8,
  },
});
