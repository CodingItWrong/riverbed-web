import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Link as RouterLink} from 'react-router-dom';
import BackButton from './BackButton';
import BoardIcon from './BoardIcon';
import LoadingIndicator from './LoadingIndicator';
import sharedStyles from './sharedStyles';

export default function NavigationBar({options, backTo}) {
  const {title, icon, titleHref, headerRight, isFetching} = options;

  return (
    <AppBar position="relative">
      <Toolbar>
        {backTo && <BackButton to={backTo} />}
        {icon && <BoardIcon name={icon} style={sharedStyles.mr} />}
        {titleHref ? (
          <Button
            color="inherit"
            component={RouterLink}
            to={titleHref}
            data-testid="navigation-bar-title"
          >
            <Typography variant="h6" component="span" style={styles.buttonText}>
              {title}
            </Typography>
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

const styles = {
  buttonText: {
    textTransform: 'none',
  },
};
