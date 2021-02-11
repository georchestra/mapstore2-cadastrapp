import React from 'react';
import {
    Glyphicon
} from "react-bootstrap";
import Message from '@mapstore/components/I18N/Message';

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
            <h3 style={{ marginLeft: "0px", marginTop: "20px" }}><Message msgId={'cadastrapp.title'}/></h3>
            <h4 style={{ marginLeft: "0px", marginTop: "20px" }}><Message msgId={'cadastrapp.selectTool'}/></h4>
        </div>
    );
}
