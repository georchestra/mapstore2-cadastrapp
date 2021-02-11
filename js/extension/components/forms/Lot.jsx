import React from 'react';
import DropZone from 'react-dropzone';
import {  ControlLabel, FormControl, Glyphicon } from "react-bootstrap";
import Message from '@mapstore/components/I18N/Message';
const dropZoneStyle = { width: "100%", height: "auto", border: "dashed lightgrey", minHeight: 100, padding: 30 };
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
    // const dropMessage = "Drag and drop the CSV file here or click to select";
    return (<>
        <div className="item-row">
            <div className="label-col">
                <ControlLabel><Message msgId={'cadastrapp.parcelle.lot.title'}/></ControlLabel>
            </div>
            <div className="form-col">
                <FormControl componentClassName="textarea"
                    type="text" bsSize="sm" value={values?.parcelle ?? ""} onChange={v => setParcelle(v.target.value)}/>
                <div className="text-muted"><Message msgId={'cadastrapp.parcelle.lot.example'}/></div>
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
                <ControlLabel><Message msgId={'cadastrapp.parcelle.file.title'}/></ControlLabel>
            </div>
            <div className="form-col" style={{position: 'relative'}}>
                <DropZone
                    accept={["text/csv", "text/plain", ".csv"]}
                    style={dropZoneStyle}
                    activeStyle={dropZoneActiveStyle}
                    multiple={false}
                    onDrop={onDrop}>
                    {fileName ? <span><Glyphicon glyph="remove" onClick={removeFile} /> {fileName} </span> : <Message msgId={'cadastrapp.parcelle.file.example'}/>}
                </DropZone>
                <div
                    style={{ width: "100%", "float": "left" }}
                    className="text-muted"><Message msgId={'cadastrapp.parcelle.file.explanation'}/></div>
            </div>
        </div>
    </>);
}

