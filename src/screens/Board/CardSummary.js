import {useQuery} from '@tanstack/react-query';
import {StyleSheet} from 'react-native';
import Card from '../../components/Card';
import Field from '../../components/Field';
import Text from '../../components/Text';
import {useElements} from '../../data/elements';
import sortElements from '../../utils/sortElements';

export default function CardSummary({card, board, onPress, style}) {
  const elementClient = useElements();

  const {data: elements = []} = useQuery(['elements', board.id], () =>
    elementClient.related({parent: board}).then(resp => resp.data),
  );

  const fieldsToShow = sortElements(
    elements.filter(field => field.attributes['show-in-summary']),
  );

  return (
    <Card
      key={card.id}
      style={[styles.card, style]}
      onPress={onPress}
      testID={`card-${card.id}`}
    >
      {fieldsToShow.length > 0 ? (
        fieldsToShow.map(field => (
          <Field
            key={field.id}
            field={field}
            value={card.attributes['field-values'][field.id]}
            readOnly
          />
        ))
      ) : (
        <Text>(no fields to show!)</Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 4,
  },
});
