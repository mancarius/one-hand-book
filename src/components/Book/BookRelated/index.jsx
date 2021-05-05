import React, { useContext } from "react";
import { BookContext } from "../../BookContextProvider";
import { List } from "@material-ui/core";
import ExploreLink from "../ExploreLink";

export default function BookRelated(props) {
  const { volume } = useContext(BookContext);

  return (
    <List component="nav">
      {volume?.volumeInfo?.authors?.map((author, index) => (
        <ExploreLink
          key={index}
          item={author}
          folder="inauthor"
          secondary="Author"
        >
          More by{" "}
        </ExploreLink>
      ))}
      <ExploreLink
        item={volume?.volumeInfo?.publisher}
        folder="inpublisher"
        secondary="Publisher"
      >
        More by{" "}
      </ExploreLink>
    </List>
  );
}
