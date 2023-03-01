import {ResourceClient} from '@codingitwrong/jsonapi-client';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useCallback, useMemo} from 'react';
import httpClient from './httpClient';
import {useToken} from './token';

function useCardClient() {
  const {token} = useToken();

  const cardClient = useMemo(() => {
    const client = httpClient({token});
    return new ResourceClient({name: 'cards', httpClient: client});
  }, [token]);

  return cardClient;
}

const refreshCards = (queryClient, board) =>
  queryClient.invalidateQueries(['cards', board.id]);

export function useRefreshCards(board) {
  const queryClient = useQueryClient();
  const returnedRefreshCards = useCallback(
    () => board && refreshCards(queryClient, board),
    [board, queryClient],
  );
  return returnedRefreshCards;
}

export function useCards(board) {
  const cardClient = useCardClient();
  return useQuery(
    ['cards', board?.id],
    () => cardClient.related({parent: board}).then(resp => resp.data),
    {enabled: !!board},
  );
}

export function useCard({boardId, cardId}) {
  const cardClient = useCardClient();
  return useQuery(['cards', boardId, cardId], () =>
    cardClient.find({id: cardId}).then(resp => resp.data ?? null),
  );
}

export function useCreateCard(board) {
  const cardClient = useCardClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attributes =>
      cardClient.create({
        attributes,
        relationships: {
          board: {data: {type: 'boards', id: board.id}},
        },
      }),
    onSuccess: () => refreshCards(queryClient, board),
  });
}

export function useUpdateCard(card, board) {
  const cardClient = useCardClient();
  return useMutation({
    mutationFn: attributes =>
      cardClient.update({
        type: 'cards',
        id: card.id,
        attributes,
      }),
  });
}

export function useDeleteCard(card, board) {
  const cardClient = useCardClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cardClient.delete({id: card.id}),
    onSuccess: () => {
      refreshCards(queryClient, board);
      return null; // don't wait on refresh, so we can close the modal
    },
  });
}
