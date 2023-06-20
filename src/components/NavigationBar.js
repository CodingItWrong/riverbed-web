import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import BackButton from './BackButton';
import Icon from './Icon';
import LoadingIndicator from './LoadingIndicator';
import sharedStyles from './sharedStyles';

// TODO: positioned after contents in React Navigation, so may need to
// switch off that first before switching this off Paper
export default function NavigationBar({navigation, options, back}) {
  const {title, icon, onTitlePress, headerRight, isFetching} = options;

  return (
    <AppBar position="relative">
      <Toolbar>
        {back && <BackButton />}
        {icon && <Icon name={icon} style={sharedStyles.mr} />}
        {onTitlePress ? (
          <Button color="inherit" onClick={onTitlePress}>
            {title}
          </Button>
        ) : (
          <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
            {title}
          </Typography>
        )}
        <LoadingIndicator loading={Boolean(isFetching)} />
        {headerRight?.()}
      </Toolbar>
    </AppBar>
  );
}
