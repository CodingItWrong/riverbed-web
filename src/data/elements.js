import {ResourceClient} from '@codingitwrong/jsonapi-client';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
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

const refreshElements = (queryClient, board) =>
  queryClient.invalidateQueries(['elements', board.id]);

export function useBoardElements(board) {
  const elementClient = useElementClient();
  return useQuery(
    ['elements', board?.id],
    () => elementClient.related({parent: board}).then(resp => resp.data),
    {enabled: !!board},
  );
}

export function useBoardElement({boardId, elementId}) {
  const elementClient = useElementClient();
  return useQuery(['elements', boardId, elementId], () =>
    elementClient.find({id: elementId}).then(resp => resp.data),
  );
}

export function useCreateElement(board) {
  const elementClient = useElementClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attributes =>
      elementClient
        .create({
          relationships: {board: {data: {type: 'boards', id: board.id}}},
          attributes,
        })
        .then(({data}) => data),
    onSuccess: () => refreshElements(queryClient, board),
  });
}

export function useUpdateElement(element, board) {
  const elementClient = useElementClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attributes =>
      elementClient.update({
        type: 'elements',
        id: element.id,
        attributes,
      }),
    onSuccess: () => refreshElements(queryClient, board),
  });
}

export function useDeleteElement(element, board) {
  const elementClient = useElementClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => elementClient.delete({id: element.id}),
    onSuccess: () => refreshElements(queryClient, board),
  });
}
