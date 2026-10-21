import getMuiIcon from './getMuiIcon';

export default function Icon({name, color, sx, style}) {
  const IconComponent = getMuiIcon(name);
  // oxlint-disable-next-line react/static-components -- getMuiIcon returns static, module-level components
  return <IconComponent color={color ?? undefined} sx={sx} style={style} />;
}
