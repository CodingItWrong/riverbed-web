export default function ScrollView({children, pagingEnabled, styles}) {
  return (
    <div
      style={{
        ...scrollViewStyles.contentView,
        ...styles,
        ...(pagingEnabled ? scrollViewStyles.paging : {}),
      }}
    >
      {children}
    </div>
  );
}

const scrollViewStyles = {
  contentView: {
    display: 'flex',
    flex: '1 1 0%',
    'flex-direction': 'row',
    'overflow-x': 'auto',
  },
  paging: {
    'scroll-snap-type': 'x mandatory',
  },
};
