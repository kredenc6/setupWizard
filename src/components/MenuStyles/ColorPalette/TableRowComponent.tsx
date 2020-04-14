import React from "react";
import { Classes } from "../../../interfaces/interfaces";

interface Shades {
  [propName: string]: string;
};

interface Props {
  classes: Classes;
  colorName: string;
  onClick: (color: string) => void;
  shades: Shades;
};

const createTableRow = ({ classes, colorName, onClick, shades }: Props) => {
  const TableCellComponents: JSX.Element[] = [];
  for(const [key, value] of Object.entries(shades)) {
    //skip repeating colors
    if(["brown", "grey", "blueGrey"].includes(colorName) && ["A100", "A200", "A400", "A700"].includes(key)) {
      TableCellComponents.push(<div key={`${colorName}${key}`}></div>); // empty cell
      continue;
    }
    TableCellComponents.push(createColorTableCell(colorName, value, classes, onClick));
  }

  return(
    <React.Fragment key={`${colorName}TableRow`}>
      <div className={`${classes.tableRowHeader} ${classes.tableCell}`}>{colorName}</div> {/*row header*/}
      {TableCellComponents}
    </React.Fragment>
  );
};

const createColorTableCell = (colorName: string, background: string, classes: Classes, onClick: Props["onClick"]) => {
  return(
    <div
      key={colorName + background}
      className={`${classes.squareEmptyCell} ${classes.tableCell}`}
      style={{ backgroundColor: background }}
      onClick={() => onClick(background)}
    >
    </div>
  );
};

const TableRowComponent = (props: Props) => {
  return createTableRow(props);
};

export default TableRowComponent;