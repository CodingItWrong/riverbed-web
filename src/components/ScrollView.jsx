import classes from './ScrollView.module.css';

export default function ScrollView({children, pagingEnabled, styles}) {
  return (
    <div
      className={`${classes.contentView} ${pagingEnabled ? classes.paging : ''}`}
      style={styles}
    >
      {children}
    </div>
  );
}
