import {Text as PaperText} from 'react-native-paper';

// TODO: abstract away variant from Paper dependnecy
export default function Text({children, variant}) {
  return <PaperText variant={variant}>{children}</PaperText>;
}
