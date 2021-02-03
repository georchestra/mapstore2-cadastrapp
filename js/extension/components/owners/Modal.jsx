import React, { useState } from 'react';
import { SEARCH_TYPES } from '../../constants';
import PropertiesRadio from '../information/PropertiesRadio';
import { downloadResponse } from '../../utils/download';



import '../../ficheUniteFonciere.css';


import Modal from '@mapstore/components/misc/Modal';
import OwnersListTable from '../table/OwnersListTable';

import { Button, Glyphicon } from 'react-bootstrap';
import { exportAsCsv } from '../../api';

export default function OwnersModal({
    loading,
    show,
    onSearch = () => {},
    owners = [],
    onClose
}) {
    const [downloading, setDownloading] = useState(false);
    const [selected, setSelected] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const oneSelected = selected.length === 1;
    const onRowClick = (i) => setSelected(selected.length === 1 && selected[0] === i ? [] : [i]); // toggle row selection
    const onRowsSelected = (rows) => setSelected(selected.concat(rows.map(r => r.rowIdx)));
    const onRowsDeselected = (rows) => setSelected(selected.filter(i => rows.map(r => r.rowIdx).indexOf(i) === -1));
    return (<Modal
        style={{ maxHeight: "100%", overflowY: "auto", zIndex: 10000 }}
        show={show}
        onHide={onClose}>
        <Modal.Header closeButton>
            <Modal.Title>Owners List result</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: 700, overflow: "auto" }} >
            <div style={{ margin: 10 }}>
                <Button
                    disabled={loading || !oneSelected}
                    bsStyle={expanded ? "primary" : undefined}
                    onClick={() => {
                        setExpanded(!expanded);
                    }}
                >
                    <Glyphicon style={{ marginRight: 4 }} glyph="1-pdf" />
                    Properties details
                </Button>
                <PropertiesRadio showParcelle={false} expanded={expanded} data={owners} selected={selected} />
            </div>
            <OwnersListTable
                onRowClick={onRowClick}
                onRowsSelected={onRowsSelected}
                onRowsDeselected={onRowsDeselected}
                data={owners}
                selected={selected} />
        </Modal.Body>
        <Modal.Footer>
            <Button
                disabled={loading || !oneSelected}
                bsStyle="primary"
                onClick={() => {
                    onClose();
                    onSearch(SEARCH_TYPES.COMPTE_COMMUNAL, owners[selected[0]]);

                }}
            >
                See plot(s)
            </Button>
            <Button
                disabled={loading || downloading}
                bsStyle="primary"
                onClick={() => {
                    const titles = ["Owner id", "Full name information"]; // TODO: localize
                    const dataJson = oneSelected ? [owners[selected[0]]] : owners;
                    const rows = dataJson.map(({ comptecommunal, app_nom_usage }) => ([comptecommunal, app_nom_usage]));
                    setDownloading(true);
                    exportAsCsv({ data: [titles, rows[0]]})
                        .then(response => {
                            setDownloading(false);
                            if (oneSelected) {
                                downloadResponse(response, {});
                            } else {
                                // in case all list have to be downloaded,
                                // recreate the data to download
                                const separator = response.data[response.data.indexOf(titles[1]) - 1];
                                const data = [titles.join(separator), ...rows].join("\n");
                                downloadResponse({
                                    ...response,
                                    data
                                });
                            }

                        }).catch(() => {
                            setDownloading(false); // TODO: notify error.
                        });
                }}
            >
                {oneSelected ? "Export row as csv" : "Export list as csv"}
            </Button>
        </Modal.Footer>
    </Modal>);
}