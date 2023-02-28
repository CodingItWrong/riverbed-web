import Card from '../../../components/Card';
import EditCardForm from './EditCardForm';

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
