import MuiMenu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import sortBy from 'lodash/sortBy';
import {useCallback, useState} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import Button from '../../components/Button';
import CenterColumn from '../../components/CenterColumn';
import ErrorSnackbar from '../../components/ErrorSnackbar';
import IconButton from '../../components/IconButton';
import LoadingIndicator from '../../components/LoadingIndicator';
import NavigationBar from '../../components/NavigationBar';
import ScreenBackground from '../../components/ScreenBackground';
import SectionHeader from '../../components/SectionHeader';
import SectionList from '../../components/SectionList';
import sharedStyles from '../../components/sharedStyles';
import {useBoards, useCreateBoard} from '../../data/boards';
import {useToken} from '../../data/token';
import useNavigateEffect from '../../utils/useNavigateEffect';
import BoardCard from './BoardCard';

export default function BoardList() {
  const {clearToken} = useToken();
  const navigate = useNavigate();

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  useNavigateEffect(
    useCallback(() => {
      document.title = 'My Boards';
    }, []),
  );

  function openMenu(event) {
    setMenuAnchorEl(event.currentTarget);
  }

  const renderMenu = useCallback(() => {
    const isMenuOpen = Boolean(menuAnchorEl);

    function closeMenu() {
      setMenuAnchorEl(null);
    }

    async function signOut() {
      await clearToken();
      navigate('/');
    }

    const handlePress = callback => () => {
      closeMenu();
      callback();
    };

    return (
      <>
        <IconButton
          icon="dots-vertical"
          color="inherit"
          accessibilityLabel="App Menu"
          onPress={openMenu}
        />
        <MuiMenu anchorEl={menuAnchorEl} open={isMenuOpen} onClose={closeMenu}>
          <MuiMenuItem onClick={handlePress(() => navigate('settings'))}>
            User Settings
          </MuiMenuItem>
          <MuiMenuItem onClick={handlePress(signOut)}>Sign Out</MuiMenuItem>
        </MuiMenu>
      </>
    );
  }, [menuAnchorEl, clearToken, navigate]);

  const {data: boards = [], isLoading, error: loadError} = useBoards();

  const boardLink = board => `/boards/${board.id}`;

  const {
    mutate: createBoard,
    isLoading: isAdding,
    error: createError,
  } = useCreateBoard();
  const handleCreateBoard = () =>
    createBoard(null, {
      onSuccess: ({data: board}) => navigate(boardLink(board)),
    });

  const boardGroups = groupBoards(boards);

  return (
    <ScreenBackground>
      <NavigationBar options={{title: 'My Boards', headerRight: renderMenu}} />
      <CenterColumn>
        {isLoading ? (
          <div style={sharedStyles.columnPadding}>
            <LoadingIndicator />
          </div>
        ) : (
          <div>
            <SectionList
              sections={boardGroups}
              sectionKeyExtractor={group => group.title}
              itemKeyExtractor={board => board.id}
              contentContainerStyle={sharedStyles.columnPadding}
              stickySectionHeadersEnabled={false}
              renderSectionHeader={({section: group}) => {
                if (!group.title) {
                  return;
                }

                return (
                  <SectionHeader testID="group-heading" style={sharedStyles.mt}>
                    {group.title}
                  </SectionHeader>
                );
              }}
              renderItem={({item: board}) => (
                <BoardCard
                  board={board}
                  href={boardLink(board)}
                  style={sharedStyles.mb}
                />
              )}
            />
            <div
              style={{
                ...sharedStyles.column,
                ...sharedStyles.columnPadding,
              }}
            >
              <Button
                mode="link"
                icon="plus"
                onPress={handleCreateBoard}
                disabled={isAdding}
              >
                Add Board
              </Button>
            </div>
          </div>
        )}
      </CenterColumn>
      <ErrorSnackbar error={loadError}>
        An error occurred loading the boards.
      </ErrorSnackbar>
      <ErrorSnackbar error={createError}>
        An error occurred adding a new board.
      </ErrorSnackbar>
      <Outlet />
    </ScreenBackground>
  );
}

function groupBoards(boards) {
  const favorites = boards.filter(board => board.attributes['favorited-at']);
  const unfavorites = boards.filter(board => !board.attributes['favorited-at']);

  const groups = [];

  if (favorites.length > 0) {
    groups.push({
      title: 'Favorites',
      data: sortBy(favorites, ['attributes.favorited-at']),
    });
  }

  if (unfavorites.length > 0) {
    const title = favorites.length > 0 ? 'Other Boards' : null;
    groups.push({title, data: sortBy(unfavorites, ['attributes.name'])});
  }
  return groups;
}
