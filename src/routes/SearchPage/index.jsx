/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import action from "../../redux/actions";
import styles from "./styles/index.module.css";
import { IconButton } from "@material-ui/core";
import GoogleBooksSearchField from "../../components/GoogleBooksSearchField";
import SearchResults from "../../components/SearchResults";
import GoToTopButton from "../../components/GoToTopButton";
import { useLocation } from "react-router";

function useUrlParams(key) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams?.get(key) ?? null;
}

const SearchPage = React.memo(() => {
  let queryParams = useUrlParams;
  const dispatch = useDispatch();
  const location = useLocation();
  const [query, setQuery] = useState(queryParams("q"));

  function refreshQueryByUrlParams() {
    const urlQuery = queryParams("q");
    urlQuery !== query && setQuery(urlQuery);
  }

  useEffect(() => {
    // set page header
    dispatch(action.document.title.set("Search"));
    dispatch(action.document.header.set.title("Search"));
    dispatch(action.document.nav.set.activeItem("search"));

    refreshQueryByUrlParams();
  }, []);

  useEffect(() => {
    Boolean(query) && dispatch(action.document.title.set(query));
  }, [query]);

  useEffect(() => {
    refreshQueryByUrlParams();
  }, [location]);

  return (
    <>
      <div className={styles.search_field_background + " secondary-bg-color"}></div>
      <div className={styles.search_field_container}>
        <GoogleBooksSearchField
          urlQueryString={query}
          setQuery={setQuery}
          placeholder="What are you looking for?"
        />
      </div>
      {query && (
        <>
          <h4 className={styles.subtitle}>Search results</h4>
          <SearchResults
            query={query}
            maxResults={queryParams("maxResults")}
            startIndex={queryParams("startIndex")}
            infiniteScroll
          />
        </>
      )}
      <GoToTopButton component={IconButton} floating />
    </>
  );
});

export default SearchPage;
