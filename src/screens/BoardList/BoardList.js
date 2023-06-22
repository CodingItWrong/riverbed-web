import {CardActionArea as MuiCardActionArea} from '@mui/material';
import MuiCard from '@mui/material/Card';
import MuiCardContent from '@mui/material/CardContent';
import MuiMenu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import sortBy from 'lodash.sortby';
import {useCallback, useState} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import Button from '../../components/Button';
import CenterColumn from '../../components/CenterColumn';
import ErrorSnackbar from '../../components/ErrorSnackbar';
import Icon from '../../components/Icon';
import IconButton from '../../components/IconButton';
import LoadingIndicator from '../../components/LoadingIndicator';
import NavigationBar from '../../components/NavigationBar';
import ScreenBackground from '../../components/ScreenBackground';
import SectionHeader from '../../components/SectionHeader';
import SectionList from '../../components/SectionList';
import Text from '../../components/Text';
import sharedStyles from '../../components/sharedStyles';
import {useBoards, useCreateBoard, useUpdateBoard} from '../../data/boards';
import {useToken} from '../../data/token';
import useColorSchemeTheme from '../../theme/useColorSchemeTheme';
import dateTimeUtils from '../../utils/dateTimeUtils';
import useNavigateEffect from '../../utils/useNavigateEffect';

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

  function goToBoard(board) {
    navigate(`/boards/${board.id}`);
  }

  const {
    mutate: createBoard,
    isLoading: isAdding,
    error: createError,
  } = useCreateBoard();
  const handleCreateBoard = () =>
    createBoard(null, {
      onSuccess: ({data: board}) => goToBoard(board),
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
                  <SectionHeader testID="group-heading">
                    {group.title}
                  </SectionHeader>
                );
              }}
              renderItem={({item: board, index}) => (
                <BoardCard
                  board={board}
                  onPress={() => goToBoard(board)}
                  style={index > 0 ? sharedStyles.mt : null}
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

function BoardCard({board, onPress, style}) {
  const primaryColor = useBoardPrimaryColor(board);

  return (
    <div style={style}>
      <MuiCard>
        <MuiCardActionArea onClick={onPress}>
          <MuiCardContent>
            <div style={styles.boardCard}>
              <Icon
                name={board.attributes.icon ?? 'view-column'}
                style={sharedStyles.mr}
                sx={{color: primaryColor}}
              />
              <Text variant="titleMedium">
                {board.attributes.name ?? '(unnamed board)'}
              </Text>
            </div>
          </MuiCardContent>
        </MuiCardActionArea>
      </MuiCard>
      <div style={styles.favoriteContainer}>
        <FavoriteButton board={board} />
      </div>
    </div>
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

function FavoriteButton({board, onToggleFavorite}) {
  const {attributes} = board;
  const isFavorite = Boolean(attributes['favorited-at']);

  const {mutate: updateBoard} = useUpdateBoard(board);
  const handleUpdateBoard = () => {
    const newFavoritedAt = isFavorite
      ? null
      : dateTimeUtils.objectToServerString(new Date());
    updateBoard({...attributes, 'favorited-at': newFavoritedAt});
  };

  return (
    <IconButton
      accessibilityLabel={
        isFavorite
          ? `${attributes.name} is a favorite board. Tap to unfavorite`
          : `${attributes.name} is not a favorite board. Tap to favorite`
      }
      icon={isFavorite ? 'star' : 'star-outline'}
      style={(styles.favoriteStar, {opacity: isFavorite ? 1.0 : 0.5})}
      onPress={handleUpdateBoard}
    />
  );
}

function useBoardPrimaryColor(board) {
  const colorTheme = useColorSchemeTheme(board?.attributes['color-theme']);
  return colorTheme.palette.primary.main;
}

const styles = {
  boardCard: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 50,
  },
  favoriteContainer: {
    display: 'flex',
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  favoriteStar: {
    margin: 5,
  },
};
