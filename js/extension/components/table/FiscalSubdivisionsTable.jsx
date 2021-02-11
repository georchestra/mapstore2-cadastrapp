import React from 'react';
import ReactDataGrid from './MultilineHeaderTable';

import { EmptyRowsView } from './EmptyRowsView';
const columns = [{
    name: "cadastrapp.duc.lettreindic",
    key: 'ccosub'
}, {
    name: "cadastrapp.duc.contenance",
    key: 'dcntsf'
}, {
    name: "cadastrapp.duc.terrain",
    key: 'nat_culture'
}, {
    name: "cadastrapp.duc.revenu_1",
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
