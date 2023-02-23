import {ResourceClient} from '@codingitwrong/jsonapi-client';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useMemo} from 'react';
import httpClient from './httpClient';
import {useToken} from './token';

function useColumnClient() {
  const {token} = useToken();

  const columnClient = useMemo(() => {
    const client = httpClient({token});
    return new ResourceClient({name: 'columns', httpClient: client});
  }, [token]);

  return columnClient;
}

const refreshColumns = (queryClient, board) =>
  queryClient.invalidateQueries(['columns', board.id]);

export function useColumns(board) {
  const columnClient = useColumnClient();
  return useQuery(['columns', board.id], () =>
    columnClient.related({parent: board}).then(resp => resp.data),
  );
}

export function useCreateColumn(board) {
  const columnClient = useColumnClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      columnClient.create({
        relationships: {board: {data: {type: 'boards', id: board.id}}},
        attributes: {},
      }),
    onSuccess: () => refreshColumns(queryClient, board),
  });
}

export function useUpdateColumn(column, board) {
  const columnClient = useColumnClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attributes => {
      const updatedColumn = {
        type: 'columns',
        id: column.id,
        attributes,
      };
      return columnClient.update(updatedColumn);
    },
    onSuccess: () => refreshColumns(queryClient, board),
  });
}

export function useDeleteColumn(column, board) {
  const columnClient = useColumnClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => columnClient.delete({id: column.id}),
    onSuccess: () => refreshColumns(queryClient, board),
  });
}
