import React, { useState, useEffect} from 'react';
import { Button } from 'react-bootstrap';

import { getBatiments } from '../../api';
import BuildingsButtons from './building/BuildingButtons';
import BuildingsTable from '../table/BuildingsTable';

export default function Buildings({
    parcelle,
    letters = []
}) {
    const showBuildingInfo = () => { alert("TODO") };
    const [letter, setLetter] = useState();
    const [firstOpen, setFirstOpen] = useState(false);
    // select first letter on startup
    useEffect(() => {
        if (letters.length > 0 && !firstOpen) {
            setFirstOpen(true);
            setLetter(letters[0].dnubat);
        }
    }, [letters]);

    // row selection
    const [selected, setSelected] = useState([]);
    const onRowClick = r => setSelected([r.rowIdx]);
    const onRowsSelected = (rows) => setSelected(rows.map(r => r.rowIdx));
    const onRowsDeselected = (rows) => setSelected(selected.filter(i => rows.map(r => r.rowIdx).indexOf(i) === -1));

    // load buildings for letter
    const [buildings, setBuildings] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        getBatiments({ parcelle, dnubat: letter }).then((data) => {
            setBuildings(data);
            setSelected([]);
            setLoading(false);
        });
    }, [letter]);

    return (<>
        <div style={{ margin: 10 }}>
            <span style={{ marginRight: 10 }}>Batiments:</span>
            {letters.map(({ dnubat }) => <Button bsStyle={letter === dnubat ? "primary" : undefined} onClick={() => setLetter(dnubat)}>{dnubat}</Button>)}
            <BuildingsButtons
                selected={selected}
            />
        </div>

        <BuildingsTable
            onRowClick={onRowClick}
            selected={selected}
            loading={loading}
            data={buildings}
            onRowsSelected={onRowsSelected}
            onRowsDeselected={onRowsDeselected}
            onRowDoubleClick={showBuildingInfo}
        />
    </>);

}