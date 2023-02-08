import {List} from 'react-native-paper';

export default function SectionHeader({testID, style, children}) {
  return (
    <List.Subheader style={style} testID={testID}>
      {children}
    </List.Subheader>
  );
}
