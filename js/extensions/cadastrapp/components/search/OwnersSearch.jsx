
import React from 'react';
import Select from 'react-select';
import { StrList } from '../lists/StrList';

import { Tabs, Tab, Button, ControlLabel, FormControl, Checkbox, Glyphicon } from "react-bootstrap";


import SearchButtons from './SearchButtons';

export default function OwnersSearch(props) {
    const className = props.isShown ? "owners-search" : "collapse";
    return (
        <div className={className}>
            <h3>Owners Search</h3>
            <Tabs
                className="not-scrolled-tab"
                defaultActiveKey={1} id="uncontrolled-tab-example">
                <Tab

                    eventKey={1} title="User or birthname">
                    <div className="item-row">
                        <div className="label-col">
                            <ControlLabel>Town, Municipality</ControlLabel>
                        </div>
                        <div className="form-col">
                            <Select/>
                            <div className="text-muted">ex: Rennes, Cesson-Sevigne</div>
                        </div>
                    </div>
                    <div className="item-row">
                        <div className="label-col">
                            <ControlLabel>Last name and first name</ControlLabel>
                        </div>
                        <div className="form-col">
                            <Select/>
                            <div className="text-muted">ex: Jeog Pierre</div>
                        </div>
                    </div>
                    <div className="item-row">
                        <div className="label-col">
                            <ControlLabel/>
                        </div>
                        <div className="form-col">
                            <Checkbox>
                                Search by Birth name
                            </Checkbox>
                            <div className="text-muted">Echap to load query without completion</div>
                        </div>
                    </div>
                </Tab>
                <Tab eventKey={2} title="Owner Identifier">
                    <div className="item-row">
                        <div className="label-col">
                            <ControlLabel>Town, Municipality</ControlLabel>
                        </div>
                        <div className="form-col">
                            <Select/>
                            <div className="text-muted">ex: Rennes, Cesson-Sevigne</div>
                        </div>
                    </div>
                    <div className="item-row">
                        <div className="label-col">
                            <ControlLabel>Owners</ControlLabel>
                        </div>
                        <div className="form-col">
                            <StrList/>
                        </div>
                    </div>
                </Tab>
                <Tab eventKey={3} title="Lot">
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
                                <Glyphicon style={{ marginRight: 5 }} glyph="add-folder"/>                                Open File</Button>
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
