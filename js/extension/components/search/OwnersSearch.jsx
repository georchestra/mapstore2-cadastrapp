
import React, {useState} from 'react';
import { isString } from "lodash";

import { Tabs, Tab, Button, ButtonGroup } from "react-bootstrap";
import useFormState from '../../hooks/useFormState';
import { SEARCH_TYPES } from '../../constants';

import User from '../forms/User';
import OwnerId from '../forms/OwnerId';
import Lot from '../forms/OwnerLot';

import { isSearchValid } from '../../utils/validation';
export default function OwnersSearch({onSearch = () => {}}) {
    const [currentTab, setCurrentTab] = useState(SEARCH_TYPES.USER);

    const [searchState, setFormState, resetFormState] = useFormState();
    return (
        <div className="owners-search">
            <h3>Owners Search</h3>
            <Tabs
                onSelect={k => setCurrentTab(k)}
                className="not-scrolled-tab"
                activeKey={currentTab}
                defaultActiveKey={SEARCH_TYPES.USER}>
                <Tab
                    eventKey={SEARCH_TYPES.USER} title="User or birthname">
                    <User
                        values={searchState?.[SEARCH_TYPES.USER] ?? {}}
                        setValue={(key, value) => setFormState(SEARCH_TYPES.USER, key, value)} />
                </Tab>
                <Tab eventKey={SEARCH_TYPES.OWNER_ID} title="Owner Identifier">
                    <OwnerId
                        values={searchState?.[SEARCH_TYPES.OWNER_ID] ?? {}}
                        setValue={(key, value) => setFormState(SEARCH_TYPES.OWNER_ID, key, value)} />
                </Tab>
                <Tab eventKey={SEARCH_TYPES.OWNER_LOT} title="Lot">
                    <Lot
                        values={searchState?.[SEARCH_TYPES.OWNER_LOT] ?? {}}
                        setValue={(key, value) => setFormState(SEARCH_TYPES.OWNER_LOT, key, value)} />
                </Tab>
            </Tabs>
            <ButtonGroup style={{ margin: "10px", "float": "right" }}>
                <Button
                    onClick={() => resetFormState(currentTab)}
                >Clear</Button>
                <Button
                    disabled={!isSearchValid(currentTab, searchState[currentTab])}
                    bsStyle="primary"
                    onClick={() => {
                        // text search opens the owners tab
                        if (currentTab === SEARCH_TYPES.USER && isString(searchState[SEARCH_TYPES.USER]?.proprietaire)) {
                            alert("TODO: Search owners");
                        } else {
                            // plot search
                            onSearch(currentTab, searchState[currentTab]);
                        }
                    }}
                >Search</Button>
            </ButtonGroup>
        </div>
    );
}
