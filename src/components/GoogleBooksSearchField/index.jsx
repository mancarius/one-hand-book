/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import action from "../../redux/actions";
import api from "../../helpers/googleBooksApi";
import styles from "./styles/index.module.css";
import Autocomplete from "./Autocomplete";
import _ from "lodash";
import { InputAdornment, TextField } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import SearchRoundedIcon from "@material-ui/icons/SearchRounded";

/**
 * @param {Boolean} state
 */
const setPageScrollOnMobileScreenTo = (state) => {
  if (window.innerWidth < 600) {
    state
      ? (document.body.style.overflow = "auto")
      : (document.body.style.overflow = "hidden");
  }
};

const GoogleBooksSearchField = React.memo((props) => {
  const { urlQueryString, setQuery, placeholder } = props;
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  let inputRef = useRef(null);
  const [isUserSubmit, setIsUserSubmit] = useState(false);
  const [inputValue, setInputValue] = useState(urlQueryString || "");

  const submit = () => {
    const isValidQueryString =
      typeof inputValue === "string" && inputValue.length > 0;

    if (isValidQueryString && isUserSubmit) {
      // send query to the search page, even if it's already in the search page.
      // this will create a new history session and the user can go back to the previous query
      let encodedQuery = encodeURI(_.replace(inputValue, /[\s]+/g, "+"));
      history.push(`/search?q=${encodedQuery}`);
      if (location.pathname === "/search") {
        typeof setQuery === "function" && setQuery(inputValue); // setQuery is a parent state
      }
    }
  };

  const onInputFocus = (e) => {
    setIsUserSubmitTo(false);
    expandSearchForm(e);
    addSearchOpenHash();
  };

  const onInputBlur = (e) => {
    reduceSearchForm(e);
    isUserSubmit && removeSearchOpenHash();
  };

  const setIsUserSubmitTo = (val) => {
    if (isUserSubmit !== val) setIsUserSubmit(val);
  };

  const setInputValueTo = (val) => {
    setInputValue(() => (typeof val !== "string" ? "" : val));
  };

  const expandSearchForm = (e) => {
    setPageScrollOnMobileScreenTo(false);
    e.currentTarget.closest("form").classList.add(styles.fixed);
  };

  const addSearchOpenHash = () => {
    location.hash !== "#search" &&
      history.push(`${location.pathname + location.search}#search`);
  };

  const reduceSearchForm = (e) => {
    setPageScrollOnMobileScreenTo(true);
    e.currentTarget.closest("form").classList.remove(styles.fixed);
  };

  const removeSearchOpenHash = () => {
    location.hash === "#search" && history.goBack(); // go back to remove hash '#search'
  };

  //////////////////////////////
  // EFFECTS
  //////////////////////////////

  useEffect(() => {
    return () => {
      dispatch(action.document.loading.stop());
    };
  }, []);

  useEffect(() => {
    console.log("urlSearchQuery", urlQueryString);
    urlQueryString !== inputValue && setInputValueTo(urlQueryString);
  }, [urlQueryString]);

  useEffect(() => {
    location.hash === "#search"
      ? inputRef.current?.focus()
      : inputRef.current?.blur();
  }, [location.hash]);

  useEffect(() => {
    isUserSubmit && submit();
  }, [isUserSubmit]);

    useEffect(() => {
        console.log("inputValue", inputValue);
    }, [inputValue]);


  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        setIsUserSubmitTo(true);
      }}
    >
      <div className={styles.grid_container}>
        <div className={styles.grid_item}>
          <Autocomplete
            api={api}
            setIsUserSubmitTo={setIsUserSubmitTo}
            setIsUserSubmit={setIsUserSubmitTo}
            onInputFocus={onInputFocus}
            onInputBlur={onInputBlur}
            setInputValueTo={setInputValueTo}
            inputValue={inputValue}
            ref={inputRef}
          >
            <TextField
              type="search"
              style={{ backgroundColor: "white" }}
              fullWidth
              placeholder={placeholder || "Search"}
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton type="submit">
                      <SearchRoundedIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Autocomplete>
        </div>
      </div>
    </form>
  );
});

export default GoogleBooksSearchField;