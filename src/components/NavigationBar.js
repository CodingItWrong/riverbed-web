import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Link as RouterLink} from 'react-router-dom';
import BackButton from './BackButton';
import BoardIcon from './BoardIcon';
import sharedStyles from './sharedStyles';

export default function NavigationBar({options, backTo}) {
  const {title, icon, titleHref, headerRight} = options;

  return (
    <AppBar position="relative">
      <Toolbar>
        {backTo && <BackButton to={backTo} />}
        {icon && <BoardIcon name={icon} style={sharedStyles.mr} />}
        {titleHref ? (
          <div style={styles.grow}>
            <Button
              color="inherit"
              component={RouterLink}
              to={titleHref}
              data-testid="navigation-bar-title"
            >
              <Typography
                variant="h6"
                component="span"
                style={styles.buttonText}
              >
                {title}
              </Typography>
            </Button>
          </div>
        ) : (
          <Typography variant="h6" component="div" style={styles.grow}>
            {title}
          </Typography>
        )}
        {headerRight?.()}
      </Toolbar>
    </AppBar>
  );
}

const styles = {
  grow: {
    flexGrow: 1,
  },
  buttonText: {
    textTransform: 'none',
  },
};
