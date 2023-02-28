import {createContext, useContext, useState} from 'react';

const CurrentBoardContext = createContext();

// For passing the current board ID to child components, as it's hard to do so with route params
export function CurrentBoardProvider({children}) {
  const [boardId, setBoardId] = useState(null);
  const providerValue = {boardId, setBoardId};

  return (
    <CurrentBoardContext.Provider value={providerValue}>
      {children}
    </CurrentBoardContext.Provider>
  );
}

export function useCurrentBoard() {
  return useContext(CurrentBoardContext);
}
