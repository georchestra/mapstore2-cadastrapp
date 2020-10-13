import React from 'react';
import { Tabs, Tab, Button, ControlLabel, FormControl, Glyphicon } from "react-bootstrap";
import Select from 'react-select';

import ReferencesList from '../lists/ReferencesList';
import SearchButtons from './SearchButtons';


export default function PlotsSearch(props) {
    const unitOptions = [
        { value: '--', label: '--' },
        { value: 'bis', label: 'bis' },
        { value: 'ter', label: 'ter' },
        { value: 'quater', label: 'quater' },
        { value: 'A', label: 'A' },
        { value: 'B', label: 'B' },
        { value: 'C', label: 'C' },
        { value: 'D', label: 'D' },
        { value: 'E', label: 'E' },
        { value: 'F', label: 'F' },
        { value: 'G', label: 'G' },
        { value: 'H', label: 'H' }
    ];

    const className = props.isShown ? "plots-search" : "collapse";
    return (
        <div className={className}>
            <h3>Plots Search</h3>
            <Tabs
                className="not-scrolled-tab"
                defaultActiveKey={1}>
                <Tab eventKey={1} title="Reference">
                    <div className="item-row">
                        <div className="label-col">
                            <ControlLabel>Town, Municipality</ControlLabel>
                        </div>
                        <div className="form-col">
                            <Select/>
                            <div className="text-muted">ex. Rennes, Cesson-Sévigné</div>
                        </div>
                    </div>
                    <div className="item-row">
                        <div className="label-col">
                            <ControlLabel>Reference(s)</ControlLabel>
                        </div>
                        <div className="form-col">
                            <ReferencesList/>
                        </div>
                    </div>
                </Tab>
                <Tab eventKey={2} title="Cadastral Addr."
                    style={{ height: 220 }}>
                    <div className="item-row">
                        <div className="label-col">
                            <ControlLabel>Town, Municipality</ControlLabel>
                        </div>
                        <div className="form-col">
                            <Select/>
                            <div className="text-muted">ex. Rennes, Cesson-Sévigné</div>
                        </div>
                    </div>
                    <div className="item-row">
                        <div className="label-col">
                            <ControlLabel>Adress, Roads, Name or locality</ControlLabel>
                        </div>
                        <div className="form-col">
                            <FormControl type="text" bsSize="sm"/>
                            <div className="text-muted">ex. Henri Freville or La morinaie</div>
                        </div>
                    </div>
                    <div className="item-row">
                        <div className="label-col">
                            <ControlLabel>Road Number</ControlLabel>
                        </div>
                        <div className="form-col">
                            <FormControl style={{ height: 34, width: 100, "float": "left" }} type="text" bsSize="sm"/>
                            <div className="pull-left">
                                <Select
                                    menuPortalTarget={document.querySelector('body')}
                                    style={{ marginLeft: 5, width: 100 }} options={unitOptions}/>
                            </div>
                            <div style={{ "float": "left", marginLeft: 5, marginTop: 5 }} className="text-muted ">ex. 4 TER</div>
                        </div>
                    </div>
                </Tab>
                <Tab eventKey={3} title="Cadastral ID">
                    <div className="item-row">
                        <div className="label-col">
                            <ControlLabel>Identifier</ControlLabel>
                        </div>
                        <div className="form-col">
                            <FormControl type="text" bsSize="sm"/>
                            <div className="text-muted">ex. 20148301032610C0012</div>
                        </div>
                    </div>
                </Tab>
                <Tab eventKey={4} title="Lot">
                    <div className="item-row">
                        <div className="label-col">
                            <ControlLabel>Identifiers</ControlLabel>
                        </div>
                        <div className="form-col">
                            <FormControl
                                componentClassName="textarea"
                                type="text"
                                bsSize="sm"/>
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
                            <ControlLabel>Path</ControlLabel>
                        </div>
                        <div className="form-col">
                            <FormControl
                                className="pull-left"
                                style={{ width: 200 }}
                                placeholder="Load csv file" type="text" bsSize="sm"/>
                            <Button style={{ width: 100, marginLeft: 10 }}>
                                <Glyphicon style={{ marginRight: 5 }} glyph="add-folder"/>
                                Open File</Button>
                            <div
                                style={{ width: "100%", "float": "left" }}
                                className="text-muted">This file must contains comptecommunal id list separate by space or coma</div>
                        </div>
                    </div>
                </Tab>
            </Tabs>
            <SearchButtons {...props}/>
        </div>
    );
}
