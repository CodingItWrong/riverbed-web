import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import BackButton from './BackButton';
import Icon from './Icon';
import LoadingIndicator from './LoadingIndicator';
import sharedStyles from './sharedStyles';

export default function NavigationBar({options, backTo}) {
  const {title, icon, onTitlePress, headerRight, isFetching} = options;

  return (
    <AppBar position="relative">
      <Toolbar>
        {backTo && <BackButton to={backTo} />}
        {icon && <Icon name={icon} style={sharedStyles.mr} />}
        {onTitlePress ? (
          <Button
            color="inherit"
            onClick={onTitlePress}
            data-testid="navigation-bar-title"
          >
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
