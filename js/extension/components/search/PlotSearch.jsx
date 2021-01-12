import React, { useState } from 'react';
import { set } from '@mapstore/utils/ImmutableUtils';
import { SEARCH_TYPES } from '../../constants';
import { isSearchValid } from '../../utils/validation';


import { Tabs, Tab, Button, ButtonGroup, ControlLabel, FormControl, Glyphicon } from "react-bootstrap";
import Select from 'react-select';

import Reference from '../forms/Reference';
import Identifier from '../forms/Identifier';



export default function PlotsSearch({onSearch = () => {}}) {
    const [currentTab, setCurrentTab] = useState('reference');
    const [searchState, setSearchState] = useState({});
    const setFormState = (eventKey, key, value) => {
        const path = `['${eventKey}'].${key}`;
        setSearchState(set(path, value, searchState));
    };
    const resetFormState = (eventKey) => {
        setSearchState(set(eventKey, undefined, searchState));
    }

    return (
        <div className="plots-search">
            <h3>Plots Search</h3>
            <Tabs
                className="not-scrolled-tab"
                onSelect={k => setCurrentTab(k)}
                activeKey={currentTab}
                defaultActiveKey={currentTab}>
                <Tab eventKey={SEARCH_TYPES.REFERENCE} title="Reference">
                    <Reference
                        values={searchState?.[SEARCH_TYPES.REFERENCED] ?? {}}
                        setValue={(key, value) => setFormState(SEARCH_TYPES.REFERENCE, key, value) }/>
                </Tab>
                <Tab eventKey={SEARCH_TYPES.ADDRESS} title="Cadastral Addr."
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
                                    style={{ marginLeft: 5, width: 100 }} options={[{ value: '--', label: '--' }]}/>
                            </div>
                            <div style={{ "float": "left", marginLeft: 5, marginTop: 5 }} className="text-muted ">ex. 4 TER</div>
                        </div>
                    </div>
                </Tab>
                <Tab eventKey={SEARCH_TYPES.ID} title="Cadastral ID">
                    <Identifier
                        values={searchState?.[SEARCH_TYPES.ID] ?? {}}
                        setValue={(key, value) => setFormState(SEARCH_TYPES.ID, key, value)} />
                </Tab>
                <Tab eventKey={SEARCH_TYPES.LOT} title="Lot">
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
            <ButtonGroup style={{ margin: "10px", "float": "right" }}>
                <Button
                    onClick={() => resetFormState(currentTab)}
                >Clear</Button>
                <Button
                    disabled={!isSearchValid(currentTab, searchState[currentTab]) }
                    bsStyle="primary"
                    onClick={() => {
                        onSearch(currentTab, searchState[currentTab]);
                    }}
                >Search</Button>
            </ButtonGroup>
        </div>
    );
}
