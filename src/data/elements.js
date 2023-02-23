import {ResourceClient} from '@codingitwrong/jsonapi-client';
import {useMutation, useQuery} from '@tanstack/react-query';
import {useMemo} from 'react';
import httpClient from './httpClient';
import {useToken} from './token';

function useElementClient() {
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

export function useCreateElement(board) {
  const elementClient = useElementClient();
  return useMutation({
    mutationFn: attributes =>
      elementClient.create({
        relationships: {board: {data: {type: 'boards', id: board.id}}},
        attributes,
      }),
  });
}

export function useUpdateElement(element) {
  const elementClient = useElementClient();
  return useMutation({
    mutationFn: attributes =>
      elementClient.update({
        type: 'elements',
        id: element.id,
        attributes,
      }),
  });
}

export function useDeleteElement(element) {
  const elementClient = useElementClient();
  return useMutation({
    mutationFn: () => elementClient.delete({id: element.id}),
  });
}
