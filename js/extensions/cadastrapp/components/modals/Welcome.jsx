import React from 'react';
import {
    Glyphicon
} from "react-bootstrap";

export default function WelcomeMessage(props) {
    let className = props.isShown ? "welcome-message" : "collapse";
    if (props.data.length > 0) {
        className = "collapse";
    }


    return (
        <div className={className} style={{ textAlign: "center" }}>
            <Glyphicon glyph="search-coords"
                style={{
                    margin: "0px",
                    fontSize: "36px"
                }}/>
            <h3 style={{ marginLeft: "0px", marginTop: "20px" }}>Cadastrapp</h3>
            <h4 style={{ marginLeft: "0px", marginTop: "20px" }}>Select desired tool in the left side toolbar to start</h4>
        </div>
    );
}
