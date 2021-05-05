/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import action from "../../redux/actions";
import BookPreview from "../BookPreview";
import PreviewsContainer from "../BookPreviewsContainer";
import useErrorsHandler from "../../helpers/errorsHandler";
import gapi from "../../helpers/googleBooksApi";
import RenderCarousel from "../Carousel/Render";

/**
 * @param {Number} startIndex
 * @param {Number} maxResults
 */
function updateUrlParams(startIndex, maxResults) {
  if (maxResults !== null) {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("q")) {
      urlParams.set("startIndex", startIndex);
      urlParams.set("maxResults", maxResults);
      window.history.replaceState(null, null, "?" + urlParams.toString());
    }
  }
}

/**
 * React Hook - handle the last query info stored locally.
 *
 * @returns {Array} [storage, setStorge]
 */
function useStorage() {
  const [storage, setStorageState] = useState(() => {
    const storedQuery = localStorage.getItem("last-query");
    return JSON.parse(storedQuery) || {};
  });

  const setStorage = (value) => {
    setStorageState((prev) => (typeof value === "object" ? value : prev));
  };

  useEffect(() => {
    localStorage.setItem("last-query", JSON.stringify(storage));
  }, [storage]);

  return [storage, setStorage];
}

export default function SearchResults(props) {
  const { query, infiniteScroll, carousel } = props;
  const isSubscribed = useRef(false);
  const errorsHandler = useErrorsHandler();
  const dispatch = useDispatch();
  const [storage, setStorage] = useStorage();
  const isValidQueryString = typeof query === "string" && query.length;
  const isQueryChanged = query !== storage.query && isValidQueryString;
  const [items, setItems] = useState(() =>
    isQueryChanged ? [] : storage.items ?? []
  );
  const maxResults = useRef(props.maxResults || 10);
  const [startIndex, setStartIndex] = useState(
    props.startIndex || items.length
  );
  const isMaxResultsChanged = maxResults.current !== storage.maxResults;
  const isStartIndexChanged = startIndex !== storage.startIndex;
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const onLoadMore = () => {
    if (items.length && !loading) {
      setStartIndex(items.length);
    }
  };
  const [hasNextPage, setHasNextPage] = useState(true);

  /**
   * Return a promise containing an array.
   *
   * If query, max results and start index are same, return a resolved promise with stored data, otherwise perform an api call
   *
   * @returns {Promise} Array of items
   */
  const fetchQuery = () =>
    isQueryChanged || isMaxResultsChanged || isStartIndexChanged
      ? gapi.search({
          query,
          startIndex: startIndex,
          maxResults: maxResults.current,
        })
      : Promise.resolve({ items: storage.items });

  /**
   * Perform a query to obtain required items and if received a valid response refresh the items list.
   *
   * If query param isn't valid or loading state is true, aborts
   */
  const refreshItems = () => {
    if (isValidQueryString && !loading) {
      setLoading(true);
      fetchQuery()
        .then((res) => {
          if (isSubscribed.current && res.items !== undefined) {
            setItemsTo(res.items);
            setHasNextPage(() => {
              const itemsCount = res.items.length;
              if (itemsCount) {
                const value = itemsCount / maxResults.current;
                const hasDecimals = !!(value % 1);
                return !hasDecimals;
              } else {
                return false;
              }
            });
          }
        })
        .catch((err) => {
          if (isSubscribed.current) {
            errorsHandler(err);
            setIsError(true);
            setLoading(false);
          }
        })
        .finally(() => {
          if (isSubscribed.current) {
            setLoading(false);
          }
        });
    }
  };

  /**
   * Set items with given arg.
   *
   * If query change then replace items, else append them to previous items.
   *
   * @param {Array} newItems
   */
  function setItemsTo(newItems) {
    isQueryChanged
      ? setItems(newItems)
      : setItems((prev) => [...prev, ...newItems]);
  }

  /**
   * Set startIndex to 0
   */
  function resetStartIndex() {
    setStartIndex(0);
  }


  //////////////////////////////
  // EFFECTS
  //////////////////////////////

  // ON MOUNT
  useEffect(() => {
    isSubscribed.current = true;

    return () => {
      isSubscribed.current = false;
    };
  }, []);

  // save last results in local storage if items, query or infiniteScroll change
  useEffect(() => {
    // save the current startIndex in the url
    infiniteScroll && updateUrlParams(startIndex, maxResults.current);
    // saving current items in localStorage
    setStorage({
      query,
      startIndex: startIndex,
      maxResults: maxResults.current,
      items,
    });
  }, [items, infiniteScroll]);

  useEffect(() => {
    (isQueryChanged || isStartIndexChanged || isMaxResultsChanged) &&
      refreshItems();
  }, [isQueryChanged, isStartIndexChanged, isMaxResultsChanged]);

  // reset startIndex and scroll top
  useEffect(() => {
    if (isQueryChanged) {
      resetStartIndex();
      window.scrollTo(0, 0);
    }
  }, [isQueryChanged]);

  useEffect(() => {
    loading
      ? dispatch(action.document.loading.start())
      : dispatch(action.document.loading.stop());
  }, [loading]);

  const renderItems = React.useCallback(() => {
    return items.map((volume, index) => (
      <BookPreview
        key={volume.id + index}
        id={volume.id}
        saleInfo={volume.saleInfo}
        {...volume.volumeInfo}
        {...props}
      />
    ));
  }, [items, props]);

  return (
    isValidQueryString &&
    (carousel ? (
      <RenderCarousel {...props}>{renderItems()}</RenderCarousel>
    ) : (
      <>
        <PreviewsContainer
          infiniteScroll
          disabled={isError}
          loading={loading}
          hasNextPage={hasNextPage}
          onLoadMore={onLoadMore}
        >
          {renderItems()}
        </PreviewsContainer>
      </>
    ))
  );
}
