import {useEffect} from 'react';

export default function useKeyHandler(key, callback) {
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === key) {
        callback();
        event.stopPropagation();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [key, callback]);
}
