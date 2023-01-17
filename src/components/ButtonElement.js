import Button from './Button';

export default function ButtonElement({element, onPerformAction, style}) {
  const {name} = element.attributes;

  return (
    <Button
      onPress={onPerformAction}
      testID={`button-${element.id}`}
      style={style}
    >
      {name}
    </Button>
  );
}
