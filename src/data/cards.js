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

const refreshCard = (queryClient, board, card) =>
  queryClient.invalidateQueries(['cards', board.id, card.id]);

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

// WARNING: only use with data that you *know* is the latest, i.e. just sent to the server to update.
// Otherwise you will get bad data in the edit form and lose data.
// TODO: not sure if this is the cleanest API.
export function usePrimeCard({board}) {
  const queryClient = useQueryClient();
  return function primeCard(card) {
    queryClient.setQueryData(['cards', board.id, card.id], card);
  };
}

export function useForgetCard(board) {
  const queryClient = useQueryClient();
  return function forgetCard(card) {
    queryClient.removeQueries(['cards', board.id, card.id]);
  };
}

export function useCard({boardId, cardId, options}) {
  const cardClient = useCardClient();
  return useQuery(
    ['cards', boardId, cardId],
    () => cardClient.find({id: cardId}).then(resp => resp.data ?? null),
    options,
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

export function useUpdateCard(card, board, mountedRef) {
  const cardClient = useCardClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attributes =>
      cardClient.update({
        type: 'cards',
        id: card.id,
        attributes,
      }),
    onSuccess: () => {
      // always refresh the individual card
      refreshCard(queryClient, board, card);

      if (!mountedRef.current) {
        // if card form was unloaded while card saving, reload cards.
        // cards are refreshed upon card form unload, but this handles when a change was saved after that.
        refreshCards(queryClient, board);
      }
    },
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
