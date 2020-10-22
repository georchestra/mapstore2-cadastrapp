import React from 'react';
import {
    Button,
    Tooltip,
    OverlayTrigger
} from "react-bootstrap";

export default function MainToolbar(props) {
    // following array values are
    // 0: glyphicon
    // 1: action name
    // 2: tooltip text
    let toolbarOptions = [
        ["resize-full", "zoom", "Zoom to whole selection"],
        ["map-marker", "select-by-point", "Select / Activate / Unselect one plot with a simple click "],
        ["polyline", "select-by-linestring", "Select / Activate / Unselect plots which intersects a line"],
        ["polygon", "select-by-polygon", "Select / Activate / Unselect plots which intersects a polygon"],
        ["th-list", "unit-de-fonc", "Landed property information"],
        ["zoom-to", "search-plots", "Plots Search"],
        ["search", "search-owners", "Owners Search"],
        ["user", "coownership", "Co-ownership data Search"],
        ["features-grid", "request-form", "Request on landholding trust"],
        ["cog", "preferences", "Preferences"],
        ["question-sign", "help", "Help"]
    ];

    let clickHandler = (action) => {
        return () => {
            props.onClick(action);
        };
    };

    let tooltipGenerator = (text) => {
        return <Tooltip id="tooltip">{text}</Tooltip>;
    };

    return (
        <div className="side-bar pull-left">
            {toolbarOptions.map((v) => (
                <OverlayTrigger placement="left" overlay={tooltipGenerator(v[2])}>
                    <Button
                        onClick={clickHandler(v[1])}
                        bsStyle="primary"
                        className={props.selected === v[1] ? "square-button btn-selected" : "square-button"}>
                        <span className={"glyphicon glyphicon-" + v[0]}></span>
                    </Button>
                </OverlayTrigger>
            ))}
        </div>
    );
}
