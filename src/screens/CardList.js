import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import {FlatList, KeyboardAvoidingView, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import api from '../api';
import Button from '../components/Button';
import Card from '../components/Card';
import ScreenBackground from '../components/ScreenBackground';
import Text from '../components/Text';
import TextField from '../components/TextField';

export default function CardList() {
  const queryClient = useQueryClient();
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [fieldValues, setFieldValues] = useState(null);

  const {data: fields} = useQuery(['fields'], () => api.get('/fields'));
  const {data: cards} = useQuery(['cards'], () => api.get('/cards'));

  const refreshCards = () => queryClient.invalidateQueries(['cards']);

  const {mutate: addCard} = useMutation({
    mutationFn: () => api.post('/cards', {data: {type: 'cards'}}),
    onSuccess: response => {
      setSelectedCardId(response.data.id);
      // TODO: remove duplication in having to remember to set field values
      setFieldValues(response.data.attributes['field-values']);
      refreshCards();
    },
  });

  const {mutate: updateCard} = useMutation({
    mutationFn: () => {
      const cardUpdates = {
        type: 'cards',
        id: selectedCardId,
        attributes: {'field-values': fieldValues},
      };
      return api.patch(`/cards/${selectedCardId}`, {data: cardUpdates});
    },
    onSuccess: () => {
      refreshCards();
      hideDetail();
    },
  });

  const {mutate: deleteCard} = useMutation({
    mutationFn: () => api.delete(`/cards/${selectedCardId}`),
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
      <SafeAreaView>
        <Button onPress={addCard}>Add Card</Button>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
                      <TextField
                        key={field.id}
                        label={field.attributes.name}
                        testID={`text-input-${field.attributes.name}`}
                        value={fieldValues[field.attributes.name] ?? ''}
                        onChangeText={value =>
                          setFieldValue(field.attributes.name, value)
                        }
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
                      <Text key={field.id}>
                        {card.attributes['field-values'][field.attributes.name]}
                      </Text>
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
