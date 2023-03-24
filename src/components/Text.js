import {Text as PaperText} from 'react-native-paper';

// TODO: abstract away variant from Paper dependnecy
export default function Text({children, variant, testID, style}) {
  return (
    <PaperText variant={variant} testID={testID} style={style}>
      {children}
    </PaperText>
  );
}
