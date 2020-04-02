import React from "react";
import { Typography, Input, TextField } from "@material-ui/core";
import styles from "./menuTopic.module.css"

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const MenuTopic = ({ value, onChange }: Props) => {
  return(
    <section className={styles.topic}>
      <Typography variant="h3" children="What is the app topic?"/>
      {/* <Input
        value={value}
        onChange={ (e) => onChange(e.target.value) }
        autoFocus /> */}
      <TextField
        variant="filled"
        value={value}
        onChange={ (e) => onChange(e.target.value) }
        autoFocus />
    </section>
  );
}

export default MenuTopic;