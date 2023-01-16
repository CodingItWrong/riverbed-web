import {ResourceClient} from '@codingitwrong/jsonapi-client';
import httpClient from './httpClient';

const columnClient = new ResourceClient({
  name: 'columns',
  httpClient: httpClient(),
});

export function useColumns() {
  return columnClient;
}
