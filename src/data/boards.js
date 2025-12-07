import {ResourceClient} from '@codingitwrong/jsonapi-client';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useMemo} from 'react';
import httpClient from './httpClient';
import {useToken} from './token';

function useBoardClient() {
  const {token} = useToken();

  const boardClient = useMemo(() => {
    const client = httpClient({token});
    return new ResourceClient({name: 'boards', httpClient: client});
  }, [token]);

  return boardClient;
}

const refreshBoards = queryClient => queryClient.invalidateQueries(['boards']);

export function useBoards() {
  const boardClient = useBoardClient();
  return useQuery({
    queryKey: ['boards'],
    queryFn: () => boardClient.all().then(resp => resp.data),
  });
}

export function useBoard(id) {
  const boardClient = useBoardClient();
  return useQuery({
    queryKey: ['boards', id],
    queryFn: () => boardClient.find({id}).then(response => response.data),
    enabled: !!id,
  });
}

export function useCreateBoard() {
  const boardClient = useBoardClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => boardClient.create({attributes: {}}),
    onSuccess: () => refreshBoards(queryClient),
  });
}

export function useUpdateBoard(board) {
  const boardClient = useBoardClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attributes =>
      boardClient.update({
        type: 'boards',
        id: board.id,
        attributes,
      }),
    onSuccess: () => refreshBoards(queryClient),
  });
}

export function useDeleteBoard(board) {
  const boardClient = useBoardClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => boardClient.delete({id: board.id}),
    onSuccess: () => refreshBoards(queryClient),
  });
}
