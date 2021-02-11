import React from 'react';
import ReactDataGrid from './MultilineHeaderTable';

import { EmptyRowsView } from './EmptyRowsView';

function BuildingsTable({
    loading,
    onRowClick = () => {},
    onRowDoubleClick = () => { },
    onRowsSelected = () => { },
    onRowsDeselected = () => { },
    data = [],
    selected = []
}) {
    if (!data) {
        return null;
    }
    const columns = [{
        name: 'cadastrapp.duc.batiment_niveau',
        resizable: true,
        key: 'dniv'
    }, {
        name: 'cadastrapp.duc.door',
        resizable: true,
        key: 'dpor'
    }, {
        name: 'cadastrapp.duc.type',
        resizable: true,
        key: 'ccoaff_lib'
    }, {
        name: 'cadastrapp.duc.annee_construction',
        resizable: true,
        width: 170,
        key: 'jannat'
    }, {
        name: 'cadastrapp.duc.revenu',
        resizable: true,
        key: 'revcad'
    }, {
        name: 'cadastrapp.duc.compte',
        resizable: true,
        key: 'comptecommunal'
    }, {
        name: 'cadastrapp.duc.nom_usage',
        resizable: true,
        width: 150,
        key: 'app_nom_usage'
    }, {
        name: 'cadastrapp.duc.nom_naissance',
        resizable: true,
        width: 150,
        key: 'app_nom_naissance'
    }, {
        name: 'cadastrapp.duc.invar',
        resizable: true,
        key: 'invar'
    }];

    const rows = loading ? [] : data.map((row, i) => ({
        originalIndex: i,
        ...row
    }));
    return (<ReactDataGrid
        emptyRowsView={() => <EmptyRowsView loading={loading} />}
        rowGetter={i => rows[i]}
        rowsCount={rows.length}
        minHeight={250}
        columns={columns}
        onRowClick={(i, row) => onRowsSelected([{rowIdx: i, row}])}
        onRowDoubleClick={onRowDoubleClick}
        rowSelection={{
            showCheckbox: false,
            enableShiftSelect: false,
            onRowsSelected,
            onRowsDeselected,
            selectBy: {
                keys: {
                    rowKey: 'originalIndex',
                    values: selected
                }
            }
        }}
    />);
}

export default BuildingsTable;
