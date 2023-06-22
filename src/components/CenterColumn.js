export default function CenterColumn({children}) {
  // without outer div, inner div shrinks to minimum size
  return (
    <div>
      <div style={styles.column}>{children}</div>
    </div>
  );
}

const styles = {
  column: {
    margin: '0 auto',
    maxWidth: 640, // fits sub-12.9 ipad portrait and half high-res 13" screen
  },
};
