import React from "react";
import styles from "./container.module.scss";
import { IChildren } from "../layout/Layout";

const Container = ({ children }: IChildren) => {
  return <div className={styles.container}>{children}</div>;
};

export default Container;
