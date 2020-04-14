import React, { useEffect } from "react";
import { OutlinedInput } from "@material-ui/core";
import { makeStyles, styled } from "@material-ui/core/styles";
import MenuHeading from "../sharedComponents/MenuHeading";
import { UserInput } from "../../interfaces/interfaces";

interface Props {
    initialTextFieldValue: string;
    handleVideoQueryChange: <K extends keyof UserInput>(propName: K, value: UserInput[K]) => void;
    setIsNextStepAllowed: React.Dispatch<React.SetStateAction<boolean>>;
    videoQuery: string;
};

const styles = {
    menuTopic: {
        "text-align": "center"
    }
};

const BooksPageInput = styled(OutlinedInput)({
    width: "80%",
    marginTop: "2rem"
});

const useStyles = makeStyles(styles);

const WizardPageVideo = ({initialTextFieldValue, handleVideoQueryChange, setIsNextStepAllowed, videoQuery}: Props) => {
    const classes = useStyles();
    const isValueValid = videoQuery.trim().length >= 2;

    useEffect(() => {
      setIsNextStepAllowed(isValueValid);
    });

    return (
        <section className={classes.menuTopic}>
            <MenuHeading text="Add the query for Youtube:"/>
            <BooksPageInput
                autoFocus
                // onChange={(e) => handleVideoQueryChange("videoQuery", e.target.value)}
                placeholder="Add the query string for books here (min. 2 characters)"
                required
                value={videoQuery.length > 0 ? videoQuery : initialTextFieldValue}
            />
        </section>
    );
};

export default WizardPageVideo;