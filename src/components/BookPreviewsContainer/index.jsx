import React from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import styles from "./styles/index.module.css";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(2),
  },
}));

export default React.forwardRef((props, ref) => {
  const {
    nowrap,
    children,
    large,
    small,
    infiniteScroll,
    loading,
    hasNextPage,
    disabled,
    onLoadMore = () => {},
  } = props;
  const size = large ? "large" : small ? "small" : "normal";
  const classes = useStyles();
  const [infiniteRef] = useInfiniteScroll({
    loading,
    rootMargin: "0px 0px 400px 0px",
    hasNextPage,
    disabled,
    onLoadMore,
  });

  return (
    <>
      <ul className={styles.grid} ref={ref || null} data-size={size}>
        {children}
      </ul>
      {infiniteScroll && (
        <div className={classes.root} ref={infiniteRef}>
          {loading && <CircularProgress />}
        </div>
      )}
    </>
  );
});
