import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import * as colors from "@material-ui/core/colors";
import SimpleBar from "simplebar-react";
import TableHeadComponent from "./TableHeadComponent";
import TableRowComponent from "./TableRowComponent";
import "simplebar/dist/simplebar.min.css";

interface Props {
  activeColor: string;
  onClick: (color: string) => void;
};

interface StylesProps {
  columnCount: number;
};

const useStyles = makeStyles(
  createStyles(
    {
      simplebar: {
        minHeight: "100%"
      },
      paletteWrapper: {
        paddingRight: "10px"
      },
      table: {
        display: "grid",
        gridTemplateColumns: ({ columnCount }: StylesProps) =>`2fr repeat(${columnCount}, 1fr)`,
        gridGap: "1px",
        fontSize: "12px"
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
      },
      activeColor: {
        borderRadius: "50%",
        "&:hover": {
          borderRadius: "50%"
        }
      }
    }
));


export default function ColorPalette({ activeColor, onClick }: Props) {
  const colorShades = Object.keys(colors["red"]); // take shade key names from red color obj(any color obj would do)
  const classes = useStyles({ columnCount: colorShades.length });

  const TableHeadComponents = colorShades.map(shade => {
    return <TableHeadComponent key={`tHead${shade}`} shade={shade} classes={classes} />
  });

  const TableRowComponents = Object.entries(colors).map(([key, value]) => {
    if(key === "common") return null;
    return <TableRowComponent activeColor={activeColor} key={key} colorName={key} shades={value} classes={classes} onClick={onClick} />;
  });

  return(
    <SimpleBar className={classes.simplebar}>
      <article className={classes.paletteWrapper}>
        <div className={classes.table}>
          <div className={`${classes.tableCell} ${classes.tableRowHeader}`}></div> {/*upper left corner*/}
          {TableHeadComponents}
          {TableRowComponents}
        </div>
      </article>
    </SimpleBar>
  );
};
