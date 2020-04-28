import React from "react";
import { Classes } from "../../../interfaces/interfaces";

interface Shades {
  [propName: string]: string;
};

interface Props {
  activeColor: string;
  classes: Classes;
  colorName: string;
  onClick: (color: string) => void;
  shades: Shades;
};

const TableRowComponent = (props: Props) => {
  return createTableRow(props);
};

export default TableRowComponent;


function createTableRow({ activeColor, classes, colorName, onClick, shades }: Props) {
  const TableCellComponents: JSX.Element[] = [];
  for(const [key, value] of Object.entries(shades)) {
    //fill repeating colors...
    if(["brown", "grey", "blueGrey"].includes(colorName) && ["A100", "A200", "A400", "A700"].includes(key)) {
      TableCellComponents.push(<div key={`${colorName}${key}`}></div>); // ... with empty cells
      continue;
    }
    TableCellComponents.push( createColorTableCell(colorName, value, classes, onClick, activeColor) );
  }

  return(
    <React.Fragment key={`${colorName}TableRow`}>
      <div className={`${classes.tableRowHeader} ${classes.tableCell}`}>{colorName}</div> {/*row header*/}
      {TableCellComponents}
    </React.Fragment>
  );
};

function createColorTableCell(colorName: string, background: string, classes: Classes, onClick: Props["onClick"],
  activeColor: string) {
  return(
    <div
      key={colorName + background}
      className={`${classes.squareEmptyCell} ${classes.tableCell} ${isActiveColor(activeColor, background) ? classes.activeColor : ""}`}
      style={{ backgroundColor: background }}
      onClick={() => onClick(background)}
    >
    </div>
  );
};

function isActiveColor(activeColor: string, paletteColor: string) {
  return activeColor === paletteColor;
}