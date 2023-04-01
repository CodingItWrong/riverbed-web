import {View} from 'react-native';
import {domainForUrl, trimPath} from '../utils/urlUtils';
import {AutoDetectLink} from './AutoDetectLink';
import Text from './Text';
import fieldTypes from './fieldTypes';

export default function Field({
  field,
  value,
  index,
  readOnly,
  summary,
  disabled,
  setValue,
  style,
}) {
  const {name, 'data-type': dataType, options} = field.attributes;

  const fieldType = fieldTypes[dataType];

  if (!fieldType) {
    return <Text>ERROR: unknown data type {dataType}</Text>;
  }

  if (readOnly) {
    let originalText = fieldType.formatValue({value, options});
    let textToShow = originalText;

    if (!textToShow) {
      return null;
    }

    if (options['abbreviate-urls']) {
      textToShow = domainForUrl(textToShow);
    }

    if (options['show-label-when-read-only']) {
      textToShow = `${name}: ${textToShow ?? '(empty)'}`;
    }

    const variant = summary && index === 0 ? 'bodyLarge' : 'bodySmall';

    return (
      <View style={style} testID={`field-${field.id}`}>
        <AutoDetectLink
          enableLinking={options['link-urls']}
          variant={variant}
          link={originalText}
        >
          {textToShow}
        </AutoDetectLink>
      </View>
    );
  }

  const {EditorComponent} = fieldType;
  return (
    <EditorComponent
      field={field}
      value={value ?? ''}
      setValue={setValue}
      disabled={disabled}
      style={style}
    />
  );
}
