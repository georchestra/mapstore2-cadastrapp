import React from 'react';

import ReactDataGrid from './MultilineHeaderTable';
import PropTypes from 'prop-types';


function PlotsSelectionTable({
    onRowDoubleClick = () => {},
    onRowsSelected = () => { },
    onRowsDeselected = () => { },
    data,
    selectedKeys
}) {
    if (!data) {
        return null;
    }
    const columns = [{
        key: 'cgocommune',
        name: "Town", // TODO: localize headers
        resizable: true,
        width: 70
    }, {
        key: "ccosec",
        name: "Section",
        resizable: true,
        width: 70
    }, {
        key: "cadastralAddr",  // "dnvoiri" + "dvoilib",
        name: "Cadastrall Addr.",
        width: 140,
        resizable: true
    }, {
        key: "dnupla",
        name: "Plan Number",
        width: 70,
        resizable: true

    }, {
        key: "dcntpa",
        name: "Surface DGFIP in m²",
        width: 70,
        resizable: true
    }];
    // create mixed column for address
    const rows = data.map(v => ({ ...v, cadastralAddr: v.dnvoiri + " " + v.dvoilib }));
    return (<ReactDataGrid
        onRowDoubleClick={onRowDoubleClick}
        rowGetter={i => rows[i]}
        rowsCount={rows.length}
        minHeight={250}
        columns={columns}
        rowSelection={{
            showCheckbox: true,
            enableShiftSelect: true,
            onRowsSelected: (rr = []) => onRowsSelected(rr.map(({ row }) => row)),
            onRowsDeselected: (rr = []) => onRowsDeselected(rr.map(({ row }) => row)),
            selectBy: {
                keys: {
                    rowKey: 'parcelle',
                    values: selectedKeys
                }
            }
        }}
    />);
}
PlotsSelectionTable.propTypes = {
    data: PropTypes.array
};
export default PlotsSelectionTable;
