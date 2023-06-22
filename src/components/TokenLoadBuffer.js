import {useToken} from '../data/token';
import sharedStyles from './sharedStyles';

export default function TokenLoadBuffer({children}) {
  const {isTokenLoaded} = useToken();

  if (!isTokenLoaded) {
    return null; // because children will error
  } else {
    return <div style={sharedStyles.fill}>{children}</div>;
  }
}
