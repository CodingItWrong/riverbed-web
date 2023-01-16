import {ResourceClient} from '@codingitwrong/jsonapi-client';
import httpClient from './httpClient';

const elementClient = new ResourceClient({
  name: 'elements',
  httpClient: httpClient(),
});

export function useElements() {
  return elementClient;
}
