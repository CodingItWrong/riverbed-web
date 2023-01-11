import {useQuery} from '@tanstack/react-query';
import {Card, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import api from '../api';

export default function CardList() {
  const {data: fields} = useQuery(['fields'], () => api.get('/fields'));
  const {data: cards} = useQuery(['cards'], () => api.get('/cards'));

  if (!cards || !fields) {
    return null;
  }

  return (
    <SafeAreaView>
      {cards.data.map(card => (
        <Card key={card.id}>
          <Card.Content>
            {fields.data.map(field => (
              <Text key={field.id}>
                {card.attributes['field-values'][field.attributes.name]}
              </Text>
            ))}
          </Card.Content>
        </Card>
      ))}
    </SafeAreaView>
  );
}
