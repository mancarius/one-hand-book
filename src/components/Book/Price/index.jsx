import React from "react";
import styles from "./styles/index.module.css";

export default function Price(props) {
  const { saleInfo, className: classes } = props;
  const price = saleInfo?.retailPrice?.amount ?? 0;
  const currency = (() => {
    let code = saleInfo?.retailPrice?.currencyCode ?? null;
    switch (code) {
      case "EUR":
        return "€";
      case "USD":
        return "$";
      case "GBP":
        return "£";
      default:
        return code;
    }
  })();

  return (
    <>
      {saleInfo?.saleability === "FOR_SALE" && (
        <span className={styles.price + " " + classes}>
          {String(price).replace(".", ",") + " " + currency}
        </span>
      )}
    </>
  );
}
