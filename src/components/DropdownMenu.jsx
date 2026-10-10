import MuiMenu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import {useState} from 'react';

export default function DropdownMenu({menuButton, menuItems}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);

  function openMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function closeMenu() {
    setAnchorEl(null);
  }

  function handlePress(item) {
    closeMenu();
    item.onPress();
  }

  return (
    <>
      {menuButton({onPress: openMenu})}
      <MuiMenu anchorEl={anchorEl} open={isOpen} onClose={closeMenu}>
        {menuItems.map(item => (
          <MuiMenuItem key={item.title} onClick={() => handlePress(item)}>
            {item.title}
          </MuiMenuItem>
        ))}
      </MuiMenu>
    </>
  );
}
