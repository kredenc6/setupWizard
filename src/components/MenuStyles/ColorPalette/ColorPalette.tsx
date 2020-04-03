import React,{ useState, useCallback } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import * as colors from "@material-ui/core/colors";
import PaletteHeading from "../PaletteHeading";
import TableHeadComponent from "./TableHeadComponent";
import TableRowComponent from "./TableRowComponent";

interface Props {
  onClick: (color: string) => void;
};

interface StylesProps {
  headingHeight: string;
  columnCount: string;
}

const styles = createStyles(
  {
    colorPalette: {
      width: "100%"
    },
    table: {
      maxHeight: ({ headingHeight }: StylesProps) => `calc(100vh - 400px - ${headingHeight})`,
      minHeight: "100px",
      width: "100%",
      display: "grid",
      gridTemplateColumns: ({ columnCount }: StylesProps) =>`2fr repeat(${columnCount}, 1fr)`,
      gridGap: "1px",
      fontSize: "12px",
      "overflow-y": "auto"
    },
    tableCell: {
      display: "flex",
      alignItems: "center",
      "&:hover": {
        cursor: "pointer",
        borderRadius: "10px"
      }
    },
    tableColumnHeader: {
      justifyContent: "center",
      padding: ".4rem 0",
      "&:hover": {
        cursor: "auto",
        borderRadius: 0
      }
    },
    tableRowHeader: {
      "&:hover": {
        cursor: "auto",
        borderRadius: 0
      }
    },
    squareEmptyCell: {
      paddingTop: "100%"
    }
  }
);
const useStyles = makeStyles(styles);


const ColorPalette = ({ onClick }: Props) => {
  const [headingHeight, setHeadingHeight] = useState("0px");
  const measuredRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      setHeadingHeight(window.getComputedStyle(node).height);
    }
  }, []);
  const colorShades = Object.keys(colors["red"]); // take shade key names from red color obj(any color obj would do)
  const classes = useStyles(
    {
      headingHeight,
      columnCount: `${colorShades.length}`
    }
  );

  const TableHeadComponents = colorShades.map(shade => {
    return <TableHeadComponent key={`tHead${shade}`} shade={shade} classes={classes} />
  });

  const TableRowComponents = Object.entries(colors).map(([key, value]) => {
    if(key === "common") return null;
    return <TableRowComponent key={key} colorName={key} shades={value} classes={classes} onClick={onClick} />;
  });
  

  return(
    <article className={classes.colorPalette}>
      <PaletteHeading text="color palette" ref={measuredRef} />
      <div className={classes.table}>
        <div className={`${classes.tableCell} ${classes.tableRowHeader}`}></div> {/*upper left corner*/}
        {TableHeadComponents}
        {TableRowComponents}
      </div>
    </article>
  );
};

export default ColorPalette;