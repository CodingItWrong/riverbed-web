import {useEffect} from 'react';
import {useLocation, useResolvedPath} from 'react-router-dom';

// Runs the callback when this screen's own route is the one being shown: on
// first render, and each time the user navigates back to it. It does not run
// when navigating to a child route (such as opening a card modal on top of the
// board), because the user has not left this screen.
export default function useNavigateEffect(callback) {
  const location = useLocation();
  const routePath = useResolvedPath('.').pathname;
  const isShowingThisRoute =
    withoutTrailingSlash(location.pathname) === withoutTrailingSlash(routePath);

  useEffect(() => {
    if (isShowingThisRoute) {
      return callback({location});
    }
  }, [callback, isShowingThisRoute, location]);
}

function withoutTrailingSlash(path) {
  return path.length > 1 ? path.replace(/\/$/, '') : path;
}
