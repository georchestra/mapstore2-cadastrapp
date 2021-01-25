import React from 'react';
import {
    Button,
    Radio,
    FormGroup
} from "react-bootstrap";

export default function PropertyListRadio(props) {

    let className = props.isShown ? "" : "collapse";

    return (
        <div className={className}>
            <hr></hr>
            <div
                style={{ width: "70%" }}
                className="pull-left">
                <FormGroup>
                    <b style={{ "float": "left", width: 150, marginRight: 15 }}>Data to extract: </b>
                    <Radio name="radioGroup" inline>
                        Only this plot
                    </Radio>
                    <Radio name="radioGroup" inline>
                        All Properties
                    </Radio>
                </FormGroup>
                <FormGroup>
                    <b style={{ "float": "left", width: 150, marginRight: 15 }}>Choose output format:</b>
                    <Radio name="radioGroup" inline>
                        Export as PDF
                    </Radio>
                    <Radio name="radioGroup" inline>
                        Export as CSV
                    </Radio>
                </FormGroup>
            </div>
            <div
                style={{ width: "30%" }}
                className="pull-left">
                <Button
                    className="pull-right">Cadastrapp.generate</Button>
            </div>
            <hr></hr>
        </div>);
}