import React, {useEffect, useState} from 'react';
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

    // Calcul height of parcels tab 
    const [dynamicHeight, setDynamicHeight] = useState(0);
    const parentChildren = document.querySelector(".right-side").children.length
    
    useEffect(() => {
        const calculateHeight = () => {
            const parent = document.querySelector(".right-side");
            const parentHeight = document.querySelector(".right-side").clientHeight;
            // Header height
            const h3Height = document.querySelector("h3.pull-left").clientHeight;
            const ulSize = document.querySelector(".plots-selection .nav").clientHeight;
            // Row height min 35px
            const rowElement = document.querySelector(".plots-selection .react-grid-Row");
            const rowHeight = rowElement ? rowElement.style.height : 35;
            // add margin if needed to parent to see all the panel on top of footer
            const tabElement = document.querySelector(".plots-selection .tab-content");
            parent.children.length > 2 ? tabElement.style.marginBottom = "50px" : tabElement.style.marginBottom = "";            

            // Calcul tab height needed to display.
            // +30 add a security bottom margin to avoid scrollbar.
            // 200 is the minimum height no matter content.
            // -220 : as the height is based on the total height of cadastrapp component, we need to mount the bottom of the tab.
            const remainingHeight = parent.children.length > 2 ? Math.max(data.length * rowHeight + h3Height + ulSize + 30, 200) : Math.max(parentHeight - 220, 200);
            setDynamicHeight(remainingHeight);
        };
    
        calculateHeight();

        window.addEventListener("click", calculateHeight);
        window.addEventListener("resize", calculateHeight);
        return () => {
            window.removeEventListener("click", calculateHeight);
            window.removeEventListener("resize", calculateHeight);
        }
    }, [data, parentChildren]);

    
    return (<ReactDataGrid
        sortable
        onRowDoubleClick={onRowDoubleClick}
        rowGetter={i => rows[i]}
        rowsCount={rows.length}
        minHeight={dynamicHeight}
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
