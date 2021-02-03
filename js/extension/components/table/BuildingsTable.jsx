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
        i18n: 'cadastrapp.duc.batiment_niveau',
        resizable: true,
        name: "Level",
        key: 'dniv'
    }, {
        i18n: 'cadastrapp.duc.door',
        resizable: true,
        name: "Door",
        key: 'dpor'
    }, {
        i18n: 'cadastrapp.duc.type',
        resizable: true,
        name: 'Type',
        key: 'ccoaff_lib'
    }, {
        i18n: 'cadastrapp.duc.annee_construction',
        resizable: true,
        width: 120,
        name: "Construction date",
        key: 'jannat'
    }, {
        i18n: 'cadastrapp.duc.revenu',
        resizable: true,
        name: "Rent",
        key: 'revcad'
    }, {
        i18n: 'cadastrapp.duc.compte',
        resizable: true,
        name: "Identifier",
        key: 'comptecommunal'
    }, {
        i18n: 'cadastrapp.duc.nom_usage',
        resizable: true,
        name: "Usage name",
        key: 'app_nom_usage'
    }, {
        i18n: 'cadastrapp.duc.nom_naissance',
        resizable: true,
        name: "Birth name",
        key: 'app_nom_naissance'
    }, {
        i18n: 'cadastrapp.duc.invar',
        resizable: true,
        name: 'invar',
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
