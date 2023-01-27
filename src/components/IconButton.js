import {IconButton as PaperIconButton} from 'react-native-paper';

export default function IconButton({icon, onPress, ...props}) {
  return <PaperIconButton icon="arrow-left" onPress={onPress} {...props} />;
}
