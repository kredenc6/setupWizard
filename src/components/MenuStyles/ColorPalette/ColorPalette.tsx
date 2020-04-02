import React,{ useState, useCallback } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import * as colors from "@material-ui/core/colors";
import PaletteHeading from "../PaletteHeading";

interface Classes {
  [propName: string]: string;
};

interface Shades {
  [propName: string]: string;
};

interface Props {
  onClick: (color: string) => void;
};

const styles = createStyles(
  {
    colorPalette: {
      width: "100%"
    },
    table: ({ headingHeight }: { headingHeight: string; }) => {
      return {
        maxHeight: `calc(100vh - 400px - ${headingHeight})`,
        minHeight: "100px",
        width: "100%",
        fontSize: "12px",
        backgroundColor: "#fff",
        "overflow-y": "scroll"
      };
    },
    tableRow: {
      display: "flex",
    },
    tableCell: {
      width: "35px",
      height: "35px",
      display: "flex",
      flexFlow: "row wrap",
      justifyContent: "center",
      alignItems: "center",
      margin: "0 1px 1px 0",
      "&:hover": {
        cursor: "pointer",
        borderRadius: "10px"
      }
    },
    tableColumnHeader: {
      "&:hover": {
        cursor: "auto",
        borderRadius: 0
      }
    },
    tableRowHeader: {
      width: "70px",
      justifyContent: "flex-start",
      "&:hover": {
        cursor: "auto",
        borderRadius: 0
      }
    }
  }
);

const useStyles = makeStyles(styles);


const createTableRow = (colorName: string, shades: Shades, classes: Classes, onClick: Props["onClick"]) => {
  const TableCellComponents: JSX.Element[] = [];
  for(const [key, value] of Object.entries(shades)) {
    //skip repeating colors
    if(["brown", "grey", "blueGrey"].includes(colorName) && ["A100", "A200", "A400", "A700"].includes(key)) {
      continue;
    }
    TableCellComponents.push(createColorTableCell(colorName, value, classes, onClick));
  }
  return(
    <div key={`${colorName}TableRow`} className={classes.tableRow}>
      <div className={`${classes.tableCell} ${classes.tableRowHeader}`}>{colorName}</div>
      {TableCellComponents}
    </div>
  );
};

const createColorTableCell = (colorName: string, color: string, classes: Classes, onClick: Props["onClick"]) => {
  return(
    <div
      key={colorName + color}
      className={classes.tableCell}
      style={{ backgroundColor: color }}
      onClick={() => onClick(color)}
    >
    </div>
  );
};

const ColorPalette = ({ onClick }: Props) => {
  const [headingHeight, setHeadingHeight] = useState("0px");
  // let headingHeight = "70px";
  const measuredRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      setHeadingHeight(window.getComputedStyle(node).height);
    }
  }, []);
  const classes = useStyles({ headingHeight });

  const colorShades = Object.keys(colors["red"]); // take shade key names from red color obj(any color obj would do)
  const TableHeadComponents = colorShades.map(shade => {
    return <div key={`tHead${shade}`} className={`${classes.tableCell} ${classes.tableColumnHeader}`}>{shade}</div>;
  });

  const TableRowComponents = Object.entries(colors).map(([key, value]) => {
    if(key === "common") return null;
    return createTableRow(key, value, classes, onClick);
  });


  return(
    <article>
      <PaletteHeading text="color palette" ref={measuredRef} />
      <div className={classes.table}>
        <div className={classes.tableRow}>
          <div className={`${classes.tableCell} ${classes.tableRowHeader}`}></div> {/* upper left corner */}
          {TableHeadComponents}
        </div>
        {TableRowComponents}
      </div>
    </article>
  );
};

export default ColorPalette;