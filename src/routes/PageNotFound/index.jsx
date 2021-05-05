/* eslint-disable import/no-anonymous-default-export */
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import image from "../../assets/18330.webp";
import Search from "../../components/GoogleBooksSearchField";
import actions from "../../redux/actions";
import styles from "./styles/index.module.css";

export default function (props) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.document.loading.stop());
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <img
        src={image}
        alt="Error 404 - Page not found"
        className={styles.image}
      />
      <h1 className={styles.title}>Ops!</h1>
      <h3>Content not found</h3>
      <div className={styles.search_box}>
        <Search placeholder="For what are you looking for?" />
      </div>
    </div>
  );
}
