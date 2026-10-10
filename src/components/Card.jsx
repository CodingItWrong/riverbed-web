import MuiCard from '@mui/material/Card';
import MuiCardActionArea from '@mui/material/CardActionArea';
import MuiCardActions from '@mui/material/CardActions';
import MuiCardContent from '@mui/material/CardContent';
import {Link as RouterLink} from 'react-router-dom';

export default function Card({
  children,
  buttons,
  href,
  onClick,
  style,
  testID,
  contentStyle,
}) {
  return (
    <MuiCard style={style} data-testid={testID}>
      <ConditionalCardActionArea href={href} onClick={onClick}>
        <MuiCardContent style={{...styles.cardContent, ...contentStyle}}>
          {children}
        </MuiCardContent>
        {buttons && <MuiCardActions>{buttons}</MuiCardActions>}
      </ConditionalCardActionArea>
    </MuiCard>
  );
}

function ConditionalCardActionArea({href, onClick, children}) {
  if (href) {
    return (
      <MuiCardActionArea component={RouterLink} to={href} onClick={onClick}>
        {children}
      </MuiCardActionArea>
    );
  } else {
    return children;
  }
}

const styles = {
  cardContent: {
    padding: '8px',
  },
};
