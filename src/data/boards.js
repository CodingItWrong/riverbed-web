import {ResourceClient} from '@codingitwrong/jsonapi-client';
import {useMutation, useQuery} from '@tanstack/react-query';
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

export function useBoards() {
  const boardClient = useBoardClient();
  return useQuery(['boards'], () => boardClient.all().then(resp => resp.data));
}

export function useBoard(id) {
  const boardClient = useBoardClient();
  return useQuery(['boards', id], () =>
    boardClient.find({id}).then(response => response.data),
  );
}

export function useCreateBoard() {
  const boardClient = useBoardClient();
  return useMutation({
    mutationFn: () => boardClient.create({attributes: {}}),
  });
}

export function useUpdateBoard(board) {
  const boardClient = useBoardClient();
  return useMutation({
    mutationFn: attributes =>
      boardClient.update({
        type: 'boards',
        id: board.id,
        attributes,
      }),
  });
}

export function useDeleteBoard(board) {
  const boardClient = useBoardClient();
  return useMutation({
    mutationFn: () => boardClient.delete({id: board.id}),
  });
}
