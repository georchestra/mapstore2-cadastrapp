import React, { useState, useEffect} from 'react';
import { Button } from 'react-bootstrap';

import { getBatiments } from '../../api';
import BuildingsButtons from './building/BuildingButtons';
import BuildingsTable from '../table/BuildingsTable';
import Description from './building/Description';


export default function Buildings({
    parcelle,
    letters = []
}) {
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
    const onRowsSelected = (rows) => setSelected(rows.map(({row}) => row.originalIndex));
    const onRowsDeselected = (rows) => setSelected(selected.filter(i => rows.map(({ row }) => row.originalIndex).indexOf(i) === -1));

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

    // Description
    const [showDescription, setShowDescription] = useState(false);
    const showBuildingInfo = (i, row) => {
        setSelected([row.originalIndex]);
        setShowDescription(true);
    };

    return (<>
        <div style={{ margin: 10 }}>
            <span style={{ marginRight: 10 }}>Batiments:</span>
            {letters.map(({ dnubat }) => <Button bsStyle={letter === dnubat ? "primary" : undefined} onClick={() => setLetter(dnubat)}>{dnubat}</Button>)}
            <BuildingsButtons
                setShowDescription={setShowDescription}
                data={buildings}
                selected={selected}
                dnubat={letter}
                parcelle={parcelle}
            />
        </div>
        <Description
            dnubat={letter}
            row={buildings.filter((_, i) => selected.includes(i))[0]}
            show={showDescription}
            onClose={() => {setShowDescription(false); }}/>
        <BuildingsTable
            selected={selected}
            loading={loading}
            data={buildings}
            onRowsSelected={onRowsSelected}
            onRowsDeselected={onRowsDeselected}
            onRowDoubleClick={showBuildingInfo}
        />
    </>);

}