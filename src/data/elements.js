import {ResourceClient} from '@codingitwrong/jsonapi-client';
import {useMemo} from 'react';
import httpClient from './httpClient';
import {useToken} from './token';

export function useElements() {
  const {token} = useToken();

  const elementClient = useMemo(() => {
    const client = httpClient({token});
    return new ResourceClient({name: 'elements', httpClient: client});
  }, [token]);

  return elementClient;
}
