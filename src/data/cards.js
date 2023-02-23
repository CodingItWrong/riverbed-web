import {ResourceClient} from '@codingitwrong/jsonapi-client';
import {useMemo} from 'react';
import httpClient from './httpClient';
import {useToken} from './token';

export function useCardClient() {
  const {token} = useToken();

  const cardClient = useMemo(() => {
    const client = httpClient({token});
    return new ResourceClient({name: 'cards', httpClient: client});
  }, [token]);

  return cardClient;
}
