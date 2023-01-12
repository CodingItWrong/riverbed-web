import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import {FlatList} from 'react-native';
import {Button, Card, Text, TextInput} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import api from '../api';
import ScreenBackground from './ScreenBackground';

export default function CardList() {
  const queryClient = useQueryClient();
  const [cardIdToShowDetail, setCardIdToShowDetail] = useState(null);
  const [fieldValues, setFieldValues] = useState(null);

  const {data: fields} = useQuery(['fields'], () => api.get('/fields'));
  const {data: cards} = useQuery(['cards'], () => api.get('/cards'));

  const {mutate} = useMutation({
    mutationFn: () => {
      const cardUpdates = {
        type: 'cards',
        id: cardIdToShowDetail,
        attributes: {'field-values': fieldValues},
      };
      return api.patch(`/cards/${cardIdToShowDetail}`, {data: cardUpdates});
    },
    onSuccess: () => queryClient.invalidateQueries(['cards']),
  });

  if (!cards || !fields) {
    return null;
  }

  function showDetail(cardId) {
    setCardIdToShowDetail(cardId);
    setFieldValues(
      cards.data.find(card => card.id === cardId).attributes['field-values'],
    );
  }

  function setFieldValue(name, value) {
    setFieldValues(oldValues => ({...oldValues, [name]: value}));
  }

  function hideDetail() {
    setCardIdToShowDetail(null);
    setFieldValues(null);
  }

  async function saveChanges() {
    await mutate();
    hideDetail();
  }

  return (
    <ScreenBackground>
      <SafeAreaView>
        <FlatList
          data={cards.data}
          keyExtractor={card => card.id}
          renderItem={({item: card}) => {
            if (cardIdToShowDetail === card.id) {
              const fieldsToShow = fields.data;

              return (
                <Card key={card.id}>
                  <Card.Content>
                    {fieldsToShow.map(field => (
                      <TextInput
                        key={field.id}
                        label={field.attributes.name}
                        testID={`text-input-${field.attributes.name}`}
                        value={fieldValues[field.attributes.name]}
                        onChangeText={value =>
                          setFieldValue(field.attributes.name, value)
                        }
                      />
                    ))}
                  </Card.Content>
                  <Card.Actions>
                    <Button onPress={hideDetail}>Cancel</Button>
                    <Button onPress={saveChanges}>Save</Button>
                  </Card.Actions>
                </Card>
              );
            } else {
              const fieldsToShow = fields.data.filter(
                field => field.attributes['show-in-summary'],
              );

              return (
                <Card key={card.id} onPress={() => showDetail(card.id)}>
                  <Card.Content>
                    {fieldsToShow.map(field => (
                      <Text key={field.id}>
                        {card.attributes['field-values'][field.attributes.name]}
                      </Text>
                    ))}
                  </Card.Content>
                </Card>
              );
            }
          }}
        />
      </SafeAreaView>
    </ScreenBackground>
  );
}
