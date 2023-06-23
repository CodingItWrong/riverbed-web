import Typography from '@mui/material/Typography';
import TEXT_SIZES from '../enums/textSizes';

// TODO: abstract away variant from Paper dependnecy
export default function Text({
  children,
  size,
  component,
  testID,
  style,
  color = 'textPrimary',
}) {
  const variant =
    TEXT_SIZES.find(s => s.key === size)?.muiVariant ?? DEFAULT_MUI_VARIANT;
  return (
    <Typography
      variant={variant}
      component={component}
      data-testid={testID}
      color={color}
      style={style}
    >
      {children}
    </Typography>
  );
}

const DEFAULT_MUI_VARIANT = 'body1';
