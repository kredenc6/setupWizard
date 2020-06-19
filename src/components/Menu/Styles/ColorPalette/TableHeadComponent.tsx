import React from "react";
import { Classes } from "../../../../interfaces/variousInterfaces";


interface Props {
  classes: Classes;
  shade: string;
};

const TableHeadComponents = ({ classes, shade }: Props) => {
  return(
    <div key={`tHead${shade}`} className={`${classes.tableCell} ${classes.tableColumnHeader}`}>
      {shade}
    </div>
  );
};

export default TableHeadComponents;