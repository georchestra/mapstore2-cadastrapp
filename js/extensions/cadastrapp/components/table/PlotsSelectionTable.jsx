import React from 'react';
import Helper from './MutlilineHelper';

import ReactDataGrid from 'react-data-grid';
import PropTypes from 'prop-types';


class PlotsSelectionTable extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
            key: 'cgocommune',
            name: "Town", // TODO: localize headers
            resizable: true,
            width: 50
        }, {
            key: "ccosec",
            name: "Section",
            resizable: true,
            width: 50
        }, {
            key: "cadastralAddr",  // "dnvoiri" + "dvoilib",
            name: "Cadastrall Addr.",
            resizable: true
        }, {
            key: "dnupla",
            name: "Plan Number",
            width: 50,
            resizable: true

        }, {
            key: "dcntpa",
            name: "Surface DGFIP in m²",
            width: 50,
            resizable: true
        }];
        this.helper = new Helper(this.columns);
    }

    render() {
        if (!this.props.data) {
            return null;
        }
        const rows = this.props.data.map(v => ({ ...v, cadastralAddr: v.dnvoiri + " " + v.dvoilib }));
        return (
            <div className="react-grid-multiline-header">
                <ReactDataGrid
                    headerRowHeight={this.helper.headerRowHeight}
                    columns={this.helper.columns}
                    rowGetter={i => rows[i]}
                    rowsCount={rows.length}
                    minHeight={250}

                    rowSelection={{
                        showCheckbox: true,
                        enableShiftSelect: true,
                        /*
                        onRowsSelected: onRowsSelected,
                        onRowsDeselected: onRowsDeselected,
                        */
                        selectBy: {
                            isSelectedKey: 'selected' // use a selected array
                        }
                    }}
                />
            </div>
        );
    }
}
PlotsSelectionTable.propTypes = {
    data: PropTypes.array
};
export default PlotsSelectionTable;
