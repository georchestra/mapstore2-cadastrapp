import React, { useState } from 'react';
import OwnersTable from '../table/OwnersTable';
import PropertiesRadio from './PropertiesRadio';

import {
    Button,
    Glyphicon
} from "react-bootstrap";


export default function Owners({ owners = []}) {
    const [expanded, setExpanded] = useState(false);
    const togglePanel = () => {
        setExpanded(!expanded);
    };
    const [selected, setSelected] = useState([]);
    const onRowClick = r => setSelected([r.rowIdx]);
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
        <OwnersTable
            data={owners}
            selected={selected}
            onRowClick={onRowClick}
            onRowsSelected={onRowsSelected}
            onRowsDeselected={onRowsDeselected} />
    </>);

}
