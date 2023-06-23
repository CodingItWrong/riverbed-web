import {styled} from '@mui/material/styles';
import sharedStyles from './sharedStyles';

const ScreenBackground = styled('div')(({theme}) => ({
  backgroundColor:
    theme.palette.mode === 'light' ? theme.palette.grey[200] : null,
  ...sharedStyles.fill,
}));

export default ScreenBackground;
