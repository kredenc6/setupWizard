import React, { useEffect, useState } from "react";
import { AppBar, Box, Tab, Tabs, Typography } from "@material-ui/core";
import ObjectDataComponent from "../ObjectDataComponent/ObjectDataComponent";
import { JsonObjModule, Module } from "../../../interfaces/interfaces";

interface Props {
  dataArr: any[];
  handleJsonChange: (changedModule: JsonObjModule) => void;
  isVerificationEnabled: boolean;
  moduleSettings: Module | undefined;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
};

const TabPanel= (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
};

const determineLabel = (obj: any, i: number, keysToLabels: string[]) => {
  for(const key of keysToLabels) {
    if(obj[key]) return obj[key] as string;
  }
  return `index ${i}`;
};

const ArrayDataComponent = ({ dataArr, handleJsonChange, isVerificationEnabled, moduleSettings }: Props) => {
  const [tabPosition, setTabPosition] = useState(0);

  let TabComponents: (JSX.Element | null)[] = [];
  let TabPanelComponents: (JSX.Element | null)[] = [];
  dataArr.forEach((dataItem, i) => {
    const KEYS_TO_LABELS = ["source", "channel_name"];
    const label = determineLabel(dataItem, i, KEYS_TO_LABELS);
    
    const handleJsonObjChange = (dataObj: object, key: string, value: any) => {
      const updatedArr = dataArr.map((arrValue, arrIndex) => {
        if(i === arrIndex) return { ...dataObj, [key]: value };
        return arrValue;
      });
      handleJsonChange(updatedArr);
    };
    
    TabComponents.push( <Tab key={`Tab${label}`} label={label} /> );
    TabPanelComponents.push(
      <TabPanel index={i} key={`TabPanel${label}`} value={tabPosition}>
        <ObjectDataComponent
          dataObj={dataItem}
          handleJsonObjChange={handleJsonObjChange}
          prefixIndex={i}
          isVerificationEnabled={isVerificationEnabled}
          moduleSettings={moduleSettings}
          skipProperties={KEYS_TO_LABELS} />
      </TabPanel>
    );
  });

  useEffect(() => {
    if(dataArr[tabPosition] === undefined) setTabPosition(0);
  },[dataArr, tabPosition]);

  return(
    <div>
      <AppBar position="static" style={{ borderRadius: "10px" }}>
        <Tabs onChange={(_, newValue: number) => setTabPosition(newValue)} value={tabPosition} variant="fullWidth" >
          {TabComponents}
        </Tabs>
      </AppBar>
      {TabPanelComponents}
    </div>
  );
};

export default ArrayDataComponent;