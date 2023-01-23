import {useQuery} from '@tanstack/react-query';
import {StyleSheet} from 'react-native';
import Card from '../../components/Card';
import Field from '../../components/Field';
import {useElements} from '../../data/elements';
import sortElements from '../../utils/sortElements';

export default function CardSummary({card, onPress}) {
  const elementClient = useElements();

  const parent = {type: 'boards', id: '1'};
  const {data: elements = []} = useQuery(['elements'], () =>
    elementClient.related({parent}).then(resp => resp.data),
  );

  const fieldsToShow = sortElements(
    elements.filter(field => field.attributes['show-in-summary']),
  );

  return (
    <Card
      key={card.id}
      style={styles.card}
      onPress={onPress}
      testID={`card-${card.id}`}
    >
      {fieldsToShow.map(field => (
        <Field
          key={field.id}
          field={field}
          value={card.attributes['field-values'][field.id]}
          readOnly
        />
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 4,
    marginTop: 8,
  },
});
