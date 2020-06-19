import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import presetSchemes from "./presetSchemes.json";
import { createSchemeObjFromPresetScheme } from "../../../../../miscellaneous/colorSchemeFunctions";
import { JsonColorScheme } from "../../../../../interfaces/colorSchemeInterfaces";
import { SWActions } from "../../../../../sWReducer/sWReducer";


interface Props {
  dispatch: React.Dispatch<SWActions>;
  selectedScheme: string;
};

const useStyles = makeStyles(({ spacing }) =>
  createStyles({
    presetColorSchemesWrapper: {
      width: "200px",
      margin: `0 ${spacing(1)}px`
    }
  })
);

const findPresetSchemeByName: (name: string) => (JsonColorScheme | undefined) = (name: string) => {
  return presetSchemes.find(presetScheme => presetScheme.name === name);
};

export default function PresetSchemes ({ dispatch, selectedScheme }: Props) {
  const classes = useStyles();

  const handleChange = (e: React.ChangeEvent<{name?: string | undefined; value: unknown;}>) => {
    const schemeName = e.target.value as string;
    const presetScheme = findPresetSchemeByName(schemeName) || presetSchemes[0];
    const newSchemeObj = createSchemeObjFromPresetScheme(presetScheme);
    
    dispatch({ type: "changeUserInput", payload: { schemeObj: newSchemeObj } });
    dispatch({ type: "changeJson", payload: { ui_colors: presetScheme } });
  };
  
  const components = presetSchemes.map((presetSchemeObj) => (
    <MenuItem
      key={presetSchemeObj.name}
      style={{ backgroundColor: presetSchemeObj.primaryColor, color: presetSchemeObj.primaryTextColor }}
      value={presetSchemeObj.name}>{presetSchemeObj.name}
    </MenuItem>
  ));

  return(
    <FormControl className={classes.presetColorSchemesWrapper}>
      <InputLabel id="presetColorSchemes">preset color schemes</InputLabel>
      <Select
        autoWidth
        labelId="presetColorSchemes"
        value={selectedScheme}
        onChange={e => handleChange(e)}
      >
        {components}
        <MenuItem disabled style={{ display: "none" }} value="custom">custom</MenuItem>
      </Select>
    </FormControl>
  );
};