import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Button from '../components/Button';
import Card from '../components/Card';
import FieldDisplay from '../components/FieldDisplay';
import FieldInput from '../components/FieldInput';
import ScreenBackground from '../components/ScreenBackground';
import {useCards} from '../data/cards';
import {useFields} from '../data/fields';

export default function CardList() {
  const queryClient = useQueryClient();
  const fieldClient = useFields();
  const cardClient = useCards();
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [fieldValues, setFieldValues] = useState(null);

  const {data: fields} = useQuery(['fields'], () => fieldClient.all());
  const {data: cards} = useQuery(['cards'], () => cardClient.all());

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

  if (!cards || !fields) {
    return null;
  }

  function showDetail(cardId) {
    setSelectedCardId(cardId);
    setFieldValues(
      cards.data.find(card => card.id === cardId).attributes['field-values'],
    );
  }

  function setFieldValue(name, value) {
    setFieldValues(oldValues => ({...oldValues, [name]: value}));
  }

  function hideDetail() {
    setSelectedCardId(null);
    setFieldValues(null);
  }

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.fullHeight}>
        <Button onPress={addCard}>Add Card</Button>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.fullHeight}
        >
          <FlatList
            data={cards.data}
            keyExtractor={card => card.id}
            renderItem={({item: card}) => {
              if (selectedCardId === card.id) {
                const fieldsToShow = fields.data;

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
                        setValue={value => setFieldValue(field.id, value)}
                      />
                    ))}
                  </Card>
                );
              } else {
                const fieldsToShow = fields.data.filter(
                  field => field.attributes['show-in-summary'],
                );

                return (
                  <Card key={card.id} onPress={() => showDetail(card.id)}>
                    {fieldsToShow.map(field => (
                      <FieldDisplay
                        key={field.id}
                        field={field}
                        value={card.attributes['field-values'][field.id]}
                      />
                    ))}
                  </Card>
                );
              }
            }}
          />
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
