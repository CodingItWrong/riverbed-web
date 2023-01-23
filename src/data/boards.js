import {ResourceClient} from '@codingitwrong/jsonapi-client';
import httpClient from './httpClient';

const boardClient = new ResourceClient({
  name: 'boards',
  httpClient: httpClient(),
});

export function useBoards() {
  return boardClient;
}
