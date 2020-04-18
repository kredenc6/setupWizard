import React,{ useState } from "react";
import { AppBar, Box, Checkbox, FormControlLabel, Tab, Tabs, TextField, Typography, withStyles } from "@material-ui/core";
import { AudioItem, BookItem, JsonResultObj, VideoItem } from "../../../interfaces/interfaces";

type MediumItemArr = (AudioItem | BookItem | VideoItem)[];
type MediumItem = AudioItem | BookItem | VideoItem;

interface Props {
  appTopic: string;
  jsonObj: JsonResultObj;
  medium: "audio" | "books" | "videos";
  setJsonObj: React.Dispatch<React.SetStateAction<JsonResultObj>>;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      // id={`nav-tabpanel-${index}`}
      // aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

const StyledTextField = withStyles(({ spacing }) => ({
  root: {
    // width: "80%",
    marginTop: spacing(2)
  }
}))(TextField);

const Medium = ({ appTopic, jsonObj, medium, setJsonObj }: Props) => {
  const [tabPosition, setTabPosition] = useState(0);

  // const createTextFieldComponents = (mediumItem: MediumItem) => {
  //   return entries.map(([key, value]) => {
  //     if(typeof value === "string" || Array.isArray(value)) {
  //       return <StyledTextField variant="outlined" key={String(key)} label={String(key)} name={String(key)} />
  //     }
  //     if(typeof value === "boolean") {
  //       return(
  //         <FormControlLabel
  //           control={
  //             <Checkbox
  //               checked={value}
  //               name={String(key)}
  //               onChange={e => {
  //                 const checked = e.target.checked;
  //                 setJsonObj(prevJson => {
  //                   let changedItem = prevJson[medium][mediumItemIndex] as V;
  //                   test[key] = checked;
  //                   return test;
  //                   // let itemToChange = prevJson[medium].splice(i, 1)[0];
  //                   // itemToChange[key] = checked;
  //                   // return { ...prevJson, [medium]: mediumCopy };
  //                   // return newJson;
  //                   // const jen = test(prevJson[medium][i], key, checked);

  //                   // function test<T, K extends keyof T>(obj: T, key: K, newValue: any) {
  //                   //   obj[key] = newValue;
  //                   //   return obj;
  //                   // }
  //                 });
  //               }}
  //             />
  //           }
  //           key={String(key)}
  //           label={String(key)}
  //         />
  //         );
  //       };
  //     return null;
  //   });
  // };
  const createTextFieldComponents = (mediumItem: MediumItem, MediumItemIndex: number) => {
    return Object.entries(mediumItem).map(([key, value]) => {
      if(typeof value === "string" || Array.isArray(value)) {
        return <StyledTextField variant="outlined" key={key} label={key} name={key} />
      }
      if(typeof value === "boolean") {
        return(
          <FormControlLabel
            control={
              <Checkbox
                checked={value}
                key={`checkbox${key}`}
                name={key}
                onChange={e => {
                  const newChecked = e.target.checked;
                  setJsonObj(prevJson => {
                    // const assertKeyToObj = <K extends keyof V, V>(obj: V, key: string) => key as K;
                    // const mediumKey = assertKeyToObj(prevJson[medium][MediumItemIndex], key)
                    // prevJson[medium][MediumItemIndex][mediumKey] = newChecked;
                    //@ts-ignore
                    prevJson[medium][MediumItemIndex][key] = newChecked;
                    console.dir(prevJson);
                    return prevJson;
                  });
                }}
              />
            }
            key={key}
            label={key}
          />
          );
        };
      return null;
    });
  };

  let TabComponents: (JSX.Element | null)[] = [];
  let TabPanelComponents: (JSX.Element | null)[] = [];
  jsonObj[medium].forEach((value: MediumItem, i: number) => {
    TabComponents.push(<Tab key={`Tab${value["source"]}`} label={value["source"]} />);

    const TextFieldComponents = createTextFieldComponents(value, i);
    TabPanelComponents.push(
      <TabPanel index={i} key={`TabPanel${value["source"]}`} value={tabPosition}>
        {TextFieldComponents}
      </TabPanel>
    );
  });
  
  return(
    <div>
      <AppBar position="static">
        <Tabs value={tabPosition} onChange={(_, newValue: number) => setTabPosition(newValue)}>
          {TabComponents}
        </Tabs>
      </AppBar>
      {TabPanelComponents}
    </div>
  );
};

export default Medium;