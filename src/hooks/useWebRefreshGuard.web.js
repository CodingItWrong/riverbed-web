import {useBeforeunload} from 'react-beforeunload';

export default function useWebRefreshGuard(warn) {
  useBeforeunload(event => {
    if (warn) {
      event.preventDefault(); // this prompts the user before proceeding with the reload
    }
  });
}
