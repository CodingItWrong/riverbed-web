import {StyleSheet} from 'react-native';
import FIELD_DATA_TYPES from '../../enums/fieldDataTypes';
import TextField from '../TextField';

const textFieldDataType = {
  key: FIELD_DATA_TYPES.TEXT.key,
  label: 'Text',
  formatValue: ({value}) => value?.trim(),
  getSortValue: ({value}) => textFieldDataType.formatValue({value}),
  EditorComponent: TextEditorComponent,
};

function TextEditorComponent({
  field,
  value,
  setValue,
  onBlur,
  readOnly,
  disabled,
  style,
}) {
  const {name, options: {multiline} = {}} = field.attributes;
  return (
    <TextField
      label={name}
      value={value ?? ''}
      onChangeText={setValue}
      onBlur={onBlur}
      disabled={disabled}
      multiline={multiline}
      style={[style, multiline && styles.multilineFix]}
      testID={`text-input-${field.id}`}
    />
  );
}

export default textFieldDataType;

const styles = StyleSheet.create({
  // @see https://github.com/callstack/react-native-paper/issues/3665#issuecomment-1425643799
  multilineFix: {
    lineHeight: 24,
  },
});
