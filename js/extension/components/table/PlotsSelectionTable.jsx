import React, {useState} from 'react';
import { sortBy } from 'lodash';
import ReactDataGrid from './MultilineHeaderTable';
import PropTypes from 'prop-types';

const columns = [{
    key: 'cgocommune',
    sortable: true,
    width: 80,
    name: "cadastrapp.parcelle.result.commune",
    resizable: true
}, {
    key: "sectionLabel",
    width: 80,
    sortable: true,
    name: "cadastrapp.parcelle.result.ccosec",
    resizable: true
}, {
    key: "dnupla",
    width: 100,
    sortable: true,
    name: "cadastrapp.parcelle.result.dnupla",
    resizable: true
}, {
    key: "cadastralAddr",  // "dnvoiri" + "dvoilib",
    sortable: true,
    name: "cadastrapp.parcelle.result.adresse",
    width: 100,
    resizable: true
}, {
    key: "dcntpa",
    width: 98,
    sortable: true,
    name: "cadastrapp.parcelle.result.surface",
    resizable: true
}];
function PlotsSelectionTable({
    onRowDoubleClick = () => {},
    onRowsSelected = () => { },
    onRowsDeselected = () => { },
    data,
    selectedKeys
}) {
    const [sorting, setSorting] = useState();
    if (!data) {
        return null;
    }
    // create mixed column for address and section
    const processedRows = data.map(v => ({ ...v, sectionLabel: v.ccopre + v.ccosec, cadastralAddr: v.dnvoiri + " " + v.cconvo + " " + v.dvoilib }));
    const rows = (({sortColumn, sortDirection} = {}) => {
        if (sortDirection === "ASC") {
            return sortBy(processedRows, sortColumn);
        } else if (sortDirection === "DESC") {
            return sortBy(processedRows, sortColumn).reverse();
        }
        return processedRows;
    })(sorting);
    return (<ReactDataGrid
        sortable
        onRowDoubleClick={onRowDoubleClick}
        rowGetter={i => rows[i]}
        rowsCount={rows.length}
        minHeight={230}
        columns={columns}
        onGridSort={(sortColumn, sortDirection) => {
            // sortDirection: "ASC", "DESC", "NONE"
            if (sortDirection === "NONE") {
                setSorting(undefined);
            } else {
                setSorting({sortColumn, sortDirection});
            }
        }}
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
