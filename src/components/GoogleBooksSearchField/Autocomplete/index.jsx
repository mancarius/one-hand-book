/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
import React, { useState, useEffect, useRef } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import Option from "./Option";
import styles from "./styles/index.module.css";
import _ from "lodash";
import useErrorsHandler from "../../../helpers/errorsHandler";

const useStyles = makeStyles({
  listbox: {
    maxHeight: "none",
  },
  option: {
    padding: 0,
  },
});

export default React.forwardRef((props, inputRef) => {
  const {
    api,
    setIsUserSubmitTo,
    onInputFocus,
    onInputBlur,
    inputValue,
    setInputValueTo,
    children,
  } = props;
  const classes = useStyles();
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const errorsHandler = useErrorsHandler();
  const isMount = useRef(false);

  /**
   * fetch autocomplete options every 200ms
   *
   * @param {String} query
   * @param {Function} callback the callback function to call after response. accept an arg.
   */
  const fetch = _.throttle((query, callback) => {
    api
      .autocomplete(query, { maxResults: 10 })
      .then(callback)
      .catch(errorsHandler);
  }, 200);

  useEffect(() => {
    isMount.current = true;

    return () => {
      isMount.current = false;
    }
  }, []);

  // autocomplete
  useEffect(() => {
    let active = true;
    const isValidQueryString =
      typeof inputValue === "string" && inputValue.length > 0;

    if (isValidQueryString && open) {
      fetch(inputValue, (results) => {
        if (active) {
          let newOptions = [];

          if (Boolean(results)) {
            newOptions = [...newOptions, ...results];
          }

          setOptions(newOptions);
        }
      });
    }

    return () => {
      active = false;
    };
  }, [inputValue, open]);

  useEffect(() => {
    setIsUserSubmitTo(true);
  }, [value]);

  // clear autocomplete options on field blur
  useEffect(() => {
    !open && setOptions([]);
  }, [open]);

  return (
    <Autocomplete
      id="book-search-autocomplete"
      classes={{ listbox: classes.listbox, option: classes.option }}
      options={options}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.main_text
      }
      getOptionSelected={(option) => option.main_text === inputValue}
      filterOptions={(x) => x}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={(e, newValue) => {
        setValue(newValue);
      }}
      onFocus={(e) => onInputFocus(e)}
      onBlur={(e) => {
        setOpen(false);
        onInputBlur(e);
      }}
      value={value}
      freeSolo
      autoComplete
      filterSelectedOptions
      blurOnSelect
      selectOnFocus
      disableClearable
      onInputChange={(e, newInputValue) => {
        isMount.current && setInputValueTo(newInputValue);
      }}
      inputValue={inputValue}
      renderInput={(params) => {
        return React.cloneElement(children, {
          inputRef,
          ...params,
        });
      }}
      renderOption={(option) => <Option option={option} />}
      PaperComponent={(props) => (
        <div className={styles.paper}>{props.children}</div>
      )}
    />
  );
});
