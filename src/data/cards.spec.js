import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {renderHook, waitFor} from '@testing-library/react';

import {useColumnCards, useForgetCard, useRefreshCards} from './cards';

jest.mock('./token', () => ({
  useToken: () => ({token: null}),
}));

jest.mock('../baseUrl', () => 'http://testapi');

function makeClientAndWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {queries: {retry: false}},
  });
  function Wrapper({children}) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }
  return {queryClient, wrapper: Wrapper};
}

function makeWrapper() {
  return makeClientAndWrapper().wrapper;
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
      expect.stringMatching(/\/columns\/42\/cards\?.*timezone=/),
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

describe('useForgetCard', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('does not reload the cards shown on the board', async () => {
    const board = {id: '1', type: 'boards', attributes: {}};
    const column = {id: '10', type: 'columns', attributes: {}};
    const card = {id: '2', type: 'cards', attributes: {'field-values': {}}};

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({data: [card]}),
    });

    const {wrapper} = makeClientAndWrapper();
    const {result, rerender} = renderHook(
      () => ({
        columnCards: useColumnCards(column),
        forgetCard: useForgetCard(board),
      }),
      {wrapper},
    );

    await waitFor(() =>
      expect(result.current.columnCards.isSuccess).toBe(true),
    );
    expect(global.fetch).toHaveBeenCalledTimes(1);

    result.current.forgetCard(card);
    rerender(); // clicking a card navigates, which rerenders the board

    expect(result.current.columnCards.data).toEqual([card]);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('removes only the individual card query', () => {
    const board = {id: '1', type: 'boards', attributes: {}};
    const card = {id: '2', type: 'cards', attributes: {'field-values': {}}};

    const {queryClient, wrapper} = makeClientAndWrapper();
    queryClient.setQueryData(['cards', board.id, card.id], card);
    queryClient.setQueryData(['columnCards', '10'], [card]);
    queryClient.setQueryData(['cards', board.id], [card]);

    const {result} = renderHook(() => useForgetCard(board), {wrapper});
    result.current(card);

    expect(
      queryClient.getQueryData(['cards', board.id, card.id]),
    ).toBeUndefined();
    expect(queryClient.getQueryData(['columnCards', '10'])).toEqual([card]);
    expect(queryClient.getQueryData(['cards', board.id])).toEqual([card]);
  });
});

describe('useRefreshCards', () => {
  it("invalidates only the board's card list", async () => {
    const board = {id: '1', type: 'boards', attributes: {}};
    const card = {id: '2', type: 'cards', attributes: {'field-values': {}}};

    const {queryClient, wrapper} = makeClientAndWrapper();
    queryClient.setQueryData(['cards', board.id], [card]);
    queryClient.setQueryData(['columnCards', '10'], [card]);
    queryClient.setQueryData(['boards'], [board]);

    const {result} = renderHook(() => useRefreshCards(board), {wrapper});
    await result.current();

    const isStale = queryKey =>
      queryClient.getQueryState(queryKey).isInvalidated;
    expect(isStale(['cards', board.id])).toBe(true);
    expect(isStale(['columnCards', '10'])).toBe(false);
    expect(isStale(['boards'])).toBe(false);
  });
});
