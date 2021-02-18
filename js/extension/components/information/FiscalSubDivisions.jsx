import React, { useState } from 'react';
import FiscalSubdivisionsTable from '../table/FiscalSubdivisionsTable';

export default function FiscalSubDivisions({ fiscalSubDiv = []}) {
    // row selection
    const [selected, setSelected] = useState([]);
    const onRowsSelected = (rows) => setSelected(rows.map(r => r.rowIdx));
    const onRowsDeselected = (rows) => setSelected(selected.filter(i => rows.map(r => r.rowIdx).indexOf(i) === -1));
    return (<>
        <FiscalSubdivisionsTable
            data={fiscalSubDiv}
            selected={selected}
            onRowsSelected={onRowsSelected}
            onRowsDeselected={onRowsDeselected} />
    </>);

}
