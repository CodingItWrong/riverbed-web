import {useQuery} from '@tanstack/react-query';
import {View} from 'react-native';
import Card from '../../../components/Card';
import Field from '../../../components/Field';
import Text from '../../../components/Text';
import {useElements} from '../../../data/elements';
import sortElements from '../../../utils/sortByDisplayOrder';

export default function CardSummary({card, board, onPress, style}) {
  const elementClient = useElements();

  const {data: elements = []} = useQuery(['elements', board.id], () =>
    elementClient.related({parent: board}).then(resp => resp.data),
  );

  const fieldsToShow = sortElements(
    elements.filter(field => field.attributes['show-in-summary']),
  );

  // TODO: field wrapper test ID should be in Field component
  return (
    <Card
      key={card.id}
      style={style}
      onPress={onPress}
      testID={`card-${card.id}`}
    >
      {fieldsToShow.length > 0 ? (
        fieldsToShow.map(field => (
          <View key={field.id} testID="field-value">
            <Field
              field={field}
              value={card.attributes['field-values'][field.id]}
              readOnly
            />
          </View>
        ))
      ) : (
        <Text>(no fields to show!)</Text>
      )}
    </Card>
  );
}
