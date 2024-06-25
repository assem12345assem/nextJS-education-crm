import { baseUrl } from "@/app/config/baseUrl";
import ClassesList from "@/widgets/GroupClassesPage/ClassesList/ClassesList";
import axios from "axios";
import React from "react";

const GroupClasses = ({ classes }: any) => {
  console.log(classes);
  return (
    <div>
      <ClassesList classes={classes} />
    </div>
  );
};

export default GroupClasses;

export const getServerSideProps = async () => {
  try {
    const res = await axios.get(`${baseUrl}group-classes`);
    const classes = res.data.groupClasses;
    return { props: { classes } };
  } catch (e) {
    console.error("failed, e", e);
    return { props: { classes: [] } };
  }
};
