import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {renderHook, waitFor} from '@testing-library/react';
import {useColumnCards} from './cards';

jest.mock('./token', () => ({
  useToken: () => ({token: null}),
}));

jest.mock('../baseUrl', () => 'http://testapi');

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {queries: {retry: false}},
  });
  return function Wrapper({children}) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe('useColumnCards', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('is disabled when column is null', async () => {
    const {result} = renderHook(() => useColumnCards(null), {
      wrapper: makeWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('is disabled when column is undefined', async () => {
    const {result} = renderHook(() => useColumnCards(undefined), {
      wrapper: makeWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('fetches GET /columns/:id/cards and returns card array', async () => {
    const column = {id: '42', type: 'columns', attributes: {}};
    const cards = [
      {id: '1', type: 'cards', attributes: {'field-values': {}}},
      {id: '2', type: 'cards', attributes: {'field-values': {}}},
    ];

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({data: cards}),
    });

    const {result} = renderHook(() => useColumnCards(column), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/columns/42/cards'),
      expect.any(Object),
    );
    expect(result.current.data).toEqual(cards);
  });

  it('uses separate query keys for different columns', async () => {
    const columnA = {id: '10', type: 'columns', attributes: {}};
    const columnB = {id: '20', type: 'columns', attributes: {}};
    const cardsA = [{id: '1', type: 'cards', attributes: {'field-values': {}}}];
    const cardsB = [{id: '2', type: 'cards', attributes: {'field-values': {}}}];

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({data: cardsA}),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({data: cardsB}),
      });

    const queryClient = new QueryClient({
      defaultOptions: {queries: {retry: false}},
    });
    const wrapper = ({children}) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const {result: resultA} = renderHook(() => useColumnCards(columnA), {
      wrapper,
    });
    const {result: resultB} = renderHook(() => useColumnCards(columnB), {
      wrapper,
    });

    await waitFor(() => {
      expect(resultA.current.isSuccess).toBe(true);
      expect(resultB.current.isSuccess).toBe(true);
    });

    expect(resultA.current.data).toEqual(cardsA);
    expect(resultB.current.data).toEqual(cardsB);
  });
});
