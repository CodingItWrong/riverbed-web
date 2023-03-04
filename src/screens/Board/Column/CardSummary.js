import {StyleSheet, View} from 'react-native';
import Card from '../../../components/Card';
import Field from '../../../components/Field';
import Text from '../../../components/Text';
import {useBoardElements} from '../../../data/elements';
import sortByDisplayOrder from '../../../utils/sortByDisplayOrder';

export default function CardSummary({card, board, onPress, style}) {
  const {data: elements = []} = useBoardElements(board);

  const fieldsToShow = sortByDisplayOrder(
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
      <View style={styles.cardContent}>
        {fieldsToShow.length > 0 ? (
          fieldsToShow.map((field, index) => (
            <View key={field.id} testID="field-value">
              <Field
                field={field}
                value={card.attributes['field-values'][field.id]}
                readOnly
                summary
                index={index}
              />
            </View>
          ))
        ) : (
          <Text>(no fields to show!)</Text>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardContent: {
    overflow: 'hidden',
  },
});
