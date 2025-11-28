// Imports

"use client";
import styles from "./page.module.css";

// Exports

export default function Home() {
  return (
    <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["pd-all-round"]}`}>
      <h1>Hello World</h1>
    </div>
  );
}
