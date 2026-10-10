import Button from './Button';

export default function ButtonElement({
  element,
  onPerformAction,
  disabled,
  style,
}) {
  const {name} = element.attributes;

  return (
    <Button
      mode="primary"
      onPress={onPerformAction}
      disabled={disabled}
      testID={`button-${element.id}`}
      style={style}
    >
      {name}
    </Button>
  );
}
