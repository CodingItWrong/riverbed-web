import {ResourceClient} from '@codingitwrong/jsonapi-client';
import {useMutation, useQuery} from '@tanstack/react-query';
import {useMemo} from 'react';
import httpClient from './httpClient';
import {useToken} from './token';

export function useCardClient() {
  const {token} = useToken();

  const cardClient = useMemo(() => {
    const client = httpClient({token});
    return new ResourceClient({name: 'cards', httpClient: client});
  }, [token]);

  return cardClient;
}

export function useCards(board) {
  const cardClient = useCardClient();
  return useQuery(
    ['cards', board?.id],
    () => cardClient.related({parent: board}).then(resp => resp.data),
    {enabled: !!board},
  );
}

export function useCreateCard(board) {
  const cardClient = useCardClient();
  return useMutation({
    mutationFn: attributes =>
      cardClient.create({
        attributes,
        relationships: {
          board: {data: {type: 'boards', id: board.id}},
        },
      }),
  });
}

export function useUpdateCard(card) {
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
