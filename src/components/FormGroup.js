import {List} from 'react-native-paper';

export default function FormGroup({title, children}) {
  return <List.Section title={title}>{children}</List.Section>;
}
