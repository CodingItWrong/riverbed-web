import Card from '../../../components/Card';
import EditCardForm from './EditCardForm';

// unused
// TODO: remove and move other components under screens/Card once confirmed we are using the modal card detail approach
export default function CardDetail({card, board, onChange, onCancel, style}) {
  return (
    <Card key={card.id} style={style}>
      <EditCardForm
        card={card}
        board={board}
        onChange={onChange}
        onCancel={onCancel}
      />
    </Card>
  );
}
