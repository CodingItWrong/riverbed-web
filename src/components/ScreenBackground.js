import sharedStyles from './sharedStyles';

export default function ScreenBackground({style, children}) {
  return <div style={{...sharedStyles.fill, ...style}}>{children}</div>;
}
