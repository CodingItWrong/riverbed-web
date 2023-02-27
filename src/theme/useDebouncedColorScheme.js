import debounce from 'lodash.debounce';
import {useEffect, useMemo, useState} from 'react';
import {useColorScheme} from 'react-native';

const DEBOUNCE_MILLISECONDS = 100;

export default function useDebouncedColorScheme() {
  const rawColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState(rawColorScheme);

  const setColorSchemeDebounced = useMemo(
    () => debounce(value => setColorScheme(value), DEBOUNCE_MILLISECONDS),
    [],
  );

  useEffect(() => {
    setColorSchemeDebounced(rawColorScheme);
  }, [setColorSchemeDebounced, rawColorScheme]);

  // uncomment this to see "normal" behavior
  // console.log('returning', rawColorScheme);
  // return rawColorScheme;

  return colorScheme;
}
