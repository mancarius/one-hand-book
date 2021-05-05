/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
import React, { useState, useEffect, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Paper } from "@material-ui/core";
import action from "../../redux/actions";
import GoogleBooks from "../../helpers/googleBooksApi";
import BookContextProvider from "../../components/BookContextProvider";
import BookActions from "../../components/BookActions";
import ArrowBackRounded from "@material-ui/icons/ArrowBackRounded";
import ButtonBack from "../../components/ButtonGoBack";
import BookCover from "../../components/Book/Cover";
import BuyButton from "../../components/Book/BuyButton";
import WebReaderButton from "../../components/Book/WebReaderButton";
import GoToTopButton from "../../components/GoToTopButton";
import styles from "./styles/index.module.css";
import useErrorsHandler from "../../helpers/errorsHandler";
import BookDescription from "../../components/Book/BookDescription";
import BookBibliography from "../../components/Book/BookBibliography";
import BookRelated from "../../components/Book/BookRelated";
import BookInfo from "../../components/Book/BookInfo";


export default React.memo(() => {
  const location = useLocation();
  const volumeID = new URLSearchParams(location.search).get("volumeID");
  const [isValidVolume, setIsValidVolume] = useState(true);
  const errorsHandler = useErrorsHandler();
  const dispatch = useDispatch();

  const [volume, setVolume] = useState({});
  const [imageLinks, setImageLinks] = useState({});
  const [loading, setLoading] = useState(true);
  const [coverZoom, setCoverZoom] = useState(true);

  const PageNotFound = React.lazy(() => {
    setLoading(false);
    return import("../PageNotFound");
  });

  const fetchVolume = React.useCallback(() => {
    GoogleBooks.getVolume(volumeID)
      .catch((error) => {
        errorsHandler(error);
      })
      .then((res) => {
        const isValidObject =
          typeof res === "object" && Object.keys(res).length > 0;
        isValidObject ? setVolume(res) : setIsValidVolume(false);
      });
  }, [volumeID]);

  

  const toggleCoverZoom = () => {
    setCoverZoom((prev) => !prev);
  };

  useEffect(() => {
    if (isValidVolume) {
      // set page header
      dispatch(action.document.title.set(null));
      dispatch(action.document.header.set.title(null));
      // then
      // connect to api
      fetchVolume();
    }

    return () => {};
  }, []);

  useEffect(() => {
    if (isValidVolume) {
      let imgs = volume?.volumeInfo?.imageLinks ?? {};
      let title = volume?.volumeInfo?.title ?? null;

      dispatch(action.document.title.set(title));

      setImageLinks(imgs);
    }
  }, [volume]);

  useEffect(() => {
    !loading && toggleCoverZoom();
  }, [loading]);

  return isValidVolume ? (
    <article className={styles.book_container}>
      {/* work around for image load event */}
      <img
        style={{ display: "none" }}
        alt=""
        src={imageLinks.thumbnail}
        onLoad={() => setLoading(false)}
      />
      <BookContextProvider volume={volume} loading={loading}>
        <UserActions>
          <ButtonBack title="Go back">
            <ArrowBackRounded
              style={{ color: "inherit", textShadow: "inherit" }}
            />
          </ButtonBack>
          <BookActions.FavoriteButton />
          <BookActions.ToReadButton />
          <GoToTopButton />
        </UserActions>
        <BookCover
          className={styles.cover + (coverZoom ? " " + styles.zoom : "")}
          imageLinks={imageLinks}
          title="Frontcover"
        />
        <div className={styles.info}>
          <BookInfo />
        </div>
        <div className={styles.actionsContainer}>
          <BuyButton ebook />
          <WebReaderButton variant="outlined" />
        </div>
        {volume.volumeInfo?.description && (
          <Paper elevation={0} className={styles.card + " " + styles.synopsis}>
            <h2>Description</h2>
            <BookDescription />
          </Paper>
        )}
        <Paper
          elevation={0}
          component="section"
          className={styles.card + " " + styles.bibliography}
        >
          <h2>Bibliography</h2>
          <BookBibliography />
        </Paper>
        <Paper
          elevation={0}
          component="section"
          className={styles.card + " " + styles.explore}
        >
          <h2>Related</h2>
          <BookRelated/>
        </Paper>
      </BookContextProvider>
    </article>
  ) : (
    <Suspense>
      <PageNotFound />
    </Suspense>
  );
});

const UserActions = ({ children, ...props }) => {
  return <div className={styles.userActionsContainer}>{children}</div>;
};
