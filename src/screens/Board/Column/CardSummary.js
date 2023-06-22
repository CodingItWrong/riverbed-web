import Card from '../../../components/Card';
import Field from '../../../components/Field';
import Text from '../../../components/Text';
import sortByDisplayOrder from '../../../utils/sortByDisplayOrder';

export default function CardSummary({card, board, elements, onPress, style}) {
  const fieldsToShow = sortByDisplayOrder(
    elements.filter(field => field.attributes['show-in-summary']),
  );

  function contents() {
    if (elements.length === 0) {
      return <Text variant="titleMedium">Click this card to get started!</Text>;
    } else if (fieldsToShow.length === 0) {
      return <Text>(no fields to show!)</Text>;
    }
    return fieldsToShow.map((field, index) => (
      <div key={field.id} data-testid="field-value">
        <Field
          field={field}
          value={card.attributes['field-values'][field.id]}
          readOnly
          summary
          index={index}
        />
      </div>
    ));
  }

  // TODO: field wrapper test ID should be in Field component
  return (
    <Card
      key={card.id}
      style={style}
      onPress={onPress}
      testID={`card-${card.id}`}
    >
      <div style={styles.cardContent}>{contents()}</div>
    </Card>
  );
}

const styles = {
  cardContent: {
    overflow: 'hidden',
  },
};
