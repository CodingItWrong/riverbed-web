import Button from './Button';

export default function ButtonElement({element, onPerformAction}) {
  const {name} = element.attributes;

  return <Button onPress={onPerformAction}>{name}</Button>;
}
