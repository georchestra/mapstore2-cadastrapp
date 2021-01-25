import React, { useState } from 'react';
import { getCoProprietaire } from '../../api';

import CoOwnersTable from '../table/CoOwnersTable';
import PropertiesRadio from './PropertiesRadio';

import {
    Button,
    Glyphicon
} from "react-bootstrap";

// 350238000AD0053 for a set of many coowners.
export default function CoOwners({parcelle}) {
    const [expanded, setExpanded] = useState(false);
    const togglePanel = () => {
        setExpanded(!expanded);
    };
    const [selected, setSelected] = useState([]);
    const onRowsSelected = (rows) => setSelected(selected.concat(rows.map(r => r.rowIdx)));
    const onRowsDeselected = (rows) => setSelected(selected.filter(i => rows.map(r => r.rowIdx).indexOf(i) === -1));
    const atLeastOneSelected = selected.length > 0;
    return (<>
        <div style={{ margin: 10 }}>
            <Button
                bsStyle={expanded ? "primary" : "default"}
                onClick={togglePanel}
                {...(!atLeastOneSelected ? { disabled: 'true' } : {})}>
                <Glyphicon style={{ marginRight: 4 }} glyph="1-pdf" />
                        Properties List
            </Button>
        </div>
        <PropertiesRadio expanded={expanded} />
        <CoOwnersTable
            setSelected={setSelected}
            loadData={({ start, limit }) => getCoProprietaire({start, limit, parcelle})}
            selected={selected}
            onRowsSelected={onRowsSelected}
            onRowsDeselected={onRowsDeselected} />
    </>);

}
