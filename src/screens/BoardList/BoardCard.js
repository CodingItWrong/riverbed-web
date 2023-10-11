import BoardIcon from '../../components/BoardIcon';
import Card from '../../components/Card';
import IconButton from '../../components/IconButton';
import Text from '../../components/Text';
import sharedStyles from '../../components/sharedStyles';
import {useUpdateBoard} from '../../data/boards';
import useColorSchemeTheme from '../../theme/useColorSchemeTheme';
import dateTimeUtils from '../../utils/dateTimeUtils';

export default function BoardCard({board, href, style}) {
  const primaryColor = useBoardPrimaryColor(board);

  return (
    <div style={{...styles.rowWrapper, ...style}}>
      <Card href={href}>
        <div style={styles.boardCard}>
          <BoardIcon
            name={board.attributes['icon-extended']}
            style={sharedStyles.mr}
            sx={{color: primaryColor}}
          />
          <Text size={3}>{board.attributes.name ?? '(unnamed board)'}</Text>
        </div>
      </Card>
      <div style={styles.favoriteContainer}>
        <FavoriteButton board={board} />
      </div>
    </div>
  );
}

function useBoardPrimaryColor(board) {
  const colorTheme = useColorSchemeTheme(board?.attributes['color-theme']);
  return colorTheme.palette.primary.main;
}

function FavoriteButton({board}) {
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

const styles = {
  rowWrapper: {
    position: 'relative',
  },
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
    alignItems: 'center',
  },
  favoriteStar: {
    margin: 5,
  },
};
