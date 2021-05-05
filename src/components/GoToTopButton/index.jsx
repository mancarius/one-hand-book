import React, { useEffect, useState } from "react";
import { Zoom } from "@material-ui/core";
import _ from "lodash";
import styles from "./styles/index.module.css";
import ArrowUpwardRoundedIcon from "@material-ui/icons/ArrowUpwardRounded";

const GoToTopButton = ({ component = "button", floating }) => {
  const [visible, setVisible] = useState(false);
  const [zoomIn, setZoomIn] = useState(false);
  const delay = React.useRef(null);
  const classes = floating ? styles.floating : "";
  const Component = component;
  const onPageScroll = _.throttle(() => {
    const scrollTop = window.pageYOffset;
    const pageHeight = window.innerHeight;

    scrollTop > pageHeight / 2 ? setVisible(true) : setZoomIn(false);
  }, 500);

  useEffect(() => {
    window.addEventListener("scroll", onPageScroll);

    return () => {
      window.removeEventListener("scroll", onPageScroll);
    };
  }, [onPageScroll]);

  useEffect(() => {
    visible && setZoomIn(true);
  }, [visible]);

  useEffect(() => {
    !zoomIn
      ? (delay.current = setTimeout(() => setVisible(false), 200))
      : clearTimeout(delay.current);
  }, [zoomIn]);

  return (
    visible && (
      <div className={classes}>
        <Zoom in={zoomIn}>
          {React.createElement(
            Component,
            {
              onClick: () => {
                window.scrollTo(0, 0);
              },
            },
            <ArrowUpwardRoundedIcon />
          )}
        </Zoom>
      </div>
    )
  );
};

export default GoToTopButton;
