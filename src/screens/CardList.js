import {useQuery} from '@tanstack/react-query';
import {Text, View} from 'react-native';

export default function CardList() {
  const {data: fields} = useQuery(['fields'], () =>
    fetch('http://localhost:3000/fields').then(response => response.json()),
  );
  const {data: cards} = useQuery(['cards'], () =>
    fetch('http://localhost:3000/cards').then(response => response.json()),
  );

  if (!cards || !fields) {
    return null;
  }

  return (
    <View>
      <Text>CardList</Text>
      {cards.data.map(card => (
        <View>
          {fields.data.map(field => (
            <Text>
              {card.attributes['field-values'][field.attributes.name]}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}
