import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Button from '../components/Button';
import Card from '../components/Card';
import FieldDisplay from '../components/FieldDisplay';
import FieldInput from '../components/FieldInput';
import ScreenBackground from '../components/ScreenBackground';
import {useCards} from '../data/cards';
import {useColumns} from '../data/columns';
import {useFields} from '../data/fields';
import USER_FUNCTIONS from '../userFunctions';

export default function CardList() {
  const queryClient = useQueryClient();
  const fieldClient = useFields();
  const columnClient = useColumns();
  const cardClient = useCards();
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [fieldValues, setFieldValues] = useState(null);

  const {data: fields = []} = useQuery(['fields'], () =>
    fieldClient.all().then(resp => resp.data),
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

  const {width: viewportWidth} = useWindowDimensions();
  const columnWidth = viewportWidth > 600 ? 400 : viewportWidth;
  const columnStyle = {width: columnWidth};

  if (!cards || !fields) {
    return null;
  }

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.fullHeight}>
        <Button onPress={addCard}>Add Card</Button>
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
                  case USER_FUNCTIONS.IS_EMPTY:
                    return !!value;
                  case USER_FUNCTIONS.IS_NOT_EMPTY:
                    return !value;
                  default:
                    console.error(
                      `unrecognized user function for column filter: ${filter.function}`,
                    );
                }
              });

              return (
                <View key={column.id} style={columnStyle}>
                  <Text>{name}</Text>
                  <FlatList
                    data={columnCards}
                    keyExtractor={card => card.id}
                    renderItem={({item: card}) => {
                      if (selectedCardId === card.id) {
                        const fieldsToShow = fields;

                        return (
                          <Card
                            key={card.id}
                            buttons={
                              <>
                                <Button onPress={hideDetail}>Close</Button>
                                <Button onPress={deleteCard}>Delete</Button>
                                <Button primary onPress={updateCard}>
                                  Save
                                </Button>
                              </>
                            }
                          >
                            {fieldsToShow.map(field => (
                              <FieldInput
                                key={field.id}
                                field={field}
                                value={fieldValues[field.id]}
                                setValue={value =>
                                  setFieldValue(field.id, value)
                                }
                              />
                            ))}
                          </Card>
                        );
                      } else {
                        const fieldsToShow = fields.filter(
                          field => field.attributes['show-in-summary'],
                        );

                        return (
                          <Card
                            key={card.id}
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
});
