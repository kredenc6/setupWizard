import React, {useEffect} from "react";
import {OutlinedInput} from "@material-ui/core";
import {makeStyles, styled} from "@material-ui/core/styles";
import MenuHeading from "../sharedComponents/MenuHeading";
import { UserInput } from "../../interfaces/interfaces";

interface Props {
    handleFacebookPageChange: <K extends keyof UserInput>(propName: K, value: UserInput[K]) => void;
    setIsNextStepAllowed: React.Dispatch<React.SetStateAction<boolean>>;
    webPage: string | undefined;
};

const styles = {
    menuTopic: {
        "text-align": "center"
    }
};

const FbPageInput = styled(OutlinedInput)({
    width: "80%",
    marginTop: "2rem"
});

const useStyles = makeStyles(styles);

const WizardPageFacebook = ({handleFacebookPageChange, setIsNextStepAllowed, webPage}: Props) => {
    const classes = useStyles();
    const isValueValid = true;

    useEffect(() => {
        setIsNextStepAllowed(isValueValid);
    });

    return (
        <section className={classes.menuTopic}>
            <MenuHeading text="Add the facebook page endpoint:"/>
            <p>www.facebook.com/{webPage}</p>
            <FbPageInput
                autoFocus
                // onChange={(e) => handleFacebookPageChange("facebookPage", e.target.value)}
                placeholder="Add the facebook page here (min. 2 characters)"
                required
                value={webPage}
            />
        </section>
    );
};

export default WizardPageFacebook;
