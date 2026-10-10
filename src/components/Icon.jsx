import getMuiIcon from './getMuiIcon';

export default function Icon({name, color, sx, style}) {
  const IconComponent = getMuiIcon(name);
  return <IconComponent color={color ?? undefined} sx={sx} style={style} />;
}
