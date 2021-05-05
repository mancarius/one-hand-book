import React, { useContext } from "react";
import { Rating } from "@material-ui/lab";
import { BookContext } from "../../BookContextProvider";
import styles from "./styles/index.module.css";

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

export default function BookInfo(props) {
  const { volume } = useContext(BookContext);
  const title = volume?.volumeInfo?.title;
  const authors =
    volume?.volumeInfo?.authors && volume?.volumeInfo?.authors?.join(", ");
  const publisher = volume?.volumeInfo?.publisher;
  const publishDate = (() => {
    const date = new Date(volume?.volumeInfo?.publishedDate);
    const isDate = isValidDate(date);
    return isDate ? date.getFullYear() : null;
  })();

  const averageRating = volume?.volumeInfo?.averageRating ?? 0;
  const ratingsCount = volume?.volumeInfo?.ratingsCount ?? "0";

  return (
    <>
      <h1 className={styles.title}>{title}</h1>
      <h3 className={styles.author}>{authors}</h3>
      {Boolean(publisher) && (
        <div className={styles.publisher}>
          {publisher + (publishDate && ", " + publishDate)}
        </div>
      )}
      <div className={styles.review}>
        <Rating
          name="read-only"
          value={averageRating}
          precision={0.5}
          readOnly
          size="small"
        />
        <span>
          {" "}
          (<span className="count">{ratingsCount}</span>)
        </span>
      </div>
    </>
  );
}
