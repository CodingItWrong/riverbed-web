import {useQuery} from '@tanstack/react-query';
import {useState} from 'react';
import {Card, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import api from '../api';

export default function CardList() {
  const [cardToShowDetail, setCardToShowDetail] = useState(null);

  const {data: fields} = useQuery(['fields'], () => api.get('/fields'));
  const {data: cards} = useQuery(['cards'], () => api.get('/cards'));

  if (!cards || !fields) {
    return null;
  }

  return (
    <SafeAreaView>
      {cards.data.map(card => {
        const showDetail = cardToShowDetail === card.id;
        const fieldsToShow = showDetail
          ? fields.data
          : fields.data.filter(field => field.attributes['show-in-summary']);

        return (
          <Card key={card.id} onPress={() => setCardToShowDetail(card.id)}>
            <Card.Content>
              {fieldsToShow.map(field => (
                <Text key={field.id}>
                  {card.attributes['field-values'][field.attributes.name]}
                </Text>
              ))}
            </Card.Content>
          </Card>
        );
      })}
    </SafeAreaView>
  );
}
