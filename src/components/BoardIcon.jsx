import ICONS from '../enums/icons';
import Icon from './Icon';

// For displaying an icon for a board based on the server-side,
// platform-agnostic icon name.
// For displaying any other icons in the UI, use ./Icon.js
export default function BoardIcon({name, ...props}) {
  const muiName = ICONS.find(i => i.key === name)?.muiName ?? DEFAULT_MUI_NAME;
  return <Icon name={muiName} {...props} />;
}

const DEFAULT_MUI_NAME = 'view-column';
