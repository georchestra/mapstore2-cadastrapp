import React from 'react';
import DropZone from 'react-dropzone';
import {  ControlLabel, FormControl, Glyphicon } from "react-bootstrap";

const dropZoneStyle = { width: "100%", height: "auto", border: "dashed lightgrey" };
const dropZoneActiveStyle = { background: "lightblue", ...dropZoneStyle };

export default function Lot({ values = {}, setValue = () => {}}) {
    const onDrop = files => {
        setValue('parcelle', undefined); // mutual exclusion
        setValue("file", files[0]);
    };
    const removeFile = (event) => {
        setValue("file", undefined);
        event.stopPropagation();
        event.preventDefault();
    };
    const setParcelle = (parcelle) => {
        setValue("file", undefined); // mutual exclusion
        setValue('parcelle', parcelle);
    };
    const fileName = values.file?.name;
    const dropMessage = "Drag and drop the CSV file here or click to select";
    return (<>
        <div className="item-row">
            <div className="label-col">
                <ControlLabel>Identifiers</ControlLabel>
            </div>
            <div className="form-col">
                <FormControl componentClassName="textarea"
                    type="text" bsSize="sm" value={values?.parcelle ?? ""} onChange={v => setParcelle(v.target.value)}/>
                <div className="text-muted">ex. 20148301032610C0012, 20148301032610C0013, 20148301032610C0014</div>
            </div>
        </div>

        <div className="item-row">
            <div className="label-col">
                <ControlLabel/>
            </div>
            <div className="form-col">
                <div style={{ textAlign: "center" }} className="text-muted">or</div>
            </div>
        </div>

        <div className="item-row">
            <div className="label-col">
                <ControlLabel>File</ControlLabel>
            </div>
            <div className="form-col" style={{position: 'relative'}}>
                <DropZone
                    accept={["text/csv", "text/plain", ".csv"]}
                    style={dropZoneStyle}
                    activeStyle={dropZoneActiveStyle}
                    multiple={false}
                    onDrop={onDrop}>
                    {fileName ? <span><Glyphicon glyph="remove" onClick={removeFile} /> {fileName} </span> : dropMessage}
                </DropZone>
                <div
                    style={{ width: "100%", "float": "left" }}
                    className="text-muted">This file must contains comptecommunal id list separate by space or coma</div>
            </div>
        </div>
    </>);
}

