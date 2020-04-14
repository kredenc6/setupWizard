import React, { useEffect } from "react";
import { OutlinedInput } from "@material-ui/core";
import { makeStyles, styled } from "@material-ui/core/styles";
import MenuHeading from "../sharedComponents/MenuHeading";
import { UserInput } from "../../interfaces/interfaces";

interface Props {
    handleBooksQueryChange: <K extends keyof UserInput>(propName: K, value: UserInput[K]) => void;
    setIsNextStepAllowed: React.Dispatch<React.SetStateAction<boolean>>;
    booksQuery: string;
    initialTextFieldValue: string;
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

const WizardPageBooks = ({initialTextFieldValue, handleBooksQueryChange, setIsNextStepAllowed, booksQuery}: Props) => {
    const classes = useStyles();
    const isValueValid = true;

    useEffect(() => {
        setIsNextStepAllowed(isValueValid);
    });

    return (
        <section className={classes.menuTopic}>
            <MenuHeading text="Add the query for books:"/>
            <BooksPageInput
                autoFocus
                // onChange={(e) => handleBooksQueryChange("booksQuery", e.target.value)}
                placeholder="Add the query string for books here (min. 2 characters)"
                required
                value={booksQuery.length > 0 ? booksQuery : initialTextFieldValue}
            />
        </section>
    );
};

export default WizardPageBooks;