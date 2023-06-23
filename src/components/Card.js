import MuiCard from '@mui/material/Card';
import MuiCardActionArea from '@mui/material/CardActionArea';
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
        <MuiCardContent style={{...styles.cardContent, ...contentStyle}}>
          {children}
        </MuiCardContent>
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

const styles = {
  cardContent: {
    padding: '8px',
  },
};
