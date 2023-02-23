import {ResourceClient} from '@codingitwrong/jsonapi-client';
import {useQuery} from '@tanstack/react-query';
import {useMemo} from 'react';
import httpClient from './httpClient';
import {useToken} from './token';

export function useElementClient() {
  const {token} = useToken();

  const elementClient = useMemo(() => {
    const client = httpClient({token});
    return new ResourceClient({name: 'elements', httpClient: client});
  }, [token]);

  return elementClient;
}

export function useBoardElements(board) {
  const elementClient = useElementClient();
  return useQuery(['elements', board.id], () =>
    elementClient.related({parent: board}).then(resp => resp.data),
  );
}
