/* eslint-disable import/no-anonymous-default-export */
import React, { useState, useEffect, useContext, useRef } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { BookContext } from "../../BookContextProvider";
import useErrorsHandler from "../../../helpers/errorsHandler";
import FavoriteBorderRoundedIcon from "@material-ui/icons/FavoriteBorderRounded";
import FavoriteRounded from "@material-ui/icons/FavoriteRounded";
import gapi from "../../../helpers/googleBooksApi";
import SnackbarActions from "../../SnackbarActions";

async function updateState(volumeID, state) {
  try {
    return state
      ? await gapi.addToMyFavorites(volumeID)
      : await gapi.removeFromMyFavorites(volumeID);
  } catch (err) {
    throw err;
  }
}

export default function FavoriteButton(props) {
  const user = useSelector((state) => state.user);
  const { volume } = useContext(BookContext);
  const { enqueueSnackbar } = useSnackbar();
  const [favorite, setFavorite] = useState(false);
  const isSubscribed = useRef(false);
  const errorsHandler = useErrorsHandler();

  const toggleAction = (type) => {
    if ("token" in user) {
      // update changes
      updateState(volume.id, !favorite)
        .then((res) => {
          if (!isSubscribed.current) return undefined;
          // else
          setFavorite((prev) => !prev);
        })
        .catch((err) => {
          if (!isSubscribed.current) return undefined;
          // else
          errorsHandler(err);
        });
    } else {
      enqueueSnackbar('Sign in to add this book to your "to read" list', {
        variant: "info",
        action: (key) => (
          <>
            <SnackbarActions.Dismiss snackKey={key} />
            <SnackbarActions.SignIn />
          </>
        ),
      });
    }
  };

  useEffect(() => {
    isSubscribed.current = true;

    // get action status
    gapi
      .isFavorite(volume.id)
      .then((res) => {
        if (!isSubscribed.current) return undefined;
        setFavorite(res);
      })
      .catch((err) => {
        if (!isSubscribed.current) return undefined;
        // else
        errorsHandler(err);
      });

    return () => {
      isSubscribed.current = false;
    };
  }, []);

  return (
    <button onClick={() => toggleAction()}>
      {favorite ? <FavoriteRounded /> : <FavoriteBorderRoundedIcon />}
    </button>
  );
}
