/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import action from "../../redux/actions";
import Bookshelf from "../../components/Bookshelf";
import gapi from "../../helpers/googleBooksApi";
import useErrorsHandler from "../../helpers/errorsHandler";
import EmptyShelfLarge from "../../components/Bookshelf/EmptyLarge";
import { CarouselHeader } from "../../components/Carousel/Header";
import BookPreview from "../../components/BookPreview";
import styles from "./styles/index.module.css";
import _ from "lodash";
import BookshelfIcon from "../../components/Bookshelf/BookshelfIcon";
import Chip from "@material-ui/core/Chip";
import base_path from "../../helpers/base_path";
import GoToTopButton from "../../components/GoToTopButton";
import { IconButton } from "@material-ui/core";

const UserAuthError = (() => {
  return class extends Error {
    constructor(mess) {
      super(mess);
      this.name = "UNAUTHENTICATED";
    }
  };
})();

export default React.memo(function (props) {
  const { bookshelfID } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const [shelves, setShelves] = useState([]);
  const errorHandler = useErrorsHandler();
  const isSubscribed = useRef(false);
  const [loading, setLoading] = useState(true);
  const [shelfTitle, setShelfTitle] = useState("My library");
  const user = useSelector((state) => state.user);

  useEffect(() => {
    try {
      isSubscribed.current = true;
      if (!user.uid) throw new UserAuthError();
      // set page header
      dispatch(action.document.title.set(shelfTitle));
      dispatch(action.document.header.set.title('My Library'));
      dispatch(action.document.nav.set.activeItem("library"));
      // load shelves list
      gapi
        .getMyBookshelves()
        .then((res) => {
          if (isSubscribed.current) {
            setShelves(res.items?.filter((o) => o.volumeCount > 0));
          }
        })
        .catch((err) => {
          if (isSubscribed.current) {
            throw err;
          }
        })
        .finally(() => {
          isSubscribed.current && setLoading(false);
        });
    } catch (e) {
      isSubscribed.current && errorHandler(e);
    }

    return () => {
      isSubscribed.current = false;
      setLoading(false);
    };
  }, []);

  useEffect(() => {
    dispatch(action.document.nav.set.activeItem("library"));
    // if isset shelf id, look for title
    if (bookshelfID >= 0) {
      const [shelf] = shelves.filter((o) => o.id === Number(bookshelfID));
      const title = shelf?.title;
      title && setShelfTitle(title);
      title && dispatch(action.document.title.set(title));
    } else {
      dispatch(action.document.title.set(shelfTitle));
    }
  }, [shelves, bookshelfID, shelfTitle]);

  useEffect(() => {
    loading
      ? dispatch(action.document.loading.start())
      : dispatch(action.document.loading.stop());
  }, [loading]);

  return (
    <>
      <h1 className={styles.title + ' secondary-bg-color'}>{shelfTitle}</h1>
      {loading ? (
        <></>
      ) : bookshelfID ? (
        <>
          <Bookshelf
            grid
            large
            shelfID={bookshelfID}
            maxResults={40}
            fallback={<EmptyShelfLarge />}
            component={<BookPreview column />}
          />
        </>
      ) : (
        <div className={styles.grid_container}>
          {shelves.map((shelf) => {
            const href =
              base_path +
              `/my-library/${shelf.id}/${_.kebabCase(shelf.title)}`;
            return (
              <div className={styles.carousel_container} key={shelf.id}>
                <CarouselHeader
                  title={shelf.title}
                  onClick={() => {
                    history.push(href);
                  }}
                  href
                  primaryIcon={<BookshelfIcon shelfId={shelf.id} />}
                  secondaryIcon={
                    <Chip label={shelf.volumeCount} size="small" />
                  }
                />
              </div>
            );
          })}
        </div>
      )}

      <GoToTopButton component={IconButton} floating />
    </>
  );
});
