import {ResourceClient} from '@codingitwrong/jsonapi-client';
import httpClient from './httpClient';

const cardClient = new ResourceClient({
  name: 'cards',
  httpClient: httpClient(),
});

export function useCards() {
  return cardClient;
}
