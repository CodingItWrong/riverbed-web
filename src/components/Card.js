import {CardActionArea as MuiCardActionArea} from '@mui/material';
import MuiCard from '@mui/material/Card';
import MuiCardActions from '@mui/material/CardActions';
import MuiCardContent from '@mui/material/CardContent';

export default function Card({
  children,
  buttons,
  onPress,
  style,
  testID,
  contentStyle,
}) {
  return (
    <MuiCard style={style} data-testid={testID}>
      <ConditionalCardActionArea onClick={onPress}>
        <MuiCardContent style={contentStyle}>{children}</MuiCardContent>
        {buttons && <MuiCardActions>{buttons}</MuiCardActions>}
      </ConditionalCardActionArea>
    </MuiCard>
  );
}

function ConditionalCardActionArea({onClick, children}) {
  if (onClick) {
    return <MuiCardActionArea onClick={onClick}>{children}</MuiCardActionArea>;
  } else {
    return children;
  }
}
