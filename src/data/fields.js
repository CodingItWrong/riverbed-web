import {ResourceClient} from '@codingitwrong/jsonapi-client';
import httpClient from './httpClient';

const fieldClient = new ResourceClient({
  name: 'fields',
  httpClient: httpClient(),
});

export function useFields() {
  return fieldClient;
}
