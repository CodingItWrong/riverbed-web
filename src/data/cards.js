import {ResourceClient} from '@codingitwrong/jsonapi-client';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useMemo} from 'react';

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

const cardQueryKey = (boardId, cardId) => ['cards', boardId, cardId];

const cardQuery = ({cardClient, boardId, cardId}) => ({
  queryKey: cardQueryKey(boardId, cardId),
  queryFn: () => cardClient.find({id: cardId}).then(resp => resp.data ?? null),
  // long enough that the card screen doesn't refetch a card prefetched on
  // click; saving a card still refetches it, because that invalidates it
  staleTime: 10 * 1000,
});

const refreshCard = (queryClient, board, card) =>
  queryClient.invalidateQueries({queryKey: cardQueryKey(board.id, card.id)});

const refreshAllColumnCards = queryClient =>
  queryClient.invalidateQueries({queryKey: ['columnCards']});

export function useColumnCards(column) {
  const cardClient = useCardClient();
  return useQuery({
    queryKey: ['columnCards', column?.id],
    queryFn: () =>
      cardClient
        .related({
          parent: column,
          options: {timezone: Intl.DateTimeFormat().resolvedOptions().timeZone},
        })
        .then(resp => resp.data),
    enabled: !!column,
  });
}

// WARNING: only use with data that you *know* is the latest, i.e. just sent to the server to update.
// Otherwise you will get bad data in the edit form and lose data.
// TODO: not sure if this is the cleanest API.
export function usePrimeCard({board}) {
  const queryClient = useQueryClient();
  return function primeCard(card) {
    queryClient.setQueryData(cardQueryKey(board.id, card.id), card);
  };
}

// Discards any cached copy of the card, so the edit form never starts from
// stale data, and starts loading it right away. Call this when a card is
// clicked: useCard joins the in-flight request instead of waiting until the
// card screen renders to start it.
export function usePrefetchCard(board) {
  const cardClient = useCardClient();
  const queryClient = useQueryClient();
  return function prefetchCard(card) {
    queryClient.removeQueries({queryKey: cardQueryKey(board.id, card.id)});
    queryClient.prefetchQuery(
      cardQuery({cardClient, boardId: board.id, cardId: card.id}),
    );
  };
}

export function useCard({boardId, cardId, options}) {
  const cardClient = useCardClient();
  return useQuery({
    ...cardQuery({cardClient, boardId, cardId}),
    ...options,
  });
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
    onSuccess: () => {
      refreshAllColumnCards(queryClient);
    },
  });
}

export function useUpdateCard(card, board) {
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
      refreshAllColumnCards(queryClient);
    },
  });
}

export function useDeleteCard(card) {
  const cardClient = useCardClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cardClient.delete({id: card.id}),
    onSuccess: () => {
      refreshAllColumnCards(queryClient);
      return null; // don't wait on refresh, so we can close the modal
    },
  });
}
