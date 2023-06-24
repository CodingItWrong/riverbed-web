import {domainForUrl} from '../utils/urlUtils';
import {AutoDetectLink} from './AutoDetectLink';
import Text from './Text';
import fieldTypes from './fieldTypes';

export default function Field({
  field,
  value,
  readOnly,
  disabled,
  setValue,
  style,
  label,
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

    const size = options['text-size'];

    return (
      <div style={style} data-testid={`field-${field.id}`}>
        <AutoDetectLink
          enableLinking={options['link-urls']}
          size={size}
          link={originalText}
        >
          {textToShow}
        </AutoDetectLink>
      </div>
    );
  }

  const {EditorComponent} = fieldType;
  return (
    <EditorComponent
      field={field}
      label={label ?? field.attributes.name}
      value={value}
      setValue={setValue}
      disabled={disabled}
      style={style}
    />
  );
}
