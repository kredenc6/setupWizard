import React from "react";
import { Classes } from "../../../interfaces/interfaces";

interface Shades {
  [propName: string]: string;
};

interface Props {
  colorName: string;
  classes: Classes;
  shades: Shades;
  onClick: (color: string) => void;
};

const createTableRow = (colorName: string, shades: Shades, classes: Classes, onClick: Props["onClick"]) => {
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

const TableRowComponent = ({ colorName, shades, classes, onClick }: Props) => {
  return createTableRow(colorName, shades, classes, onClick);
};

export default TableRowComponent;