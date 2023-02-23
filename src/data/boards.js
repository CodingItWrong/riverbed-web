import {ResourceClient} from '@codingitwrong/jsonapi-client';
import {useMemo} from 'react';
import httpClient from './httpClient';
import {useToken} from './token';

export function useBoardClient() {
  const {token} = useToken();

  const boardClient = useMemo(() => {
    const client = httpClient({token});
    return new ResourceClient({name: 'boards', httpClient: client});
  }, [token]);

  return boardClient;
}
