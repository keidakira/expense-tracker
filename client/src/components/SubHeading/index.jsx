import React from "react";

import styles from "./style.module.css";

const SubHeading = ({ text, ...props }) => {
  let classes = [styles["sub-heading"]];
  if (props.textCenter) {
    classes.push(styles["text-center"]);
  }

  return <h2 className={classes.join(" ")}>{text}</h2>;
};

export default SubHeading;
