import Typography from '@mui/material/Typography';

// TODO: abstract away variant from Paper dependnecy
export default function Text({
  children,
  variant,
  component,
  testID,
  style,
  color = 'textPrimary',
}) {
  return (
    <Typography
      variant={VARIANT_MAPPING[variant]}
      component={component}
      data-testid={testID}
      color={color}
      style={style}
    >
      {children}
    </Typography>
  );
}

const VARIANT_MAPPING = {
  titleLarge: 'h4',
  titleMedium: 'h5',
  titleSmall: 'h6',
  bodyLarge: 'body1',
  bodyMedium: 'body2',
  bodySmall: 'caption',
};
