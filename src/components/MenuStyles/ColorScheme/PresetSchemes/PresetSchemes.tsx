import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import { createStyles, makeStyles, useTheme, Theme } from "@material-ui/core/styles";
import presetSchemes from "./presetSchemes.json";
import { createSchemeObjFromPresetScheme } from "../../../../miscellaneous/createScheme";
import { PresetScheme, UserInput } from "../../../../interfaces/interfaces";

interface Props {
  handleSchemeChange: <K extends keyof UserInput>(propName: K, value: UserInput[K]) => void;
  selectedScheme: string;
  setSelectedScheme: React.Dispatch<React.SetStateAction<string>>;
};

const styles = (theme: Theme) => createStyles({
  presetColorSchemesWrapper: {
    width: "200px",
    margin: `0 ${theme.spacing(1)}px`
  },
  presetColorSchemesSelect: {
  }
});
const useStyles = makeStyles((theme: Theme) => styles(theme));

const findPresetSchemeByName: (name: string) => (PresetScheme | undefined) = (name: string) => {
  return presetSchemes.find(presetScheme => presetScheme.name === name);
};

const PresetSchemes = ({ handleSchemeChange, selectedScheme, setSelectedScheme }: Props) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const getContrastText = theme.palette.getContrastText;
  
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
        className={classes.presetColorSchemesSelect}
        labelId="presetColorSchemes"
        value={selectedScheme}
        onChange={e => {
          const newSchemeObj = createSchemeObjFromPresetScheme(
            findPresetSchemeByName(e.target.value as string) || presetSchemes[0],
            getContrastText
          );
          setSelectedScheme(e.target.value as string);
          handleSchemeChange("schemeObj", newSchemeObj);
        }}
      >
        {components}
        <MenuItem disabled style={{ display: "none" }} value="custom">custom</MenuItem>
      </Select>
    </FormControl>
  );
};

export default PresetSchemes;