import React, { useContext } from "react";
import { BookContext } from "../../BookContextProvider";
import styles from './styles/index.module.css'

export default function BookBibliography(props) {
  const { volume } = useContext(BookContext);
  const title = volume?.volumeInfo?.title;
  const authors =
    volume?.volumeInfo?.authors &&
    volume?.volumeInfo?.authors?.join(", ");
  const publisher = volume?.volumeInfo?.publisher &&
    volume?.volumeInfo?.publisher +
    ", " +
    volume?.volumeInfo?.publishedDate?.split(" - ")[0];
  const genre =
    volume?.volumeInfo?.mainCategory ??
    volume?.volumeInfo?.categories?.join(' - ') ??
    "General";
  const isbn = volume?.volumeInfo?.industryIdentifiers
    ?.map((i) => i.identifier)
    .join(", ");
  const pageCount = volume?.volumeInfo?.pageCount;

  return (
      <dl className={styles.list_group}>
        <ListItem title="Title" value={title} />
        <ListItem title="Genre" value={genre} />
        <ListItem title="Authors" value={authors} />
        <ListItem title="Publisher" value={publisher} />
        <ListItem title="ISBN" value={isbn} />
        <ListItem title="Lenght" value={pageCount + " pages"} />
      </dl>
  );
}

function ListItem(props) {
  const { title, value } = props;
  return Boolean(value) && (
    <>
      <dt>{title}</dt>
      <dd>{value}</dd>
    </>
  );
}
