import React from 'react';

import ReactDataGrid from './MultilineHeaderTable';
import PropTypes from 'prop-types';
import { EmptyRowsView } from './EmptyRowsView';

const columns = [{
    name: 'cadastrapp.proprietaires.ccodro',
    resizable: true,
    width: 70,
    key: 'ccodro'
}, {
    name: 'cadastrapp.duc.compte',
    width: 130,
    resizable: true,
    key: 'comptecommunal'
}, {
    width: 200,
    name: 'cadastrapp.duc.nom',
    resizable: true,
    key: 'app_nom_usage'
}, {
    id: 'adresse',
    width: 300,
    name: 'cadastrapp.duc.adresse',
    resizable: true,
    key: 'adresse'
}, {
    width: 120,
    name: 'cadastrapp.duc.datenaissance',
    resizable: true,
    key: 'jdatnss'
}, {
    width: 120,
    name: 'cadastrapp.duc.lieunaissance',
    resizable: true,
    key: 'dldnss'
}, {
    width: 200,
    name: 'cadastrapp.duc.cco_lib',
    resizable: true,
    key: 'ccodro_lib'
}, {
    width: 120,
    name: 'cadastrapp.duc.dformjur',
    resizable: true,
    key: 'dformjur'
}];

function OwnersTable({
    loading,
    onRowClick = () => { },
    onRowsSelected = () => { },
    onRowsDeselected = () => { },
    data,
    selected = []
}) {
    if (!data) {
        return null;
    }

    // create mixed column for address
    const rows = loading ? [] : data.map(v => ({ ...v, cadastralAddr: v.dnvoiri + " " + v.cconvo + " " + v.dvoilib }));
    return (<ReactDataGrid
        onRowClick={onRowClick}
        emptyRowsView={() => <EmptyRowsView loading={loading} />}
        rowGetter={i => rows[i]}
        rowsCount={rows.length}
        minHeight={250}
        columns={columns}
        rowSelection={{
            showCheckbox: true,
            enableShiftSelect: true,
            onRowsSelected,
            onRowsDeselected,
            selectBy: {
                indexes: selected
            }
        }}
    />);
}
OwnersTable.propTypes = {
    data: PropTypes.array
};
export default OwnersTable;
