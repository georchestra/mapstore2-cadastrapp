import React, { useState } from 'react';
import { SEARCH_TYPES } from '../../constants';
import { isSearchValid } from '../../utils/validation';


import { Tabs, Tab, Button, ButtonGroup} from "react-bootstrap";

import Reference from '../forms/Reference';
import Address from '../forms/Address';
import Identifier from '../forms/Identifier';
import Lot from '../forms/Lot';
import useFormState from '../../hooks/useFormState';

export default function PlotsSearch({onSearch = () => {}}) {
    const [currentTab, setCurrentTab] = useState('reference');
    const [searchState, setFormState, resetFormState] = useFormState();

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
                        values={searchState?.[SEARCH_TYPES.REFERENCE] ?? {}}
                        setValue={(key, value) => setFormState(SEARCH_TYPES.REFERENCE, key, value) }/>
                </Tab>
                <Tab eventKey={SEARCH_TYPES.ADDRESS} title="Cadastral Addr."
                    style={{ height: 220 }}>
                    <Address
                        values={searchState?.[SEARCH_TYPES.ADDRESS] ?? {}}
                        setValue={(key, value) => setFormState(SEARCH_TYPES.ADDRESS, key, value)} />
                </Tab>
                <Tab eventKey={SEARCH_TYPES.ID} title="Cadastral ID">
                    <Identifier
                        values={searchState?.[SEARCH_TYPES.ID] ?? {}}
                        setValue={(key, value) => setFormState(SEARCH_TYPES.ID, key, value)} />
                </Tab>
                <Tab eventKey={SEARCH_TYPES.LOT} title="Lot">
                    <Lot
                        values={searchState?.[SEARCH_TYPES.LOT] ?? {}}
                        setValue={(key, value) => setFormState(SEARCH_TYPES.LOT, key, value)} />
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
