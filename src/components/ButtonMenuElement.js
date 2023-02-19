import Button from './Button';
import DropdownMenu from './DropdownMenu';
import sharedStyles from './sharedStyles';

export default function ButtonMenuElement({
  element,
  onPerformActionForItem,
  disabled,
  style,
}) {
  const {name, options} = element.attributes;

  return (
    <DropdownMenu
      menuButton={props => (
        <Button
          disabled={disabled}
          testID={`button-${element.id}`}
          style={style}
          icon="chevron-down"
          rightIcon
          {...props}
        >
          {name}
        </Button>
      )}
      menuItems={options.items.map(menuItem => ({
        title: menuItem.name,
        onPress: () => onPerformActionForItem(menuItem),
      }))}
    />
  );
}
