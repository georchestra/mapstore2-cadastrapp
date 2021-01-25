import React from 'react';

import ReactDataGrid from './MultilineHeaderTable';
import PropTypes from 'prop-types';
import { EmptyRowsView } from './EmptyRowsView';

const columns = [{
    i18n: 'cadastrapp.proprietaires.ccodro',
    name: "Identifier",
    resizable: true,
    width: 70,
    key: 'ccodro'
}, {
    i18n: 'cadastrapp.duc.compte',
    name: "Identifier",
    width: 130,
    resizable: true,
    key: 'comptecommunal'
}, {
    name: "Last name",
    width: 200,
    i18n: 'cadastrapp.duc.nom',
    resizable: true,
    key: 'app_nom_usage'
}, {
    id: 'adresse',
    name: "Address",
    width: 300,
    i18n: 'cadastrapp.duc.adresse',
    resizable: true,
    key: 'adresse'
}, {
    name: "Date of birth",
    width: 120,
    i18n: 'cadastrapp.duc.datenaissance',
    resizable: true,
    key: 'jdatnss'
}, {
    name: "Birth location",
    width: 120,
    i18n: 'cadastrapp.duc.lieunaissance',
    resizable: true,
    key: 'dldnss'
}, {
    name: "Right code",
    width: 120,
    i18n: 'cadastrapp.duc.cco_lib',
    resizable: true,
    key: 'ccodro_lib'
}, {
    name: "Legal form",
    width: 120,
    i18n: 'cadastrapp.duc.dformjur',
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
    const rows = loading ? [] : data.map(v => ({ ...v, cadastralAddr: v.dnvoiri + " " + v.dvoilib }));
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
