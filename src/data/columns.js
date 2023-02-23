import {ResourceClient} from '@codingitwrong/jsonapi-client';
import {useMutation, useQuery} from '@tanstack/react-query';
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

export function useColumns(board) {
  const columnClient = useColumnClient();
  return useQuery(['columns', board.id], () =>
    columnClient.related({parent: board}).then(resp => resp.data),
  );
}

export function useCreateColumn(board) {
  const columnClient = useColumnClient();
  return useMutation({
    mutationFn: () =>
      columnClient.create({
        relationships: {board: {data: {type: 'boards', id: board.id}}},
        attributes: {},
      }),
  });
}

export function useUpdateColumn(column) {
  const columnClient = useColumnClient();
  return useMutation({
    mutationFn: attributes => {
      const updatedColumn = {
        type: 'columns',
        id: column.id,
        attributes,
      };
      return columnClient.update(updatedColumn);
    },
  });
}

export function useDeleteColumn(column) {
  const columnClient = useColumnClient();
  return useMutation({
    mutationFn: () => columnClient.delete({id: column.id}),
  });
}
