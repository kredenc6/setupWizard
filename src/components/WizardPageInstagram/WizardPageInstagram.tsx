import React, {useEffect} from "react";
import {OutlinedInput} from "@material-ui/core";
import {makeStyles, styled} from "@material-ui/core/styles";
import MenuHeading from "../sharedComponents/MenuHeading";
import { UserInput } from "../../interfaces/interfaces";

interface Props {
    handleInstagramPageChange: <K extends keyof UserInput>(propName: K, value: UserInput[K]) => void;
    setIsNextStepAllowed: React.Dispatch<React.SetStateAction<boolean>>;
    webPage: string | undefined;
};

const styles = {
    menuTopic: {
        "text-align": "center"
    }
};

const InstagramPageInput = styled(OutlinedInput)({
    width: "80%",
    marginTop: "2rem"
});

const useStyles = makeStyles(styles);

const WizardPageInstagram = ({handleInstagramPageChange, setIsNextStepAllowed, webPage}: Props) => {
    const classes = useStyles();
    const isValueValid = webPage ? webPage.trim().length >= 2 : false;

    useEffect(() => {
        setIsNextStepAllowed(isValueValid);
    });

    return (
        <section className={classes.menuTopic}>
            <MenuHeading text="Add the instagram channel:"/>
            <p>www.instagram.com/{webPage}</p>
            <InstagramPageInput
                autoFocus
                // onChange={(e) => handleInstagramPageChange("instagramPage", e.target.value)}
                placeholder="Add the instagram channel here (min. 2 characters)"
                required
                value={webPage}
            />
        </section>
    );
};

export default WizardPageInstagram;