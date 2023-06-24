import {
  blue,
  cyan,
  green,
  orange,
  pink,
  purple,
  red,
  yellow,
} from '@mui/material/colors';
import COLOR_THEMES from '../enums/colorThemes';

export const primaryColors = {
  default: '#324b4b',
  [COLOR_THEMES.red.key]: red[500],
  [COLOR_THEMES.orange.key]: orange[500],
  [COLOR_THEMES.yellow.key]: yellow[500],
  [COLOR_THEMES.green.key]: green[500],
  [COLOR_THEMES.cyan.key]: cyan[500],
  [COLOR_THEMES.blue.key]: blue[500],
  [COLOR_THEMES.pink.key]: pink[500],
  [COLOR_THEMES.purple.key]: purple[500],
};
