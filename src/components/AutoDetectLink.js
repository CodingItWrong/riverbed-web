import Link from '@mui/material/Link';
import {isValidUrl} from '../utils/urlUtils';
import Text from './Text';

// Pass text to this and if it is a valid URL it will be rendered as a link
export function AutoDetectLink({link, enableLinking, size, children}) {
  if (enableLinking && isValidUrl(link)) {
    // div prevents the clickable link from being the entire width
    return (
      <div>
        <Link href={link} target="_blank" onClick={preventParentClickBehavior}>
          <Text component="span" size={size} color={null}>
            {children}
          </Text>
        </Link>
      </div>
    );
  } else {
    // Our Text adds color for light/dark mode, MUI's Typography does not
    return <Text size={size}>{children}</Text>;
  }
}

function preventParentClickBehavior(e) {
  e.stopPropagation();
}
