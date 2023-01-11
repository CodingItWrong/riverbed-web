import {useQuery} from '@tanstack/react-query';
import {Text, View} from 'react-native';
import api from '../api';

export default function CardList() {
  const {data: fields} = useQuery(['fields'], () => api.get('/fields'));
  const {data: cards} = useQuery(['cards'], () => api.get('/cards'));

  if (!cards || !fields) {
    return null;
  }

  return (
    <View>
      {cards.data.map(card => (
        <View key={card.id}>
          {fields.data.map(field => (
            <Text key={field.id}>
              {card.attributes['field-values'][field.attributes.name]}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}
