import {ResourceClient} from '@codingitwrong/jsonapi-client';
import {useQuery} from '@tanstack/react-query';
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

export function useBoard(id) {
  const boardClient = useBoardClient();
  return useQuery(['boards', id], () =>
    boardClient.find({id}).then(response => response.data),
  );
}
