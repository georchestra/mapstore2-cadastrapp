import React from 'react';

import ReactDataGrid from './MultilineHeaderTable';
import PropTypes from 'prop-types';
import { EmptyRowsView } from './EmptyRowsView';

const columns = [{
    i18n: 'cadastrapp.result.owner.comptecommunal',
    name: "Identifier",
    width: 130,
    resizable: true,
    key: 'comptecommunal'
}, {
    name: "Full name information",
    width: 500,
    i18n: 'cadastrapp.result.owner.ddenom',
    resizable: true,
    key: 'app_nom_usage'
}];
// Table for owners in t
function OwnersTable({
    loading,
    onRowClick = () => {},
    onRowsSelected = () => { },
    onRowsDeselected = () => { },
    data,
    selected = []
}) {
    if (!data) {
        return null;
    }
    // create mixed column for address
    const rows = loading ? [] : data;
    return (<ReactDataGrid
        onRowClick={onRowClick}
        emptyRowsView={() => <EmptyRowsView loading={loading} />}
        rowGetter={i => rows[i]}
        rowsCount={rows.length}
        minHeight={250}
        columns={columns}
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
OwnersTable.propTypes = {
    data: PropTypes.array
};
export default OwnersTable;
