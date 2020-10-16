import React from 'react';


export default function CustomCheckbox(props) {

    const OUTER = 15;
    const INNER = 7;
    const SPACE = 3;
    let outerStyle;
    let innerStyle;

    if (props.selected) {
        outerStyle = {
            marginTop: SPACE,
            width: OUTER,
            height: OUTER,
            background: "#fff",
            border: "solid 1px #078aa3"
        };
        innerStyle = {
            width: INNER, height: INNER, background: "#078aa3", margin: SPACE
        };
    } else {
        outerStyle = {
            marginTop: SPACE,
            width: OUTER,
            height: OUTER,
            background: "#fff",
            border: "solid 1px #ddd"
        };
        innerStyle = {
            width: INNER, height: INNER, background: "#fff", margin: SPACE
        };
    }

    return (
        <div
            onClick={props.onCheckClick}
            style={outerStyle}>
            <div style={innerStyle}></div>
        </div>
    );
}
