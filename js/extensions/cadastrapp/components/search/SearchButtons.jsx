import React from 'react';
import { ButtonGroup, Button} from "react-bootstrap";

export default function SearchButtons(props) {
    return (
        <ButtonGroup style={{ margin: "10px", "float": "right" }}>
            <Button>Clear</Button>
            <Button
                bsStyle="primary"
                onClick={props.onSearch}
            >Search</Button>
        </ButtonGroup>
    );
}
