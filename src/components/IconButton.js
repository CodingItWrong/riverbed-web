import {IconButton as PaperIconButton} from 'react-native-paper';

export default function IconButton({icon, onPress, ...props}) {
  return <PaperIconButton icon={icon} onPress={onPress} {...props} />;
}
