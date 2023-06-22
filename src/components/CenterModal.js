export default function CenterModal({children, onDismiss}) {
  return (
    <div style={styles.overlay}>
      <div style={styles.columnWrapper}>
        <PressableArea onPress={onDismiss} />
        <div style={styles.column}>
          <PressableArea onPress={onDismiss} style={styles.topPressableArea} />
          {children}
          <PressableArea onPress={onDismiss} />
        </div>
        <PressableArea onPress={onDismiss} />
      </div>
    </div>
  );
}

function PressableArea({onPress, style}) {
  return (
    <button
      type="button"
      onClick={onPress}
      style={{...styles.pressableArea, ...style}}
    />
  );
}

// LARGE will be given most of the space first, but after it meets its max width, SMALL will still grow
const VERY_LARGE_GROW = 100;
const VERY_SMALL_GROW = 1;

const styles = {
  overlay: {
    display: 'flex',
    position: 'absolute',
    inset: 0,
  },
  columnWrapper: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  column: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    maxWidth: 640, // fits sub-12.9 ipad portrait and half high-res 13" screen
    flexGrow: VERY_LARGE_GROW,
  },
  pressableArea: {
    flexGrow: VERY_SMALL_GROW,
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  topPressableArea: {
    height: 30,
    flexGrow: 0,
  },
};
