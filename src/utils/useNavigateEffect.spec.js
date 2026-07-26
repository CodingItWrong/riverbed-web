import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {useCallback} from 'react';
import {Link, MemoryRouter, Outlet, Route, Routes} from 'react-router-dom';

import useNavigateEffect from './useNavigateEffect';

function renderScreens(callback) {
  function Parent() {
    useNavigateEffect(useCallback(callback, [callback]));
    return (
      <div>
        <Link to="/boards/1/cards/2">open child</Link>
        <Outlet />
      </div>
    );
  }

  function Child() {
    return <Link to="/boards/1">close child</Link>;
  }

  render(
    <MemoryRouter initialEntries={['/boards/1']}>
      <Routes>
        <Route path="/boards/:boardId" element={<Parent />}>
          <Route path="cards/:cardId" element={<Child />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('useNavigateEffect', () => {
  it('runs the callback when the route is first shown', () => {
    const callback = jest.fn();
    renderScreens(callback);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not run the callback when navigating to a child route', async () => {
    const user = userEvent.setup();
    const callback = jest.fn();
    renderScreens(callback);
    callback.mockClear();

    await user.click(screen.getByText('open child'));

    expect(callback).not.toHaveBeenCalled();
  });

  it('runs the callback when navigating back from a child route', async () => {
    const user = userEvent.setup();
    const callback = jest.fn();
    renderScreens(callback);

    await user.click(screen.getByText('open child'));
    callback.mockClear();
    await user.click(screen.getByText('close child'));

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
