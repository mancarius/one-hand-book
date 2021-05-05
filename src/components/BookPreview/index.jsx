import styles from "./styles/index.module.css";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import Cover from "../Book/Cover";
import Price from "../Book/Price";
import { Rating } from "@material-ui/lab";
import base_path from "../../helpers/base_path";


const formatTitle = (str) => {
  // remove #
  const strWithoutHash = str.replace('#', '');
  const kebabCaseStr = _.kebabCase(strWithoutHash).toLowerCase();
  return encodeURI(kebabCaseStr);
}

export default function Item(props) {
  const {
    id,
    title,
    authors,
    imageLinks,
    description,
    averageRating = 0,
    onlyCover,
    coverAndDesc,
    column,
    saleInfo,
  } = props;
  const history = useHistory();
  const link = base_path + `/book/${formatTitle(title)}?volumeID=${id}`;
  const classes =
    styles.item +
    (column ? ` ${styles.column}` : "") +
    (onlyCover ? ` ${styles.only_cover}` : "") +
    (coverAndDesc ? ` ${styles.cover_and_desc}` : "");
  const authorString = authors?.join(", ") ?? "";

  return (
    <li className={classes}>
      <a
        className={styles.link}
        href={link}
        title={title}
        onClick={(e) => {
          e.preventDefault();
          history.push(link);
        }}
      >
        <Cover className={styles.image} title={title} imageLinks={imageLinks} />
        {!onlyCover && !coverAndDesc && (
          <div className={styles.info}>
            <h4 className={styles.title}>
              {title.length > 60 ? `${title.substr(0, 60)}...` : title}
            </h4>
            <small className={styles.author}>
              {authorString.length > 60
                ? `${authorString.substr(0, 60)}...`
                : authorString}
            </small>
            {Boolean(averageRating) && (
              <div className={styles.ratingContainer}>
                <Rating
                  name="read-only"
                  value={averageRating}
                  precision={0.5}
                  readOnly
                  size="small"
                />
              </div>
            )}
            <Price className={styles.price} saleInfo={saleInfo} />
          </div>
        )}
        {coverAndDesc && (
          <p className={styles.description}>{`${description.substr(
            0,
            140
          )}...`}</p>
        )}
      </a>
    </li>
  );
}
