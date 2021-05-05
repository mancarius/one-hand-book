import React, { useState, useContext } from "react";
import { BookContext } from "../../BookContextProvider";
import { IconButton } from "@material-ui/core";
import UnfoldLessRoundedIcon from "@material-ui/icons/UnfoldLessRounded";
import UnfoldMoreRoundedIcon from "@material-ui/icons/UnfoldMoreRounded";
import styles from "./styles/index.module.css";

export default function BookDescription(props) {
  const { volume } = useContext(BookContext);
  const [expandSynopsis, setExpandSynopsis] = useState(false);

  const toggleSynopsis = () => {
    setExpandSynopsis((prev) => !prev);
  };

  return (
    <>
      <p
        className={styles["synopsis-window"]}
        style={expandSynopsis ? { maxHeight: "1000vh" } : {}}
      >
        {volume?.volumeInfo?.description?.replace(/<(.|\n)*?>/g, "") ?? ""}
      </p>
      <div
        className={styles.buttonContainer}
        style={expandSynopsis ? { paddingTop: 0, marginTop: 0 } : {}}
      >
        <IconButton
          aria-label={expandSynopsis ? "Read less" : "Read more"}
          onClick={toggleSynopsis}
        >
          {expandSynopsis ? (
            <UnfoldLessRoundedIcon fontSize="inherit" />
          ) : (
            <UnfoldMoreRoundedIcon fontSize="inherit" />
          )}
        </IconButton>
      </div>
    </>
  );
}
