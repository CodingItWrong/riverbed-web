import {Card as PaperCard} from 'react-native-paper';

export default function Card({children, buttons, onPress}) {
  return (
    <PaperCard onPress={onPress}>
      <PaperCard.Content>{children}</PaperCard.Content>
      <PaperCard.Actions>{buttons}</PaperCard.Actions>
    </PaperCard>
  );
}
