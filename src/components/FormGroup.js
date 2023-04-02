import {Divider, List} from 'react-native-paper';

export default function FormGroup({title, children}) {
  return (
    <>
      <Divider />
      <List.Section title={title}>{children}</List.Section>
      <Divider />
    </>
  );
}
