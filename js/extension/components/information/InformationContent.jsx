import React from 'react';
import {Tab, Tabs } from 'react-bootstrap';
import Plot from './Plot';

import Owners from './Owners';
import CoOwners from './CoOwners';
import Buildings from './Buildings';
import FiscalSubDivisions from './FiscalSubDivisions';
import HistoryMutation from './HistoryMutation';

export default function InformationContent({
    parcelle,
    owners = [],
    letters = [],
    fiuc = {},
    fiucHistoryMutation = [],
    fiscalSubDiv = [],
    authLevel = {},
    additionalData = {}
}) {
    const { isCNIL1, isCNIL2 } = authLevel; // TODO: get from state/props
    return (
        <Tabs defaultActiveKey={1} id="uncontrolled-tab-example" onSelect={() => /* refresh table column sizes */ setTimeout(() => {window.dispatchEvent(new Event('resize'));}, 500)}>
            <Tab eventKey={1} title="Plot">
                <Plot isCNIL1={isCNIL1} isCNIL2={isCNIL2} parcelle={parcelle} fiuc={fiuc} {...additionalData}/>
            </Tab>
            {isCNIL1 || isCNIL2  ? <Tab eventKey={2} title="Owners">
                <Owners owners={owners} parcelle={parcelle} />
            </Tab> : undefined}
            {isCNIL1 || isCNIL2 ? <Tab eventKey={3} title="Co-Owners">
                <CoOwners parcelle={parcelle}/>
            </Tab> : undefined}
            {isCNIL2 ? <Tab eventKey={4} title="Building(s)">
                <Buildings parcelle={parcelle} letters={letters}/>
            </Tab> : undefined}
            {isCNIL2 ? <Tab eventKey={5} title="Subdivisions Fiscales">
                <FiscalSubDivisions parcelle={parcelle} fiscalSubDiv={fiscalSubDiv} />
            </Tab> : undefined}
            <Tab eventKey={6} title="Mutation History">
                <HistoryMutation parcelle={parcelle} fiucHistoryMutation={fiucHistoryMutation} />
            </Tab>
        </Tabs>
    );
}
