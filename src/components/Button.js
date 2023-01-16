import {Button as PaperButton} from 'react-native-paper';

export default function Button({onPress, children, primary = false, style}) {
  const mode = primary ? 'contained' : 'outlined';
  return (
    <PaperButton mode={mode} onPress={onPress} style={style}>
      {children}
    </PaperButton>
  );
}
