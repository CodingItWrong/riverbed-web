import {Card as PaperCard} from 'react-native-paper';

export default function Card({children, buttons, onPress, style, mode}) {
  return (
    <PaperCard onPress={onPress} mode={mode} style={style}>
      <PaperCard.Content>{children}</PaperCard.Content>
      <PaperCard.Actions>{buttons}</PaperCard.Actions>
    </PaperCard>
  );
}
