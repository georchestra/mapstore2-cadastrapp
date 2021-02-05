import React from 'react';
import DropZone from 'react-dropzone';
import { ControlLabel, Glyphicon } from "react-bootstrap";

const dropZoneStyle = { width: "100%", height: "auto", border: "dashed lightgrey", minHeight: 100, padding: 40 };
const dropZoneActiveStyle = { background: "lightblue", ...dropZoneStyle };

/**
 * This form takes a file with the list of comptecommunal.
 * E.g.
 * ```
 * 350238*02795,350238*03107
 */
export default function Lot({ values = {}, setValue = () => { } }) {
    const onDrop = files => {
        setValue("file", files[0]);
    };
    const removeFile = (event) => {
        setValue("file", undefined);
        event.stopPropagation();
        event.preventDefault();
    };
    const fileName = values.file?.name;
    const dropMessage = "Drag and drop the CSV file here or click to select";
    return (<div className="item-row">
        <div className="label-col">
            <ControlLabel>File</ControlLabel>
        </div>
        <div className="form-col" style={{ position: 'relative' }}>
            <DropZone
                style={dropZoneStyle}
                activeStyle={dropZoneActiveStyle}
                multiple={false}
                accept={["text/csv", "text/plain", ".csv"]}
                onDrop={onDrop}>
                {fileName ? <span><Glyphicon glyph="remove" onClick={removeFile} /> {fileName} </span> : dropMessage}
            </DropZone>
            <div
                style={{ width: "100%", "float": "left" }}
                className="text-muted">This file must contains comptecommunal id list separate by space or comma</div>
        </div>
    </div>);
}