import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {renderHook, waitFor} from '@testing-library/react';

import {useCard, useColumnCards, usePrefetchCard} from './cards';

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

describe('usePrefetchCard', () => {
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
        prefetchCard: usePrefetchCard(board),
      }),
      {wrapper},
    );

    await waitFor(() =>
      expect(result.current.columnCards.isSuccess).toBe(true),
    );
    expect(global.fetch).toHaveBeenCalledTimes(1);

    result.current.prefetchCard(card);
    rerender(); // clicking a card navigates, which rerenders the board

    expect(result.current.columnCards.data).toEqual([card]);
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenLastCalledWith(
      expect.stringMatching(/\/cards\/2\?/),
      expect.any(Object),
    );
  });

  it('replaces a cached copy of the card with a fresh request', async () => {
    const board = {id: '1', type: 'boards', attributes: {}};
    const staleCard = {
      id: '2',
      type: 'cards',
      attributes: {'field-values': {a: 'old'}},
    };
    const freshCard = {
      id: '2',
      type: 'cards',
      attributes: {'field-values': {a: 'new'}},
    };

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({data: freshCard}),
    });

    const {queryClient, wrapper} = makeClientAndWrapper();
    queryClient.setQueryData(['cards', board.id, staleCard.id], staleCard);
    queryClient.setQueryData(['columnCards', '10'], [staleCard]);

    const {result} = renderHook(() => usePrefetchCard(board), {wrapper});
    result.current(staleCard);

    expect(
      queryClient.getQueryData(['cards', board.id, staleCard.id]),
    ).toBeUndefined();
    await waitFor(() =>
      expect(
        queryClient.getQueryData(['cards', board.id, staleCard.id]),
      ).toEqual(freshCard),
    );
    expect(queryClient.getQueryData(['columnCards', '10'])).toEqual([
      staleCard,
    ]);
  });

  it('is reused by useCard instead of requesting the card again', async () => {
    const board = {id: '1', type: 'boards', attributes: {}};
    const card = {id: '2', type: 'cards', attributes: {'field-values': {}}};

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({data: card}),
    });

    const {wrapper} = makeClientAndWrapper();
    const {result: prefetch} = renderHook(() => usePrefetchCard(board), {
      wrapper,
    });

    // while the request is still in flight
    prefetch.current(card);
    const {result: inFlight} = renderHook(
      () => useCard({boardId: board.id, cardId: card.id}),
      {wrapper},
    );
    await waitFor(() => expect(inFlight.current.data).toEqual(card));
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // after the request has finished
    prefetch.current(card);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
    await new Promise(resolve => setTimeout(resolve, 0));
    const {result: afterLoad} = renderHook(
      () => useCard({boardId: board.id, cardId: card.id}),
      {wrapper},
    );
    await waitFor(() => expect(afterLoad.current.data).toEqual(card));
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
