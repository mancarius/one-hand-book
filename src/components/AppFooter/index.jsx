import React from "react";
import AppLogo from "../AppLogo";
import { Link } from "@material-ui/core";
import styles from "./styles/index.module.css";

function AppFooter() {
  return (
    <>
      <footer className={styles.footer}>
        <h2 className={styles.logo}>
          <AppLogo />
          <small>
            powered by{" "}
            <Link href="https://developers.google.com/books">
              Google Books Api
            </Link>
          </small>
        </h2>
        <p>
          This is a react case study for <Link href="//start2impact.it">Start2Impact</Link> developed by{" "}
          <Link href="//www.mattiamancarella.com">Mattia Mancarella</Link>.
        </p>
      </footer>
    </>
  );
}

export default AppFooter;
