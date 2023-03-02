import {Card as PaperCard} from 'react-native-paper';

export default function Card({
  children,
  buttons,
  onPress,
  style,
  mode,
  testID,
}) {
  return (
    <PaperCard
      onPress={onPress}
      mode={mode}
      style={style}
      testID={testID}
      accessible={false}
    >
      <PaperCard.Content>{children}</PaperCard.Content>
      <PaperCard.Actions>{buttons}</PaperCard.Actions>
    </PaperCard>
  );
}
