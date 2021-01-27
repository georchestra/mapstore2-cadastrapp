import React from 'react';
import ReactDataGrid from './MultilineHeaderTable';

import { EmptyRowsView } from './EmptyRowsView';
const columns = [{
    name: "Lettre indicative",
    key: 'ccosub'
}, {
    name: "Contenance",
    key: 'dcntsf' // contenance
}, {
    name: "Nature de culture",
    key: 'nat_culture'
}, {
    name: "Revenu au 01/01",
    key: 'drcsub'
}
];

function FiscalSubdivisionsTable({
    loading,
    onRowClick = () => { },
    onRowDoubleClick = () => { },
    onRowsSelected = () => { },
    onRowsDeselected = () => { },
    data = [],
    selected = []
}) {
    if (!data) {
        return null;
    }


    const rows = loading ? [] : data;
    return (<ReactDataGrid
        emptyRowsView={() => <EmptyRowsView loading={loading} />}
        rowGetter={i => rows[i]}
        rowsCount={rows.length}
        minHeight={250}
        columns={columns}
        onRowClick={onRowClick}
        onRowDoubleClick={onRowDoubleClick}
        rowSelection={{
            showCheckbox: false,
            enableShiftSelect: false,
            onRowsSelected,
            onRowsDeselected,
            selectBy: {
                indexes: selected
            }
        }}
    />);
}

export default FiscalSubdivisionsTable;
