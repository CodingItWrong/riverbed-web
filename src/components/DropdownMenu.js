import {useState} from 'react';
import {Menu} from 'react-native-paper';

export default function DropdownMenu({menuButton, menuItems}) {
  const [isMenuShown, setIsMenuShown] = useState(false);

  function handlePress(item) {
    setIsMenuShown(false);
    item.onPress();
  }

  return (
    <Menu
      visible={isMenuShown}
      onDismiss={() => setIsMenuShown(false)}
      anchor={menuButton({onPress: () => setIsMenuShown(true)})}
    >
      {menuItems.map(item => (
        <Menu.Item
          key={item.title}
          title={item.title}
          onPress={() => handlePress(item)}
        />
      ))}
    </Menu>
  );
}
